// The package is "type": "module", so the CommonJS output needs its own marker
// or Node will try to load the .js files as ESM.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
writeFileSync(join(dist, 'cjs', 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2));
writeFileSync(join(dist, 'esm', 'package.json'), JSON.stringify({ type: 'module' }, null, 2));
