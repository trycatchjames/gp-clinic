import { githubClient } from './lib/github.mjs';

const [sha] = process.argv.slice(2);
if (!sha) throw new Error('Usage: aggregate-review <sha>');
const lanes = ['security', 'access', 'ux', 'architecture'];
const client = githubClient();
const combined = await client.request('GET', `/commits/${sha}/status`);
const latest = new Map();
for (const status of combined.statuses) if (!latest.has(status.context)) latest.set(status.context, status.state);
const passed = lanes.every((lane) => latest.get(`agent/${lane}`) === 'success');
await client.request('POST', `/statuses/${sha}`, {
  state: passed ? 'success' : 'failure',
  context: 'agent/review',
  description: passed ? 'All LLM review lanes passed' : 'One or more LLM review lanes require attention',
});
if (!passed) process.exitCode = 1;
