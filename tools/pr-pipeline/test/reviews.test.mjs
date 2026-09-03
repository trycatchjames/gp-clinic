import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { publishReview } from '../src/lib/reviews.mjs';

test('publishes review state to the PR description and commit status without comments', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'gp-review-'));
  const reportPath = path.join(directory, 'review.md');
  await writeFile(reportPath, 'VERDICT: FAIL\n\n- P1 app.ts:4 — unsafe boundary; add a negative test.\n');

  const calls = [];
  const client = {
    async request(method, endpoint, body) {
      calls.push({ method, endpoint, body });
      if (method === 'GET' && endpoint === '/pulls/17') return { body: '## Outcome\n\nKeep.' };
      return {};
    },
  };

  const passed = await publishReview({
    client, pullNumber: 17, sha: 'abc123', reportPath,
  });

  assert.equal(passed, false);
  assert.ok(calls.some((call) =>
    call.method === 'PATCH' && call.endpoint === '/pulls/17' &&
    call.body.body.includes('Consolidated:** Changes required'),
  ));
  assert.ok(calls.some((call) =>
    call.method === 'POST' && call.endpoint === '/statuses/abc123' && call.body.state === 'failure',
  ));
  assert.ok(calls.every((call) => !call.endpoint.includes('/comments')));
});
