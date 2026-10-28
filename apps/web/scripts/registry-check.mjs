// Fails when an installed component no longer matches the shadcn registry.
//
// Components are owned by the registry: the brand lives in src/index.css, not in edits to
// component files. A difference here means a component was edited locally or the registry
// has moved on. Either way, reinstall it with `shadcn add <name> --overwrite` and adapt the
// calling code instead.
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const components = readdirSync(join(root, 'src/components/ui'))
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => file.slice(0, -'.tsx'.length));

function dryRun(...options) {
  return (
    execFileSync(
      join(root, 'node_modules/.bin/shadcn'),
      ['add', ...components, '--dry-run', ...options],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    )
      // eslint-disable-next-line no-control-regex
      .replace(/\u001b\[[0-9;]*m/g, '')
  );
}

// The CLI adds or strips the "use client" directive depending on which items share a run.
// The directive has no effect in this Vite application, so a difference in it alone is not
// drift.
function onlyDirectiveDiffers(file) {
  return dryRun('--diff', file)
    .split('\n')
    .map((line) => /^│ │ ([-+])(?![-+]{2} [ab]\/)(.*)$/.exec(line)?.[2].trim())
    .filter((line) => line !== undefined)
    .every((line) => line === '' || line === '"use client"');
}

const output = dryRun();

const files = output
  .split('\n')
  .map((line) => /^│\s+(\S)\s+(src\/\S+)\s+(.+)$/.exec(line))
  .filter((match) => match !== null);
const drifted = files.filter(
  ([, , file, state]) => state !== 'skip (identical)' && !onlyDirectiveDiffers(file),
);

if (files.length === 0) {
  console.error(output);
  throw new Error('Could not read the shadcn dry run; see its output above.');
}
if (drifted.length > 0) {
  for (const [, , file, state] of drifted) console.error(`${file}: ${state}`);
  console.error(
    '\nThese files differ from the shadcn registry. Reinstall them with ' +
      '`pnpm exec shadcn add <name> --overwrite` and keep changes in src/index.css.',
  );
  process.exit(1);
}
console.log(`${files.length} registry files match the shadcn registry.`);
