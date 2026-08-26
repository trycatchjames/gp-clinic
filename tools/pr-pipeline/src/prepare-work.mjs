import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { githubClient } from './lib/github.mjs';
import { prepareWork } from './lib/work.mjs';

const state = await prepareWork({
  client: githubClient(),
  mode: process.env.WORK_MODE,
  payload: JSON.parse(process.env.WORK_PAYLOAD || '{}'),
});
if (process.env.GITHUB_OUTPUT) {
  await writeFile(
    path.resolve(process.env.GITHUB_OUTPUT),
    `branch=${state.branch}\nbase=${state.base}\nmode=${state.mode}\n`,
    { flag: 'a' },
  );
}
console.log(`Prepared ${state.mode} work on ${state.branch}.`);
