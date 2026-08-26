import assert from 'node:assert/strict';
import test from 'node:test';
import { agentCommand, parseLocalArgs } from '../src/lib/local-agent.mjs';

test('defaults to the locally authenticated Claude CLI and supports Codex explicitly', () => {
  const previous = process.env.AGENT_PROVIDER;
  delete process.env.AGENT_PROVIDER;
  try {
    assert.equal(parseLocalArgs([]).provider, 'claude');
    assert.equal(parseLocalArgs(['--', '--provider', 'codex']).provider, 'codex');
  } finally {
    if (previous === undefined) delete process.env.AGENT_PROVIDER;
    else process.env.AGENT_PROVIDER = previous;
  }
});

test('rejects unknown options and invalid review pull numbers', () => {
  assert.throws(() => parseLocalArgs(['--wat']), /Unknown option/);
  assert.throws(() => parseLocalArgs(['--review-only', 'nope']), /positive pull request/);
});

test('Codex uses a bounded workspace sandbox for implementation and read-only for review', () => {
  const implementation = agentCommand({ provider: 'codex', mode: 'implementation', repositoryRoot: '/repo', outputPath: '/result' });
  const review = agentCommand({ provider: 'codex', mode: 'review', repositoryRoot: '/repo', outputPath: '/result' });
  assert.deepEqual(implementation.args.slice(0, 5), ['exec', '--cd', '/repo', '--sandbox', 'workspace-write']);
  assert.ok(!implementation.args.includes('--dangerously-bypass-approvals-and-sandbox'));
  assert.equal(review.args[review.args.indexOf('--sandbox') + 1], 'read-only');
  assert.ok(!implementation.args.includes('--approve-for-me'));
});

test('Claude review access is read-only and implementation cannot publish', () => {
  const implementation = agentCommand({ provider: 'claude', mode: 'implementation', repositoryRoot: '/repo', outputPath: '/result' });
  const review = agentCommand({ provider: 'claude', mode: 'review', repositoryRoot: '/repo', outputPath: '/result' });
  const implementationTools = implementation.args[implementation.args.indexOf('--allowedTools') + 1];
  const reviewTools = review.args[review.args.indexOf('--allowedTools') + 1];
  assert.match(implementationTools, /Edit/);
  assert.doesNotMatch(implementationTools, /git push|git commit|\bgh\b/);
  assert.doesNotMatch(reviewTools, /Edit|Write/);
});
