import assert from 'node:assert/strict';
import test from 'node:test';
import { issueForSlice, slicesHeldBack, slicesToRelease } from '../src/lib/release.mjs';
import { sliceIdFromIssue } from '../src/lib/manifests.mjs';

function slice(id, overrides = {}) {
  return {
    id,
    file: `${id}.yaml`,
    title: `Do the thing for ${id}`,
    status: 'queued',
    ready: '2026-10-29',
    decided_by: 'James Harvey',
    story: { actor: 'Receptionist', goal: 'find a patient', benefit: 'nobody is booked twice' },
    out_of_scope: ['Creating a patient'],
    ...overrides,
  };
}

const manifestsOf = (...slices) => Object.fromEntries(slices.map((item) => [item.id, item]));

test('only queued slices with a readiness result are released', () => {
  const manifests = manifestsOf(
    slice('AAA-001'),
    slice('AAA-002', { status: 'backlog' }),
    slice('AAA-003', { status: 'delivered' }),
    slice('AAA-004', { ready: undefined }),
    slice('AAA-005', { decided_by: undefined }),
  );

  const released = slicesToRelease({ manifests, issues: [] }).map((item) => item.id);

  assert.deepEqual(released, ['AAA-001']);
});

test('a slice already carrying an issue is never queued twice', () => {
  const manifests = manifestsOf(slice('AAA-001'), slice('AAA-002'));
  const issues = [{ title: '[AAA-001] Do the thing for AAA-001', state: 'open' }];

  const released = slicesToRelease({ manifests, issues }).map((item) => item.id);

  assert.deepEqual(released, ['AAA-002']);
});

test('a closed issue keeps a delivered slice from being revived', () => {
  const manifests = manifestsOf(slice('AAA-001'));
  const issues = [{ title: '[AAA-001] Do the thing for AAA-001', state: 'closed' }];

  assert.deepEqual(slicesToRelease({ manifests, issues }), []);
});

test('a pull request titled like a slice does not claim it', () => {
  // GitHub returns pull requests from the issues endpoint. Treating one as the slice's issue
  // would leave the slice permanently unreleased.
  const manifests = manifestsOf(slice('AAA-001'));
  const issues = [{ title: '[AAA-001] Do the thing for AAA-001', pull_request: {}, state: 'open' }];

  assert.deepEqual(slicesToRelease({ manifests, issues }).map((item) => item.id), ['AAA-001']);
});

test('a queued slice with no readiness result is reported rather than released', () => {
  const manifests = manifestsOf(
    slice('AAA-001', { ready: undefined }),
    slice('AAA-002', { decided_by: undefined }),
    slice('AAA-003'),
  );

  assert.deepEqual(slicesToRelease({ manifests, issues: [] }).map((item) => item.id), ['AAA-003']);
  assert.deepEqual(slicesHeldBack({ manifests, issues: [] }).map((item) => item.id), ['AAA-001', 'AAA-002']);
});

test('a held-back slice stops being reported once it has an issue', () => {
  const manifests = manifestsOf(slice('AAA-001', { ready: undefined }));
  const issues = [{ title: '[AAA-001] Do the thing for AAA-001', state: 'open' }];

  assert.deepEqual(slicesHeldBack({ manifests, issues }), []);
});

test('the created issue is one the planner can resolve back to its slice', () => {
  const subject = slice('PATSEARCH-003');
  const issue = issueForSlice(subject, { queuedLabel: 'agent:queued' });

  assert.equal(sliceIdFromIssue(issue), 'PATSEARCH-003');
  assert.deepEqual(issue.labels, ['agent:queued']);
  assert.match(issue.body, /delivery\/slices\/PATSEARCH-003\.yaml/);
  assert.match(issue.body, /settled by James Harvey/);
  assert.match(issue.body, /- Creating a patient/);
});

test('releasing is stable and repeatable for the same inputs', () => {
  const manifests = manifestsOf(slice('BBB-002'), slice('AAA-001'));

  const first = slicesToRelease({ manifests, issues: [] }).map((item) => item.id);
  const second = slicesToRelease({ manifests, issues: [] }).map((item) => item.id);

  assert.deepEqual(first, ['AAA-001', 'BBB-002']);
  assert.deepEqual(first, second);
});
