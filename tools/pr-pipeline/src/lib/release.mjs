import { sliceIdFromIssue } from './manifests.mjs';

// Merging a grill session's pull request is what releases its work. The proposal, the
// specification it promoted and the slices it wrote all land together, and this turns the slices
// that are ready into the queued issues the pipeline picks up.
//
// Three rules keep that safe:
//
//   * Only `queued` slices are released. `backlog` is work the product manager has not released,
//     and `in_review`, `accepted` and `delivered` are already through.
//   * Only slices a readiness review passed, which is what `ready` and `decided_by` record. The
//     pipeline builds unattended, so releasing an unready slice hands it a product decision.
//   * Only slices with no issue yet, counting closed ones, so re-running this never duplicates a
//     slice or revives one that has already been built.
//
// Dependencies are deliberately not considered here. `readySlices` in decision.mjs already holds
// a slice back until what it depends on is delivered or in flight, so an issue created early
// simply waits its turn rather than jumping the queue.
export function slicesToRelease({ manifests, issues }) {
  const claimed = new Set(
    issues.filter((issue) => !issue.pull_request).map(sliceIdFromIssue).filter(Boolean),
  );

  return Object.values(manifests)
    .filter((slice) => slice.status === 'queued')
    .filter((slice) => slice.ready && slice.decided_by)
    .filter((slice) => !claimed.has(slice.id))
    .sort((left, right) => left.id.localeCompare(right.id));
}

// A slice that says it is queued but carries no readiness result is a mistake worth surfacing
// rather than skipping silently: `pnpm lint:slices` rejects it, so seeing one here means the
// manifest reached main without the gate, and the run should say so.
export function slicesHeldBack({ manifests, issues }) {
  const claimed = new Set(
    issues.filter((issue) => !issue.pull_request).map(sliceIdFromIssue).filter(Boolean),
  );

  return Object.values(manifests)
    .filter((slice) => slice.status === 'queued')
    .filter((slice) => !slice.ready || !slice.decided_by)
    .filter((slice) => !claimed.has(slice.id))
    .sort((left, right) => left.id.localeCompare(right.id));
}

export function issueForSlice(slice, { queuedLabel }) {
  const { actor, goal, benefit } = slice.story ?? {};
  const body = [
    `**Delivery manifest:** \`delivery/slices/${slice.file}\``,
    '',
    'This contract is authoritative for the pull request.',
    '',
    '## Actor outcome',
    '',
    `${actor} can ${goal}, so that ${benefit}.`,
    '',
    '## Readiness',
    '',
    `A readiness review found no product decision left on ${slice.ready}. Product questions were`,
    `settled by ${slice.decided_by}.`,
    '',
    'A question that arises during the build is a gap that review missed. Raise it for a grill',
    'session rather than deciding it.',
    '',
    '## Out of scope',
    '',
    ...(slice.out_of_scope ?? []).map((item) => `- ${item}`),
    '',
    '---',
    '',
    'Opened automatically when this slice reached `main` as ready. Edits here do not change the',
    'manifest, which is the contract the build follows.',
  ].join('\n');

  return {
    title: `[${slice.id}] ${slice.title}`,
    body,
    labels: [queuedLabel],
  };
}
