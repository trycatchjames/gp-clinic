import { readFile } from 'node:fs/promises';

export async function publishReview({ client, lane, pullNumber, sha, reportPath }) {
  let report;
  try {
    report = await readFile(reportPath, 'utf8');
  } catch {
    report = 'VERDICT: FAIL\n\nThe local review agent did not produce a report.';
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
  return passed;
}

export async function aggregateReviews({ client, sha, lanes }) {
  const combined = await client.request('GET', `/commits/${sha}/status`);
  const latest = new Map();
  for (const status of combined.statuses ?? []) {
    if (!latest.has(status.context)) latest.set(status.context, status.state);
  }
  const passed = lanes.every((lane) => latest.get(`agent/${lane}`) === 'success');
  await client.request('POST', `/statuses/${sha}`, {
    state: passed ? 'success' : 'failure',
    context: 'agent/review',
    description: passed ? 'All LLM review lanes passed' : 'One or more LLM review lanes require attention',
  });
  return passed;
}
