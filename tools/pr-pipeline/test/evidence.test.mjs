import assert from 'node:assert/strict';
import test from 'node:test';
import { flowVideos, invalidatesFlowEvidence } from '../src/lib/evidence.mjs';

const report = (specs) => ({ suites: [{ suites: [{ specs }] }] });
const spec = (title, videoPath, ok = true) => ({
  title,
  ok,
  tests: [{ results: [{ attachments: [{ name: 'video', path: videoPath }] }] }],
});

test('maps a recording onto the flow id tagged in the spec title', () => {
  const found = flowVideos(
    report([
      spec('[multi-identifier-search] finds family members', '/tmp/a/video.webm'),
      spec('[keyboard-selection] similar names stay distinct', '/tmp/b/video.webm'),
    ]),
    ['multi-identifier-search', 'keyboard-selection'],
  );
  assert.equal(found.get('multi-identifier-search').path, '/tmp/a/video.webm');
  assert.equal(found.get('keyboard-selection').path, '/tmp/b/video.webm');
});

test('ignores specs that carry no declared flow tag and attachments that are not video', () => {
  const found = flowVideos(
    report([
      spec('[keyboard-foundations] an unrelated slice flow', '/tmp/other/video.webm'),
      { title: '[keyboard-selection] no recording', ok: true, tests: [{ results: [{ attachments: [{ name: 'trace', path: '/tmp/t.zip' }] }] }] },
    ]),
    ['keyboard-selection'],
  );
  assert.equal(found.size, 0);
});

test('keeps the final attempt so a retry video matches the reported outcome', () => {
  const found = flowVideos(
    report([{
      title: '[keyboard-selection] flaky on the first attempt',
      ok: true,
      tests: [{
        results: [
          { attachments: [{ name: 'video', path: '/tmp/attempt-1/video.webm' }] },
          { attachments: [{ name: 'video', path: '/tmp/attempt-2/video.webm' }] },
        ],
      }],
    }]),
    ['keyboard-selection'],
  );
  assert.equal(found.get('keyboard-selection').path, '/tmp/attempt-2/video.webm');
});

test('refreshes flow evidence for product feedback but not harness-only feedback', () => {
  assert.equal(invalidatesFlowEvidence(['apps/web/src/routes/search.tsx']), true);
  assert.equal(invalidatesFlowEvidence(['packages/contracts/src/patient.ts']), true);
  assert.equal(invalidatesFlowEvidence(['tools/pr-pipeline/src/run-local.mjs']), false);
});
