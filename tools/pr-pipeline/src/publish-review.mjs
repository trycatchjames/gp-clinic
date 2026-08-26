import { readFile } from 'node:fs/promises';
import { githubClient } from './lib/github.mjs';

const [lane, pullNumberValue, sha, reportPath] = process.argv.slice(2);
const pullNumber = Number(pullNumberValue);
if (!lane || !pullNumber || !sha || !reportPath) throw new Error('Usage: publish-review <lane> <pr> <sha> <report>');
const client = githubClient();
let report;
try {
  report = await readFile(reportPath, 'utf8');
} catch {
  report = 'VERDICT: FAIL\n\nThe review agent did not produce a report.';
}
const passed = /^VERDICT:\s*PASS\b/im.test(report) && !/^VERDICT:\s*FAIL\b/im.test(report);
const marker = `<!-- agent-review:${lane}:${sha} -->`;
const body = `${marker}\n### ${lane[0].toUpperCase()}${lane.slice(1)} review — ${passed ? 'passed' : 'changes required'}\n\n${report.replace(/^VERDICT:.*$/im, '').trim().slice(0, 60000)}`;
const comments = await client.paginate(`/issues/${pullNumber}/comments`);
const existing = comments.find((comment) => comment.body?.includes(`<!-- agent-review:${lane}:`));
if (existing) await client.request('PATCH', `/issues/comments/${existing.id}`, { body });
else await client.request('POST', `/issues/${pullNumber}/comments`, { body });
await client.request('POST', `/statuses/${sha}`, {
  state: passed ? 'success' : 'failure',
  context: `agent/${lane}`,
  description: passed ? 'No blocking findings' : 'Blocking findings require attention',
});
console.log(`${lane}: ${passed ? 'PASS' : 'FAIL'}`);
