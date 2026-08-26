import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import config from '../config.json' with { type: 'json' };
import { repositoryRoot } from './lib/manifests.mjs';

const errors = [];
const codeExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

async function codeFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && !['dist', 'node_modules'].includes(entry.name)) return codeFiles(target);
    return entry.isFile() && codeExtensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return nested.flat();
}

async function inspect(file) {
  const source = await readFile(file, 'utf8');
  const relative = path.relative(repositoryRoot, file);
  if (!relative.startsWith('tools/pr-pipeline/') && source.includes('tools/pr-pipeline')) {
    errors.push(`${relative}: product code must not import the PR pipeline`);
  }
  if (relative.startsWith('packages/contracts/') && /from\s+['"](?:@gp\/sdk|.*packages\/sdk)/.test(source)) {
    errors.push(`${relative}: contracts must not depend on the generated SDK`);
  }
  if (relative.startsWith('apps/web/src/components/ui/') && /from\s+['"](?:@\/lib\/(?:api|auth|offline|queries|query|tokens)|.*\/routes\/|.*\/features\/)/.test(source)) {
    errors.push(`${relative}: UI primitives must not depend on data or route layers`);
  }
  const moduleMatch = relative.match(/^apps\/api\/src\/modules\/([^/]+)\//);
  if (moduleMatch) {
    const owner = moduleMatch[1];
    for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const importedModule = match[1].match(/modules\/([^/]+)/)?.[1]
        ?? match[1].match(/^\.\.\/(?!\.\.\/)([^/]+)/)?.[1];
      if (importedModule && importedModule !== owner) {
        const edge = `${owner}->${importedModule}`;
        if (!config.architecture.apiModuleAllowList.includes(edge)) errors.push(`${relative}: undeclared API domain edge ${edge}`);
      }
    }
  }
}

for (const root of ['apps', 'packages', 'tests', 'e2e']) {
  const directory = path.join(repositoryRoot, root);
  try {
    for (const file of await codeFiles(directory)) await inspect(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Architecture boundaries are intact.');
}
