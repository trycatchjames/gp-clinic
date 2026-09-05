import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(
  root,
  'apps/web/src/design-system/storybook/foundation-contracts.json',
);
const cataloguePaths = [
  'spec/product/design-system/atoms.md',
  'spec/product/design-system/molecules.md',
];

function fail(message) {
  throw new Error(`Design-system traceability: ${message}`);
}

function headingSlug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function isFile(relativePath) {
  try {
    return (await stat(path.join(root, relativePath))).isFile();
  } catch {
    return false;
  }
}

async function storyFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await storyFiles(entryPath)));
    if (entry.isFile() && entry.name.endsWith('.stories.tsx')) files.push(entryPath);
  }
  return files;
}

const catalogues = new Map();
for (const relativePath of cataloguePaths) {
  const markdown = await readFile(path.join(root, relativePath), 'utf8');
  const headings = [...markdown.matchAll(/^###\s+(DS-[A-Z]+-\d{3})\s+(.+)$/gm)];

  for (const [index, match] of headings.entries()) {
    const [, contractId] = match;
    if (catalogues.has(contractId)) fail(`duplicate catalogue ID ${contractId}`);
    const nextStart = headings[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(match.index, nextStart);
    catalogues.set(contractId, {
      block,
      relativePath,
      slug: headingSlug(match[0].replace(/^###\s+/, '')),
    });
  }
}

const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const registeredIds = new Set();

for (const [key, contract] of Object.entries(registry)) {
  if (!/^DS-[A-Z]+-\d{3}$/.test(contract.contractId)) {
    fail(`${key} has invalid contract ID ${contract.contractId}`);
  }
  if (registeredIds.has(contract.contractId)) fail(`duplicate registry ID ${contract.contractId}`);
  registeredIds.add(contract.contractId);

  const catalogue = catalogues.get(contract.contractId);
  if (!catalogue) fail(`${contract.contractId} is not present in the maintained catalogues`);

  const [specPath, anchor] = contract.specRef.split('#');
  if (specPath !== catalogue.relativePath || anchor !== catalogue.slug) {
    fail(`${contract.contractId} points to ${contract.specRef}, expected ${catalogue.relativePath}#${catalogue.slug}`);
  }
  if (!catalogue.block.includes(`\`${contract.source}\``)) {
    fail(`${contract.contractId} source ${contract.source} does not match its catalogue owner`);
  }
  if (!(await isFile(contract.source))) fail(`${contract.contractId} source does not exist`);
  if (!(await isFile(contract.storyFile))) fail(`${contract.contractId} story does not exist`);
  if (!Array.isArray(contract.evidence) || contract.evidence.length === 0) {
    fail(`${contract.contractId} has no evidence IDs`);
  }
  for (const evidenceId of contract.evidence) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(evidenceId)) {
      fail(`${contract.contractId} has invalid evidence ID ${evidenceId}`);
    }
  }

  const story = await readFile(path.join(root, contract.storyFile), 'utf8');
  if (!story.includes(`foundationContracts.${key}`) || !story.includes('foundationParameters(')) {
    fail(`${contract.storyFile} does not consume the registered ${key} metadata`);
  }
}

const componentStories = await storyFiles(path.join(root, 'apps/web/src/components'));
for (const absoluteStoryPath of componentStories) {
  const relativeStoryPath = path.relative(root, absoluteStoryPath);
  const registered = Object.values(registry).some(
    (contract) => contract.storyFile === relativeStoryPath,
  );
  if (!registered) fail(`${relativeStoryPath} has no registered catalogue contract`);
}

console.log(
  `Design-system traceability: ${registeredIds.size} stories validated; ${catalogues.size - registeredIds.size} maintained catalogue entries remain for later parity slices.`,
);
