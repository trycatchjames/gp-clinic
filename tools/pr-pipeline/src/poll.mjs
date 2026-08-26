import { readFile } from 'node:fs/promises';
import config from '../config.json' with { type: 'json' };
import { actionableFeedback, nextAction } from './lib/decision.mjs';
import { dispatch, githubClient, removeLabel, setLabels } from './lib/github.mjs';
import { loadManifests, sliceIdFromIssue } from './lib/manifests.mjs';

const dryRun = process.argv.includes('--dry-run');
const enabled = process.env.AGENT_AUTOMATION_ENABLED === 'true';
const client = githubClient();
const maxOpenPullRequests = Number(process.env.PIPELINE_MAX_OPEN_PRS || config.maxOpenPullRequests);
const trustedReviewers = (process.env.TRUSTED_REVIEWERS || config.trustedReviewers.join(','))
  .split(',').map((value) => value.trim()).filter(Boolean);

const allPulls = await client.paginate('/pulls?state=open');
const pulls = allPulls
  .filter((pull) => pull.labels.some((label) => label.name === config.labels.managed))
  .filter((pull) => !pull.labels.some((label) => [config.labels.working, config.labels.blocked].includes(label.name)))
  .map((pull) => ({ ...pull, sliceId: pull.head.ref.match(/^agent\/([a-z0-9-]+)/)?.[1]?.toUpperCase() }));

const feedbackByPull = new Map();
for (const pull of pulls) {
  const [reviews, reviewComments, issueComments] = await Promise.all([
    client.paginate(`/pulls/${pull.number}/reviews`),
    client.paginate(`/pulls/${pull.number}/comments`),
    client.paginate(`/issues/${pull.number}/comments`),
  ]);
  feedbackByPull.set(pull.number, actionableFeedback({
    reviews,
    reviewComments,
    issueComments,
    trustedReviewers,
    commands: config.commands,
    headSha: pull.head.sha,
  }));
}

const queuedIssues = (await client.paginate(`/issues?state=open&labels=${encodeURIComponent(config.labels.queued)}`))
  .filter((issue) => !issue.pull_request)
  .map((issue) => ({ ...issue, sliceId: sliceIdFromIssue(issue) }))
  .filter((issue) => issue.sliceId);
const completedSliceIds = new Set((await client.paginate('/issues?state=closed'))
  .filter((issue) => !issue.pull_request)
  .filter((issue) => issue.labels.some((label) => label.name === config.labels.managed))
  .map(sliceIdFromIssue)
  .filter(Boolean));
const manifests = await loadManifests();
const action = nextAction({ pulls, feedbackByPull, issues: queuedIssues, manifests, completedSliceIds, maxOpenPullRequests });

console.log(JSON.stringify({ dryRun, enabled, action: summarise(action) }, null, 2));
if (dryRun || !enabled || action.type === 'idle') process.exit(0);

if (action.type === 'feedback') {
  await setLabels(client, action.pull.number, [config.labels.working]);
  await client.request('POST', `/issues/${action.pull.number}/comments`, {
    body: `Agent claimed ${action.feedback.length} feedback item(s). A new commit will be pushed to this stack.`,
  });
  await dispatch(client, 'agent_feedback', {
    pull_number: action.pull.number,
    feedback: action.feedback,
  });
}

if (action.type === 'slice') {
  await setLabels(client, action.issue.number, [config.labels.working, config.labels.managed]);
  await removeLabel(client, action.issue.number, config.labels.queued);
  await client.request('POST', `/issues/${action.issue.number}/comments`, {
    body: `Agent claimed delivery slice **${action.slice.id}**. It will become the next pull request in the stack.`,
  });
  await dispatch(client, 'agent_slice', {
    issue_number: action.issue.number,
    slice_id: action.slice.id,
    manifest: `delivery/slices/${action.slice.file}`,
  });
}

function summarise(action) {
  if (action.type === 'feedback') return { type: action.type, pull: action.pull.number, feedback: action.feedback.length };
  if (action.type === 'slice') return { type: action.type, issue: action.issue.number, slice: action.slice.id };
  return action;
}
