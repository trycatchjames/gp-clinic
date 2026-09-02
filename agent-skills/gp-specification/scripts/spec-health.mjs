#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const argumentsList = process.argv.slice(2);
const repositoryRoot = path.resolve(argumentsList.find((argument) => !argument.startsWith('-')) ?? process.cwd());
const specificationRoot = path.join(repositoryRoot, 'spec');
const jsonOutput = argumentsList.includes('--json');

if (!existsSync(path.join(repositoryRoot, 'SPEC.md')) || !existsSync(specificationRoot)) {
  console.error('Run from a GP Clinic repository containing SPEC.md and spec/.');
  process.exit(2);
}

function walk(directory, predicate = () => true) {
  const files = [];
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    const stats = statSync(file);
    if (stats.isDirectory()) files.push(...walk(file, predicate));
    else if (predicate(file)) files.push(file);
  }
  return files;
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function summarize(files) {
  return files.reduce(
    (summary, file) => {
      const text = readFileSync(file, 'utf8');
      summary.files += 1;
      summary.bytes += Buffer.byteLength(text);
      summary.lines += text ? text.split('\n').length : 0;
      summary.words += countWords(text);
      return summary;
    },
    { files: 0, bytes: 0, lines: 0, words: 0 },
  );
}

const specFiles = walk(specificationRoot);
const markdownFiles = [path.join(repositoryRoot, 'SPEC.md'), ...specFiles.filter((file) => file.endsWith('.md'))];
const gherkinFiles = specFiles.filter((file) => file.endsWith('.feature'));
const reviewFiles = specFiles.filter((file) => path.basename(file) === 'review.yaml');
const errors = [];
const warnings = [];

const markdownLink = /\[[^\]]*\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(markdownLink)) {
    const rawTarget = match[1].split('#')[0];
    if (!rawTarget || /^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) continue;
    const target = path.resolve(path.dirname(file), decodeURIComponent(rawTarget));
    if (!existsSync(target)) {
      errors.push(`${path.relative(repositoryRoot, file)} links to missing ${rawTarget}`);
    }
  }
}

let scenarioCount = 0;
for (const file of gherkinFiles) {
  const text = readFileSync(file, 'utf8');
  if (!/^Feature:\s+\S/m.test(text)) {
    errors.push(`${path.relative(repositoryRoot, file)} has no Feature declaration`);
  }
  const scenarios = [...text.matchAll(/^\s+(?:Scenario|Scenario Outline):\s+(.+)$/gm)].map((match) => match[1].trim());
  scenarioCount += scenarios.length;
  if (scenarios.length === 0) {
    errors.push(`${path.relative(repositoryRoot, file)} has no scenarios`);
  }
  const duplicates = scenarios.filter((name, index) => scenarios.indexOf(name) !== index);
  if (duplicates.length > 0) {
    errors.push(`${path.relative(repositoryRoot, file)} repeats scenario ${duplicates[0]}`);
  }
}

for (const file of reviewFiles) {
  const text = readFileSync(file, 'utf8');
  for (const key of ['human_review', 'automated_review', 'review_evidence']) {
    if (!new RegExp(`^${key}:`, 'm').test(text)) {
      errors.push(`${path.relative(repositoryRoot, file)} is missing ${key}`);
    }
  }
  for (const key of ['screenshots', 'flows', 'fixtures']) {
    if (!new RegExp(`^  ${key}:`, 'm').test(text)) {
      errors.push(`${path.relative(repositoryRoot, file)} is missing review_evidence.${key}`);
    }
  }
}

const capabilityRoot = path.join(specificationRoot, 'capabilities');
const capabilityDirectories = readdirSync(capabilityRoot)
  .map((name) => path.join(capabilityRoot, name))
  .filter((directory) => statSync(directory).isDirectory());

