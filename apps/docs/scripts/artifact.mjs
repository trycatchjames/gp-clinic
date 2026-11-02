import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../../test-results/product-docs/', import.meta.url));
await rm(output, { recursive: true, force: true });
await mkdir(`${output}/scripts`, { recursive: true });
await cp(`${app}/dist`, `${output}/dist`, { recursive: true });
await cp(`${app}/scripts/serve.mjs`, `${output}/scripts/serve.mjs`);
await writeFile(`${output}/package.json`, JSON.stringify({
  name: 'gp-product-documentation', private: true, version: '1.0.0', type: 'module',
  scripts: { start: 'node scripts/serve.mjs', dev: 'node scripts/serve.mjs' },
}, null, 2) + '\n');
await writeFile(`${output}/.stackblitzrc`, JSON.stringify({ installDependencies: false, startCommand: 'npm start' }, null, 2) + '\n');
await writeFile(`${output}/README.md`, '# GP Clinic product documentation\n\nRun `npm start`, then open http://localhost:4174. Requires Node.js 22+, with no installation or database.\n\nFor a browser WebContainer, import this folder into a Node.js StackBlitz project. The included `.stackblitzrc` starts the reader automatically.\n\nThis artifact is a read-only snapshot. Rebuild it from the GP Clinic repository with `pnpm docs:artifact` after changing Markdown. Share the ZIP or deploy `dist/` on a static host for your collaborator.\n');
const archive = `${output.slice(0, -1)}.zip`;
await rm(archive, { force: true });
execFileSync('zip', ['-qr', archive, '.'], { cwd: output });
console.log(`Documentation artifact: ${archive}\nStart: cd ${output} && npm start`);
