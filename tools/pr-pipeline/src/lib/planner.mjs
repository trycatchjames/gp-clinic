import config from '../../config.json' with { type: 'json' };
import { updatePipelineState } from './body.mjs';
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
      pullBody: pull.body,
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
    const pull = await client.request('GET', `/pulls/${action.pull.number}`);
    await client.request('PATCH', `/pulls/${action.pull.number}`, {
      body: updatePipelineState(
        pull.body,
        'Applying feedback',
        `${action.feedback.length} requested change${action.feedback.length === 1 ? '' : 's'} claimed.`,
      ),
    });
    return;
  }

  if (action.type === 'slice') {
    await setLabels(client, action.issue.number, [config.labels.working, config.labels.managed]);
    await removeLabel(client, action.issue.number, config.labels.queued);
    const issue = await client.request('GET', `/issues/${action.issue.number}`);
    await client.request('PATCH', `/issues/${action.issue.number}`, {
      body: updatePipelineState(issue.body, 'In progress', `Delivery slice ${action.slice.id} claimed.`),
    });
  }
}

export async function recoverAction(client, action, error) {
  const number = action.type === 'feedback' ? action.pull.number : action.type === 'slice' ? action.issue.number : null;
  if (!number) return;
  await setLabels(client, number, [config.labels.blocked]);
  await removeLabel(client, number, config.labels.working);
  const endpoint = action.type === 'feedback' ? `/pulls/${number}` : `/issues/${number}`;
  const resource = await client.request('GET', endpoint);
  await client.request('PATCH', endpoint, {
    body: updatePipelineState(resource.body, 'Blocked', sanitiseError(error)),
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