for (const directory of capabilityDirectories) {
  const name = path.basename(directory);
  const files = walk(directory);
  const compactSpecification = path.join(directory, 'spec.md');
  const compactAcceptance = path.join(directory, 'acceptance.feature');
  const legacyParts = ['overview.md', 'rules.md', 'interactions.md', 'permissions.md']
    .map((file) => path.join(directory, file))
    .filter(existsSync);
  if (!existsSync(compactSpecification)) {
    errors.push(`spec/capabilities/${name} has no spec.md`);
  } else {
    const specification = readFileSync(compactSpecification, 'utf8');
    for (const section of ['Dependencies', 'Rules', 'Interactions', 'Permissions', 'Screen contracts']) {
      if (!new RegExp(`^## ${section}$`, 'm').test(specification)) {
        errors.push(`spec/capabilities/${name}/spec.md is missing ${section}`);
      }
    }
  }
  if (legacyParts.length > 0 || existsSync(path.join(directory, 'screens')) || existsSync(path.join(directory, 'acceptance'))) {
    errors.push(`spec/capabilities/${name} contains legacy capability files`);
  }
  if (!existsSync(compactAcceptance)) {
    errors.push(`spec/capabilities/${name} has no acceptance.feature`);
  }
  if (!files.some((file) => file.endsWith('.feature'))) {
    errors.push(`spec/capabilities/${name} has no acceptance feature`);
  }
  if (!files.some((file) => path.basename(file) === 'review.yaml')) {
    errors.push(`spec/capabilities/${name} has no review manifest`);
  }
}

const tinyFiles = specFiles.filter((file) => statSync(file).size < 500);
const tinyByName = Object.entries(
  tinyFiles.reduce((counts, file) => {
    const name = path.basename(file);
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {}),
).sort((left, right) => right[1] - left[1]);

const alternateRoots = ['docs', 'features']
  .map((name) => path.join(repositoryRoot, name))
  .filter(existsSync);
const alternateFiles = alternateRoots.flatMap((directory) => walk(directory));

const sourceRoots = ['apps', 'packages', 'e2e', 'tests', 'scripts', 'tools']
  .map((name) => path.join(repositoryRoot, name))
  .filter(existsSync);
const sourceFiles = sourceRoots.flatMap((directory) => walk(directory, (file) => {
  return /\.(?:[cm]?[jt]sx?|md)$/.test(file) && !file.includes(`${path.sep}node_modules${path.sep}`);
}));
let alternateReferenceCount = 0;
for (const file of sourceFiles) {
  const text = readFileSync(file, 'utf8');
  alternateReferenceCount += [...text.matchAll(/(?:docs|features)\//g)].length;
}

if (tinyFiles.length > 0) {
  warnings.push(`${tinyFiles.length} specification files are smaller than 500 bytes`);
}
if (alternateFiles.length > 0) {
  warnings.push(`${alternateFiles.length} files remain in non-authoritative docs/ and features/ trees`);
}
if (alternateReferenceCount > 0) {
  warnings.push(`${alternateReferenceCount} source or harness references still point at docs/ or features/`);
}

const result = {
  authoritative: summarize(specFiles),
  markdown: { files: markdownFiles.length, brokenLinks: errors.filter((error) => error.includes('links to missing')).length },
  gherkin: { files: gherkinFiles.length, scenarios: scenarioCount },
  reviews: { files: reviewFiles.length },
  capabilities: capabilityDirectories.length,
  fragmentation: {
    filesUnder500Bytes: tinyFiles.length,
    percentUnder500Bytes: Math.round((tinyFiles.length / specFiles.length) * 100),
    byBasename: Object.fromEntries(tinyByName),
  },
  nonAuthoritativeAlternatives: {
    ...summarize(alternateFiles),
    sourceAndHarnessReferences: alternateReferenceCount,
  },
  errors,
  warnings,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Authoritative spec: ${result.authoritative.files} files, ${result.authoritative.words} words`);
  console.log(`Markdown: ${result.markdown.files} files, ${result.markdown.brokenLinks} broken relative links`);
  console.log(`Gherkin: ${result.gherkin.files} files, ${result.gherkin.scenarios} scenarios`);
  console.log(`Review manifests: ${result.reviews.files}`);
  console.log(
    `Fragmentation: ${result.fragmentation.filesUnder500Bytes} files under 500 bytes (${result.fragmentation.percentUnder500Bytes}%)`,
  );
  console.log(`Small-file concentration: ${tinyByName.slice(0, 8).map(([name, count]) => `${name}=${count}`).join(', ')}`);
  console.log(
    `Non-authoritative alternatives: ${result.nonAuthoritativeAlternatives.files} files, ${result.nonAuthoritativeAlternatives.words} words, ${result.nonAuthoritativeAlternatives.sourceAndHarnessReferences} source/harness references`,
  );
  for (const warning of warnings) console.log(`WARN ${warning}`);
  for (const error of errors) console.log(`ERROR ${error}`);
}

process.exit(errors.length > 0 ? 1 : 0);
