const botSuffix = '[bot]';

export function stackOrder(pulls, trunk = 'main') {
  const byHead = new Map(pulls.map((pull) => [pull.head.ref, pull]));
  const depth = (pull, seen = new Set()) => {
    if (pull.base.ref === trunk) return 0;
    if (seen.has(pull.number)) return Number.MAX_SAFE_INTEGER;
    const parent = byHead.get(pull.base.ref);
    return parent ? 1 + depth(parent, new Set([...seen, pull.number])) : 0;
  };
  return [...pulls].sort((a, b) => depth(a) - depth(b) || a.number - b.number);
}

/**
 * GitHub only creates a native stack once at least two pull requests exist.
 * The first managed pull request is already reviewable on its own, so it needs
 * no stack API call. Later pulls either extend the stack containing their
 * immediate parent or create the initial two-or-more-PR stack.
 */
export function stackRegistration(stackPullNumbers, pullNumber, stacks = []) {
  const parentNumber = stackPullNumbers.at(-1);
  if (parentNumber === undefined) return null;

  const containsParent = (stack) => (stack.pull_requests ?? [])
    .some((entry) => (typeof entry === 'number' ? entry : entry?.number) === parentNumber);
  const existing = stacks.find(containsParent);
  return existing
    ? { path: `/stacks/${existing.number}/add`, pullRequests: [pullNumber] }
    : { path: '/stacks', pullRequests: [...stackPullNumbers, pullNumber] };
}

/**
 * The pull requests stacked directly above `pull`, ordered bottom-up.
 *
 * Rebasing a stack is only expressible as a linear replay, so a fork above the
 * changed pull request is an error rather than something to silently truncate:
 * dropping a branch here would leave it un-rebased and reviewed against a parent
 * that no longer exists.
 */
export function stackDescendants(pull, pulls) {
  const childrenByBase = new Map();
  for (const candidate of pulls) {
    if (candidate.number === pull.number) continue;
    childrenByBase.set(candidate.base.ref, [...(childrenByBase.get(candidate.base.ref) ?? []), candidate]);
  }
  const descendants = [];
  const seen = new Set([pull.number]);
  for (let head = pull.head.ref; ; ) {
    const children = childrenByBase.get(head) ?? [];
    if (children.length === 0) return descendants;
    if (children.length > 1) {
      throw new Error(`PR #${pull.number} has a forked stack above it (${children.map((child) => `#${child.number}`).join(', ')}). Refusing to rebase part of a stack.`);
    }
    const [child] = children;
    if (seen.has(child.number)) throw new Error(`Cycle in the stack above PR #${pull.number}`);
    seen.add(child.number);
    descendants.push(child);
    head = child.head.ref;
  }
}

export function markerFor(kind, id) {
  return `<!-- pr-pipeline:handled:${kind}:${id} -->`;
}

export function actionableFeedback({ reviews, reviewComments, issueComments, trustedReviewers, commands, headSha }) {
  const trusted = new Set(trustedReviewers.map((login) => login.toLowerCase()));
  const isPipelinePublisher = (comment) => {
    const login = comment.user?.login?.toLowerCase() ?? '';
    return login === 'github-actions[bot]' || trusted.has(login);
  };
  const handledText = issueComments
    .filter(isPipelinePublisher)
    .map((comment) => comment.body ?? '')
    .join('\n');
  const isTrustedHuman = (item) => {
    const login = item.user?.login?.toLowerCase() ?? '';
    return trusted.has(login) && !login.endsWith(botSuffix);
  };

  const candidates = [
    ...reviews
      .filter((review) => isTrustedHuman(review) && review.state === 'CHANGES_REQUESTED')
      .map((review) => ({ kind: 'review', id: review.id, body: review.body ?? '', createdAt: review.submitted_at })),
    ...reviewComments
      .filter(isTrustedHuman)
      .map((comment) => ({ kind: 'inline', id: comment.id, body: comment.body ?? '', createdAt: comment.created_at })),
    ...issueComments
      .filter((comment) => isTrustedHuman(comment) && commands.some((command) => (comment.body ?? '').toLowerCase().includes(command)))
      .map((comment) => ({ kind: 'comment', id: comment.id, body: comment.body ?? '', createdAt: comment.created_at })),
    ...issueComments
      .filter((comment) => {
        return isPipelinePublisher(comment) && (comment.body ?? '').includes(`:${headSha} -->`);
      })
      .filter((comment) => (comment.body ?? '').includes('changes required'))
      .map((comment) => {
        const lane = comment.body.match(/<!-- agent-review:([a-z]+):/)?.[1] ?? 'unknown';
        return { kind: 'llm', id: `${lane}:${headSha}`, body: comment.body ?? '', createdAt: comment.updated_at ?? comment.created_at, lane };
      })
      .filter((candidate) => (handledText.match(new RegExp(`pr-pipeline:handled:llm:${candidate.lane}:`, 'g')) ?? []).length < 2),
  ];

  return candidates
    .filter((candidate) => !handledText.includes(markerFor(candidate.kind, candidate.id)))
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export function readySlices(issues, manifests, openSliceIds = new Set(), completedSliceIds = new Set()) {
  const completed = new Set([
    ...completedSliceIds,
    ...(
    Object.values(manifests)
      .filter((slice) => ['accepted', 'delivered'].includes(slice.status))
      .map((slice) => slice.id)
    ),
  ]);
  return issues
    .map((issue) => ({ issue, slice: manifests[issue.sliceId] }))
    .filter(({ slice }) => slice && !openSliceIds.has(slice.id))
    .filter(({ slice }) => slice.depends_on.every((dependency) => completed.has(dependency) || openSliceIds.has(dependency)))
    .sort((a, b) => a.issue.number - b.issue.number);
}

export function nextAction({ pulls, feedbackByPull, issues, manifests, completedSliceIds = new Set(), maxOpenPullRequests, trunk = 'main' }) {
  const ordered = stackOrder(pulls, trunk);
  for (const pull of ordered) {
    const feedback = feedbackByPull.get(pull.number) ?? [];
    if (feedback.length > 0) return { type: 'feedback', pull, feedback };
  }
  if (pulls.length >= maxOpenPullRequests) return { type: 'idle', reason: 'stack-full' };
  const openSliceIds = new Set(pulls.map((pull) => pull.sliceId).filter(Boolean));
  const ready = readySlices(issues, manifests, openSliceIds, completedSliceIds);
  return ready.length > 0
    ? { type: 'slice', issue: ready[0].issue, slice: ready[0].slice }
    : { type: 'idle', reason: 'no-ready-slice' };
}
