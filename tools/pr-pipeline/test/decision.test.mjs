import assert from 'node:assert/strict';
import test from 'node:test';
import {
  actionableFeedback,
  markerFor,
  nextAction,
  stackDescendants,
  stackOrder,
  stackRegistration,
} from '../src/lib/decision.mjs';

const pull = (number, head, base, sliceId) => ({ number, head: { ref: head }, base: { ref: base }, sliceId });

test('orders a stack from the trunk upward', () => {
  const pulls = [pull(3, 'three', 'two'), pull(1, 'one', 'main'), pull(2, 'two', 'one')];
  assert.deepEqual(stackOrder(pulls).map((item) => item.number), [1, 2, 3]);
});

test('every branch above a pull request is rebased, even beside an unrelated managed pull request', () => {
  const bottom = pull(1, 'one', 'main');
  const pulls = [bottom, pull(2, 'two', 'one'), pull(9, 'nine', 'main')];
  assert.deepEqual(stackDescendants(bottom, pulls).map((item) => item.number), [2]);
  assert.deepEqual(stackDescendants(pull(9, 'nine', 'main'), pulls).map((item) => item.number), []);
});

test('a forked stack is refused rather than partially rebased', () => {
  const bottom = pull(1, 'one', 'main');
  const pulls = [bottom, pull(2, 'two', 'one'), pull(3, 'three', 'one')];
  assert.throws(() => stackDescendants(bottom, pulls), /forked stack/);
});

test('the first managed pull request does not call the two-item stack API', () => {
  assert.equal(stackRegistration([], 13), null);
});

test('the second managed pull request creates the initial native stack', () => {
  assert.deepEqual(stackRegistration([13], 14), {
    path: '/stacks',
    pullRequests: [13, 14],
  });
});

test('later managed pull requests extend the stack containing their parent', () => {
  assert.deepEqual(stackRegistration([13, 14], 15, [
    { number: 7, pull_requests: [{ number: 13 }, { number: 14 }] },
  ]), {
    path: '/stacks/7/add',
    pullRequests: [15],
  });
});

test('formal and inline trusted feedback is actionable while chat requires a command', () => {
  const feedback = actionableFeedback({
    trustedReviewers: ['owner'],
    commands: ['@agent fix'],
    headSha: 'abc',
    reviews: [{ id: 1, state: 'CHANGES_REQUESTED', body: 'Change it', submitted_at: '2026-01-01', user: { login: 'owner' } }],
    reviewComments: [{ id: 2, body: 'Tighten this', created_at: '2026-01-02', user: { login: 'owner' } }],
    issueComments: [
      { id: 3, body: 'Just discussing', created_at: '2026-01-03', user: { login: 'owner' } },
      { id: 4, body: '@agent fix this', created_at: '2026-01-04', user: { login: 'owner' } },
      { id: 5, body: markerFor('review', 1), created_at: '2026-01-05', user: { login: 'github-actions[bot]' } },
    ],
  });
  assert.deepEqual(feedback.map(({ kind, id }) => [kind, id]), [['inline', 2], ['comment', 4]]);
});

test('a failing LLM lane on the current head is actionable', () => {
  const feedback = actionableFeedback({
    trustedReviewers: ['owner'], commands: ['@agent fix'], headSha: 'deadbeef', reviews: [], reviewComments: [],
    issueComments: [{ id: 8, body: '<!-- agent-review:access:deadbeef -->\n### Access review — changes required', created_at: '2026-01-01', user: { login: 'github-actions[bot]' } }],
  });
  assert.deepEqual(feedback.map(({ kind, id }) => [kind, id]), [['llm', 'access:deadbeef']]);
});

test('a local review published by a trusted owner is actionable', () => {
  const feedback = actionableFeedback({
    trustedReviewers: ['owner'], commands: ['@agent fix'], headSha: 'deadbeef', reviews: [], reviewComments: [],
    issueComments: [{ id: 8, body: '<!-- agent-review:ux:deadbeef -->\n### UX review — changes required', created_at: '2026-01-01', user: { login: 'owner' } }],
  });
  assert.deepEqual(feedback.map(({ kind, id }) => [kind, id]), [['llm', 'ux:deadbeef']]);
});

test('feedback on the bottom pull request wins before filling the stack', () => {
  const pulls = [pull(2, 'two', 'one', 'B'), pull(1, 'one', 'main', 'A')];
  const action = nextAction({
    pulls,
    feedbackByPull: new Map([[1, [{ id: 9 }]]]),
    issues: [{ number: 20, sliceId: 'C' }],
    manifests: { C: { id: 'C', status: 'queued', depends_on: [] } },
    maxOpenPullRequests: 3,
  });
  assert.equal(action.type, 'feedback');
  assert.equal(action.pull.number, 1);
});

test('claims the next dependency-ready slice when capacity exists', () => {
  const action = nextAction({
    pulls: [],
    feedbackByPull: new Map(),
    issues: [{ number: 11, sliceId: 'B' }, { number: 10, sliceId: 'A' }],
    manifests: {
      A: { id: 'A', status: 'queued', depends_on: [] },
      B: { id: 'B', status: 'queued', depends_on: ['A'] },
    },
    maxOpenPullRequests: 3,
  });
  assert.equal(action.type, 'slice');
  assert.equal(action.slice.id, 'A');
});
