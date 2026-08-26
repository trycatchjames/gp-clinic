import { readFile } from 'node:fs/promises';

export function reviewPassed(report) {
  return /^VERDICT:\s*PASS\b/im.test(report) && !/^VERDICT:\s*FAIL\b/im.test(report);
}

export function reviewMarker(sha) {
  return `<!-- agent-review:slice:${sha} -->`;
}

export async function publishReview({ client, pullNumber, sha, reportPath }) {
  let report;
  try {
    report = await readFile(reportPath, 'utf8');
  } catch {
    report = 'VERDICT: FAIL\n\nThe local review agent did not produce a report.';
  }
  const passed = reviewPassed(report);
  const marker = reviewMarker(sha);
  const body = `${marker}\n### Consolidated slice review — ${passed ? 'passed' : 'changes required'}\n\n${report.replace(/^VERDICT:.*$/im, '').trim().slice(0, 60000)}`;
  const comments = await client.paginate(`/issues/${pullNumber}/comments`);
  const existing = comments.find((comment) => comment.body?.includes('<!-- agent-review:slice:'));
  if (existing) await client.request('PATCH', `/issues/comments/${existing.id}`, { body });
  else await client.request('POST', `/issues/${pullNumber}/comments`, { body });
  await client.request('POST', `/statuses/${sha}`, {
    state: passed ? 'success' : 'failure',
    context: 'agent/review',
    description: passed ? 'Consolidated review passed' : 'Consolidated review requires changes',
  });
  return passed;
}
