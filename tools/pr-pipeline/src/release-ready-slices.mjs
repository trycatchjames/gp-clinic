import config from '../config.json' with { type: 'json' };
import { githubClient, localGitHubCredentials } from './lib/github.mjs';
import { loadManifests } from './lib/manifests.mjs';
import { issueForSlice, slicesHeldBack, slicesToRelease } from './lib/release.mjs';

// Thin adapter. The decision about what may be released lives in lib/release.mjs so it can be
// tested without GitHub; this only fetches, creates and reports.
const dryRun = process.argv.includes('--dry-run');
const client = githubClient(localGitHubCredentials());
const manifests = await loadManifests();

// Closed issues count: a slice that has already been built must never be queued a second time.
const issues = await client.paginate('/issues?state=all');

const heldBack = slicesHeldBack({ manifests, issues });
for (const slice of heldBack) {
  console.log(
    `${slice.id}: queued without a readiness result, so it was not released. Run the readiness review and record ready and decided_by.`,
  );
}

const pending = slicesToRelease({ manifests, issues });
if (pending.length === 0) {
  console.log('No ready slice is waiting to be released.');
} else {
  for (const slice of pending) {
    const issue = issueForSlice(slice, { queuedLabel: config.labels.queued });
    if (dryRun) {
      console.log(`Would release ${slice.id}: ${issue.title}`);
      continue;
    }
    const created = await client.request('POST', '/issues', issue);
    console.log(`Released ${slice.id} as #${created.number}: ${issue.title}`);
  }
}

// A slice that reached main queued but unready means the gate was bypassed. Say so loudly in the
// run's status without failing the merge that is already in.
if (heldBack.length > 0) {
  console.log(
    `::warning::${heldBack.length} queued slice(s) reached main without a readiness result: ${heldBack.map((slice) => slice.id).join(', ')}`,
  );
}
