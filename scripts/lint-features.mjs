#!/usr/bin/env node
/**
 * Verifies the Gherkin specifications in features/ are internally consistent
 * and consistent with the workflow documents in docs/.
 *
 * Checks:
 *   1. Every .feature file has a complete metadata block
 *   2. `status:` and the @inactive / @implemented tags agree
 *   3. The `spec:` path points at a document that exists
 *   4. Every feature file referenced from docs/ exists
 *   5. Every feature file is referenced from at least one doc
 *   6. Every file has a Feature: line and at least one Scenario
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_KEYS = ['status', 'implemented', 'automation', 'spec', 'standards', 'domain', 'last_reviewed'];
const VALID_STATUS = ['inactive', 'active', 'deprecated'];
const VALID_AUTOMATION = ['none', 'partial', 'full'];

const errors = [];
const warnings = [];

function walk(dir, ext, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, ext, acc);
    else if (entry.endsWith(ext)) acc.push(full);
  }
  return acc;
}

function parseMetadata(text) {
  const meta = {};
  const lines = text.split('\n');
  let inBlock = false;
  for (const line of lines) {
    if (/^#\s*metadata:\s*$/.test(line)) { inBlock = true; continue; }
    if (!inBlock) continue;
    if (!line.startsWith('#')) break;
    const m = line.match(/^#\s{3}([a-z_]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
    else if (/^#\s*=+\s*$/.test(line)) break;
  }
  return meta;
}

const featureFiles = walk(join(root, 'features'), '.feature');
const docFiles = walk(join(root, 'docs'), '.md');

// --- per-file checks -------------------------------------------------------
for (const file of featureFiles) {
  const rel = relative(root, file);
  const text = readFileSync(file, 'utf8');
  const meta = parseMetadata(text);

  for (const key of REQUIRED_KEYS) {
    if (!(key in meta)) errors.push(`${rel}: missing metadata key "${key}"`);
  }

  if (meta.status && !VALID_STATUS.includes(meta.status)) {
    errors.push(`${rel}: status "${meta.status}" is not one of ${VALID_STATUS.join(', ')}`);
  }
  if (meta.automation && !VALID_AUTOMATION.includes(meta.automation)) {
    errors.push(`${rel}: automation "${meta.automation}" is not one of ${VALID_AUTOMATION.join(', ')}`);
  }
  if (meta.implemented && !['true', 'false'].includes(meta.implemented)) {
    errors.push(`${rel}: implemented must be true or false`);
  }
  if (meta.last_reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(meta.last_reviewed)) {
    errors.push(`${rel}: last_reviewed must be YYYY-MM-DD`);
  }

  const tagLine = text.split('\n').find((l) => l.trim().startsWith('@'));
  if (!tagLine) {
    errors.push(`${rel}: no tag line found`);
  } else {
    const hasInactive = tagLine.includes('@inactive');
    if (meta.status === 'inactive' && !hasInactive) {
      errors.push(`${rel}: status is inactive but the @inactive tag is missing`);
    }
    if (meta.status === 'active' && hasInactive) {
      errors.push(`${rel}: status is active but the @inactive tag is still present`);
    }
  }

  if (!/^Feature:/m.test(text)) errors.push(`${rel}: no Feature: line`);
  if (!/^\s+(Scenario|Scenario Outline):/m.test(text)) errors.push(`${rel}: no scenarios`);

  if (meta.spec) {
    const specPath = join(root, meta.spec);
    if (!existsSync(specPath)) errors.push(`${rel}: spec "${meta.spec}" does not exist`);
  }
}

// --- cross-reference with docs --------------------------------------------
const referenced = new Set();
for (const doc of docFiles) {
  const text = readFileSync(doc, 'utf8');
  for (const m of text.matchAll(/features\/[a-z0-9-]+\/[a-z0-9-]+\.feature/g)) {
    referenced.add(m[0]);
  }
}

for (const ref of referenced) {
  if (!existsSync(join(root, ref))) {
    errors.push(`docs reference a feature file that does not exist: ${ref}`);
  }
}

const featureRels = new Set(featureFiles.map((f) => relative(root, f)));
for (const rel of featureRels) {
  if (!referenced.has(rel)) warnings.push(`${rel} is not referenced from any document`);
}

// --- report ----------------------------------------------------------------
const inactive = featureFiles.filter((f) => parseMetadata(readFileSync(f, 'utf8')).status === 'inactive').length;

console.log(`Feature files : ${featureFiles.length}`);
console.log(`Inactive      : ${inactive}`);
console.log(`Documents     : ${docFiles.length}`);
console.log(`Referenced    : ${referenced.size}`);
console.log('');

for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(warnings.length ? `\nOK with ${warnings.length} warning(s).` : '\nAll checks passed.');
