import { readFile } from 'node:fs/promises';
import { reviewReportSummary, updateReviewBody } from './body.mjs';

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
  const pull = await client.request('GET', `/pulls/${pullNumber}`);
  const body = updateReviewBody({
    body: pull.body,
    sha,
    passed,
    summary: passed ? '' : reviewReportSummary(report),
  });
  await client.request('PATCH', `/pulls/${pullNumber}`, { body });
  await client.request('POST', `/statuses/${sha}`, {
    state: passed ? 'success' : 'failure',
    context: 'agent/review',
    description: passed ? 'Consolidated review passed' : 'Consolidated review requires changes',
  });
  return passed;
}
