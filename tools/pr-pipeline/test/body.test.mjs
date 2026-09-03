import assert from 'node:assert/strict';
import test from 'node:test';
import {
  markedSection,
  replaceMarkedSection,
  reviewReportSummary,
  updatePipelineState,
  updateReviewBody,
} from '../src/lib/body.mjs';

test('marked description sections update in place instead of appending activity', () => {
  const first = updatePipelineState('## Outcome\n\nKeep this.', 'Applying feedback', 'Two changes claimed.');
  const second = updatePipelineState(first, 'Checks running', 'Feedback applied.');

  assert.equal((second.match(/## Pipeline/g) ?? []).length, 1);
  assert.match(second, /## Outcome\n\nKeep this\./);
  assert.match(second, /\*\*State:\*\* Checks running/);
  assert.doesNotMatch(second, /Two changes claimed/);
});

test('review summaries reset for a new head and keep failures concise', () => {
  let body = updateReviewBody({ body: '', sha: 'old', passed: true, summary: '' });
  body = updateReviewBody({
    body, sha: 'new', passed: false,
    summary: 'P1 apps/api/a.ts:10 — cross-practice read; add a negative test.',
  });

  const section = markedSection(body, 'reviews');
  assert.match(section, /review-head:new/);
  assert.match(section, /Consolidated:\*\* Changes required/);
  assert.match(section, /agent-review:slice:new/);
  assert.doesNotMatch(section, /review-head:old/);
});

test('review report summaries discard verdicts and headings', () => {
  const summary = reviewReportSummary([
    'VERDICT: FAIL',
    '',
    '## Findings',
    '- P1 file.ts:4 — first correction.',
    '- P2 other.ts:7 — second correction.',
  ].join('\n'));
  assert.equal(summary, 'P1 file.ts:4 — first correction. · P2 other.ts:7 — second correction.');
});

test('generic marked sections preserve surrounding prose', () => {
  const body = replaceMarkedSection('Before', 'test', 'First');
  const updated = replaceMarkedSection(body, 'test', 'Second');
  assert.equal(markedSection(updated, 'test'), 'Second');
  assert.equal((updated.match(/pr-pipeline:test:start/g) ?? []).length, 1);
});
