import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import config from '../config.json' with { type: 'json' };
import { dispatch, githubClient, removeLabel, setLabels } from './lib/github.mjs';
import { markerFor } from './lib/decision.mjs';
import { repositoryRoot } from './lib/manifests.mjs';
import YAML from 'yaml';

const client = githubClient();
const state = JSON.parse(await readFile(path.join(repositoryRoot, 'tools/pr-pipeline/runtime/state.json'), 'utf8'));
const git = (...args) => execFileSync('git', args, { cwd: repositoryRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

if (!git('status', '--porcelain')) throw new Error('Agent produced no repository changes');
git('add', '--all');
const message = state.mode === 'slice' ? `feat: deliver ${state.sliceId}` : `fix: address feedback on PR #${state.pullNumber}`;
git('commit', '-m', message);

if (state.mode === 'feedback') {
  const updates = [{ number: state.pullNumber, branch: state.branch, beforeSha: state.beforeSha, afterSha: git('rev-parse', 'HEAD') }];
  let oldParent = state.beforeSha;
  let newParent = updates[0].afterSha;
  try {
    for (const descendant of state.descendants) {
      git('checkout', '-B', descendant.branch, descendant.beforeSha);
      git('rebase', '--onto', newParent, oldParent, descendant.beforeSha);
      const afterSha = git('rev-parse', 'HEAD');
      updates.push({ ...descendant, afterSha });
      oldParent = descendant.beforeSha;
      newParent = afterSha;
    }
    const leases = updates.map((item) => `--force-with-lease=refs/heads/${item.branch}:${item.beforeSha}`);
    const refs = updates.map((item) => `${item.afterSha}:refs/heads/${item.branch}`);
    git('push', '--atomic', ...leases, 'origin', ...refs);
  } catch (error) {
    try { git('rebase', '--abort'); } catch {}
    await setLabels(client, state.pullNumber, [config.labels.blocked]);
    await client.request('POST', `/issues/${state.pullNumber}/comments`, {
      body: `The feedback change could not be rebased through every descendant atomically. No branch was pushed.\n\n\`${String(error.message).slice(0, 1000)}\``,
    });
    throw error;
  }
  const markers = state.feedback.map((item) => markerFor(item.kind, item.id)).join('\n');
  await client.request('POST', `/issues/${state.pullNumber}/comments`, {
    body: `${markers}\nFeedback addressed and the affected stack branches were updated atomically. Deterministic and LLM reviews are running again.`,
  });
  await removeLabel(client, state.pullNumber, config.labels.working);
  await setLabels(client, state.pullNumber, [config.labels.humanReview]);

  // Every branch the atomic push moved carries a new head, so each of those pull requests
  // needs its deterministic and specialist gates re-run against that head. Revalidating only
  // the bottom pull request would leave rebased descendants merge-eligible on stale evidence.
  for (const update of updates) {
    if (update.number !== state.pullNumber) {
      await client.request('POST', `/issues/${update.number}/comments`, {
        body: `Rebased onto the updated PR #${state.pullNumber} (\`${update.beforeSha.slice(0, 7)}\` → \`${update.afterSha.slice(0, 7)}\`). Review gates are running again on the new head.`,
      });
    }
    await dispatch(client, 'agent_pr_changed', { pull_number: update.number, head_sha: update.afterSha });
  }
}

if (state.mode === 'slice') {
  const headSha = git('rev-parse', 'HEAD');
  git('push', 'origin', `${headSha}:refs/heads/${state.branch}`);
  const manifest = YAML.parse(await readFile(path.join(repositoryRoot, state.manifest), 'utf8'));
  const screenshotMarkdown = (manifest.evidence?.screenshots ?? []).map((id) =>
    `![${id}](https://raw.githubusercontent.com/${client.owner}/${client.repo}/${state.branch}/delivery/evidence/${state.sliceId}/screenshots/${id}.png)`,
  ).join('\n\n');
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${client.owner}/${client.repo}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const pull = await client.request('POST', '/pulls', {
    title: `[${state.sliceId}] ${state.title}`,
    head: state.branch,
    base: state.base,
    draft: false,
    body: `Closes #${state.issueNumber}\n\nDelivery contract: \`${state.manifest}\`\n\n## Review evidence\n\n${screenshotMarkdown || 'This slice declares no screenshots.'}\n\nPlaywright video, trace and HTML report: [workflow evidence](${runUrl})\n\n## Scope\n\nSee the manifest for the actor outcome, scenarios and explicit exclusions. Deterministic and specialist review gates run on this head.`,
  });
  await setLabels(client, pull.number, [config.labels.managed, config.labels.humanReview, ...(state.base === 'main' ? [] : [config.labels.waiting])]);
  if (state.stackPullNumbers.length === 0) {
    await client.request('POST', '/stacks', { pull_requests: [pull.number] });
  } else {
    const stacks = await client.paginate(`/stacks?pull_request=${state.stackPullNumbers.at(-1)}`);
    if (stacks[0]) await client.request('POST', `/stacks/${stacks[0].number}/add`, { pull_requests: [pull.number] });
    else await client.request('POST', '/stacks', { pull_requests: [...state.stackPullNumbers, pull.number] });
  }
  await client.request('POST', `/issues/${state.issueNumber}/comments`, { body: `Opened stacked PR #${pull.number}.` });
  await removeLabel(client, state.issueNumber, config.labels.working);
  await dispatch(client, 'agent_pr_changed', { pull_number: pull.number, head_sha: headSha });
}
