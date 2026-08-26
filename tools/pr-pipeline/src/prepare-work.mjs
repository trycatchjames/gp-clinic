import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import config from '../config.json' with { type: 'json' };
import { githubClient } from './lib/github.mjs';
import { repositoryRoot } from './lib/manifests.mjs';
import { stackDescendants, stackOrder } from './lib/decision.mjs';

const mode = process.env.WORK_MODE;
const payload = JSON.parse(process.env.WORK_PAYLOAD || '{}');
const client = githubClient();
const runtime = path.join(repositoryRoot, 'tools/pr-pipeline/runtime');
await mkdir(runtime, { recursive: true });

const pulls = (await client.paginate('/pulls?state=open'))
  .filter((pull) => pull.labels.some((label) => label.name === config.labels.managed));
let state;
let prompt;

if (mode === 'feedback') {
  const pull = await client.request('GET', `/pulls/${payload.pull_number}`);
  if (!pull.labels.some((label) => label.name === config.labels.managed)) throw new Error('Refusing feedback work for an unmanaged PR');
  const descendants = stackDescendants(pull, pulls);
  state = {
    mode,
    issueNumber: pull.number,
    pullNumber: pull.number,
    branch: pull.head.ref,
    base: pull.base.ref,
    beforeSha: pull.head.sha,
    descendants: descendants.map((item) => ({ number: item.number, branch: item.head.ref, beforeSha: item.head.sha })),
    feedback: payload.feedback,
  };
  prompt = [
    'Use the handling-pr-feedback skill.',
    `Work on PR #${pull.number}: ${pull.title}`,
    'Address every feedback item below without expanding the approved slice.',
    JSON.stringify(payload.feedback, null, 2),
    'Run the relevant deterministic gates. Do not commit, push, comment, or alter GitHub state; the pipeline does that after you finish.',
  ].join('\n\n');
} else if (mode === 'slice') {
  const issue = await client.request('GET', `/issues/${payload.issue_number}`);
  const manifestPath = path.join(repositoryRoot, payload.manifest);
  const manifest = await readFile(manifestPath, 'utf8');
  const ordered = stackOrder(pulls);
  const top = ordered.at(-1);
  state = {
    mode,
    issueNumber: issue.number,
    sliceId: payload.slice_id,
    title: issue.title.replace(/^\[[^\]]+\]\s*/, ''),
    manifest: payload.manifest,
    branch: `agent/${payload.slice_id.toLowerCase()}`,
    base: top?.head.ref ?? 'main',
    baseSha: top?.head.sha,
    stackPullNumbers: ordered.map((pull) => pull.number),
  };
  prompt = [
    'Use the delivering-slice skill and the capturing-pr-evidence skill.',
    `Implement issue #${issue.number}: ${issue.title}`,
    'The delivery manifest is authoritative for this PR:',
    manifest,
    'Stay within out_of_scope. Implement and test every acceptance item. Capture the named screenshots and flows.',
    'Run the relevant deterministic gates. Do not commit, push, open a PR, comment, or alter GitHub state; the pipeline does that after you finish.',
  ].join('\n\n');
} else {
  throw new Error(`Unknown WORK_MODE ${mode}`);
}

await writeFile(path.join(runtime, 'state.json'), `${JSON.stringify(state, null, 2)}\n`);
await writeFile(path.join(runtime, 'task.md'), `${prompt}\n`);
const output = process.env.GITHUB_OUTPUT;
if (output) {
  await writeFile(output, `branch=${state.branch}\nbase=${state.base}\nmode=${state.mode}\n`, { flag: 'a' });
}
console.log(`Prepared ${mode} work on ${state.branch}.`);
