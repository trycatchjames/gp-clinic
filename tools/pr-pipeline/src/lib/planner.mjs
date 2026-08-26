import config from '../../config.json' with { type: 'json' };
import { actionableFeedback, nextAction, stackOrder } from './decision.mjs';
import { removeLabel, setLabels } from './github.mjs';
import { loadManifests, sliceIdFromIssue } from './manifests.mjs';

export function hasConsolidatedReview(statuses = []) {
  return statuses.some((status) =>
    status.context === 'agent/review' && status.description?.startsWith('Consolidated review'));
}

export async function inspectPipeline({
  client,
  maxOpenPullRequests = config.maxOpenPullRequests,
  trustedReviewers = config.trustedReviewers,
} = {}) {
  const allPulls = await client.paginate('/pulls?state=open');
  const managedPulls = allPulls
    .filter((pull) => pull.labels.some((label) => label.name === config.labels.managed))
    .map((pull) => ({
      ...pull,
      sliceId: pull.head.ref.match(/^agent\/([a-z0-9-]+)/)?.[1]?.toUpperCase(),
    }));
  const availablePulls = managedPulls
    .filter((pull) => !pull.labels.some((label) => [config.labels.working, config.labels.blocked].includes(label.name)));

  const feedbackByPull = new Map();
  for (const pull of availablePulls) {
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
  const selected = nextAction({
    pulls: managedPulls,
    feedbackByPull,
    issues: queuedIssues,
    manifests,
    completedSliceIds,
    maxOpenPullRequests,
  });

  if (selected.type === 'feedback') return selected;

  // A newly pushed head must receive its consolidated review before another slice is
  // claimed. This also recovers cleanly if the local process stopped between opening
  // a PR and publishing its review.
  for (const pull of stackOrder(availablePulls)) {
    const combined = await client.request('GET', `/commits/${pull.head.sha}/status`);
    if (!hasConsolidatedReview(combined.statuses)) return { type: 'review', pull, needed: true };
  }

  if (selected.type === 'slice' && managedPulls.some((pull) =>
    pull.labels.some((label) => [config.labels.working, config.labels.blocked].includes(label.name)))) {
    return { type: 'idle', reason: 'stack-has-working-or-blocked-layer' };
  }

  return selected;
}

export async function claimAction(client, action) {
  if (action.type === 'feedback') {
    await setLabels(client, action.pull.number, [config.labels.working]);
    await client.request('POST', `/issues/${action.pull.number}/comments`, {
      body: `Local agent claimed ${action.feedback.length} feedback item(s). A new commit will be pushed to this stack.`,
    });
    return;
  }

  if (action.type === 'slice') {
    await setLabels(client, action.issue.number, [config.labels.working, config.labels.managed]);
    await removeLabel(client, action.issue.number, config.labels.queued);
    await client.request('POST', `/issues/${action.issue.number}/comments`, {
      body: `Local agent claimed delivery slice **${action.slice.id}**. It will become the next pull request in the stack.`,
    });
  }
}

export async function recoverAction(client, action, error) {
  const number = action.type === 'feedback' ? action.pull.number : action.type === 'slice' ? action.issue.number : null;
  if (!number) return;
  await setLabels(client, number, [config.labels.blocked]);
  await removeLabel(client, number, config.labels.working);
  await client.request('POST', `/issues/${number}/comments`, {
    body: `The local delivery command stopped. The checkout was left intact for inspection; check the branch and pull-request state before re-queuing.\n\n\`${sanitiseError(error)}\``,
  });
}

export function summariseAction(action) {
  if (action.type === 'feedback') {
    return { type: action.type, pull: action.pull.number, feedback: action.feedback.length };
  }
  if (action.type === 'slice') {
    return { type: action.type, issue: action.issue.number, slice: action.slice.id };
  }
  if (action.type === 'review') {
    return { type: action.type, pull: action.pull.number };
  }
  return action;
}

function sanitiseError(error) {
  return String(error?.message ?? error)
    .replaceAll('`', "'")
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 1000);
}
