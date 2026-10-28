import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(
  root,
  'apps/web/src/design-system/storybook/foundation-contracts.json',
);
const patternDirectory = 'spec/product/experience/patterns';
const inventoryPath = 'spec/product/experience/components.md';

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

// A pattern's reasoning lives on the page that owns its product problem, so the pages are the
// catalogue. A primitive has no prose contract: its story, tests and source are the whole of it,
// and prose restating what a button does is a second thing to keep true for no extra correctness.
const catalogue = new Map();
const patternPages = (await readdir(path.join(root, patternDirectory)))
  .filter((name) => name.endsWith('.md'))
  .sort();

for (const page of patternPages) {
  const relativePath = `${patternDirectory}/${page}`;
  const markdown = await readFile(path.join(root, relativePath), 'utf8');
  const headings = [...markdown.matchAll(/^###\s+(DS-[A-Z]+-\d{3})\s+(.+)$/gm)];

  for (const [index, match] of headings.entries()) {
    const [, contractId] = match;
    if (catalogue.has(contractId)) {
      fail(`${contractId} is specified on two pattern pages; exactly one page owns each contract`);
    }
    const nextStart = headings[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(match.index, nextStart);
    const evidenceLine = block.match(/- \*\*Evidence:\*\*([\s\S]*?)(?=\n- \*\*|$)/);
    catalogue.set(contractId, {
      block,
      relativePath,
      slug: headingSlug(match[0].replace(/^###\s+/, '')),
      evidence: new Set(
        [...(evidenceLine?.[1] ?? '').matchAll(/`([a-z0-9][a-z0-9-]*)`/g)].map((m) => m[1]),
      ),
    });
  }
}

const inventory = await readFile(path.join(root, inventoryPath), 'utf8');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const registeredIds = new Set();
let patternCount = 0;
let primitiveCount = 0;

for (const [key, contract] of Object.entries(registry)) {
  if (!/^DS-[A-Z]+-\d{3}$/.test(contract.contractId)) {
    fail(`${key} has invalid contract ID ${contract.contractId}`);
  }
  if (registeredIds.has(contract.contractId)) fail(`duplicate registry ID ${contract.contractId}`);
  registeredIds.add(contract.contractId);

  if (contract.layer !== 'pattern' && contract.layer !== 'primitive') {
    fail(`${contract.contractId} has unknown layer ${contract.layer}`);
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
  // Both layers are listed, so the inventory stays a complete index of what exists.
  if (!inventory.includes(`\`${contract.contractId}\``)) {
    fail(`${contract.contractId} is missing from ${inventoryPath}`);
  }

  const story = await readFile(path.join(root, contract.storyFile), 'utf8');
  if (!story.includes(`foundationContracts.${key}`) || !story.includes('foundationParameters(')) {
    fail(`${contract.storyFile} does not consume the registered ${key} metadata`);
  }

  if (contract.layer === 'primitive') {
    primitiveCount += 1;
    if (contract.specRef !== inventoryPath) {
      fail(`${contract.contractId} is a primitive and must reference ${inventoryPath}`);
    }
    continue;
  }

  patternCount += 1;
  const entry = catalogue.get(contract.contractId);
  if (!entry) fail(`${contract.contractId} is not specified on any pattern page`);

  const [specPath, anchor] = contract.specRef.split('#');
  if (specPath !== entry.relativePath || anchor !== entry.slug) {
    fail(
      `${contract.contractId} points to ${contract.specRef}, expected ${entry.relativePath}#${entry.slug}`,
    );
  }
  if (!entry.block.includes(`\`${contract.source}\``)) {
    fail(`${contract.contractId} source ${contract.source} does not match its catalogue owner`);
  }
  // The pattern page names the evidence a contract owes. A registry that invents its own names
  // lets a component claim proof the contract never asked for, so the two sets must be identical.
  const declared = [...entry.evidence].sort();
  const registered = [...contract.evidence].sort();
  if (declared.length === 0) fail(`${contract.contractId} declares no evidence on its pattern page`);
  if (declared.join(',') !== registered.join(',')) {
    fail(
      `${contract.contractId} registers evidence ${registered.join(', ')} but its pattern page declares ${declared.join(', ')}`,
    );
  }
}

const componentStories = await storyFiles(path.join(root, 'apps/web/src/components'));
for (const absoluteStoryPath of componentStories) {
  const relativeStoryPath = path.relative(root, absoluteStoryPath);
  const registered = Object.values(registry).some(
    (contract) => contract.storyFile === relativeStoryPath,
  );
  if (!registered) fail(`${relativeStoryPath} has no registered contract`);
}

// A pattern page without a registered story would be a standard nobody can see. A new pattern
// arrives with its story, tests and evidence or it does not arrive.
const unregistered = [...catalogue.keys()].filter((id) => !registeredIds.has(id));
if (unregistered.length > 0) {
  fail(`${unregistered.join(', ')} ${unregistered.length === 1 ? 'has' : 'have'} no registered story`);
}

console.log(
  `Design-system traceability: ${patternCount} patterns across ${patternPages.length} pattern pages and ${primitiveCount} primitives validated; every one has a registered story.`,
);
