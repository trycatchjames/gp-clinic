import config from '../config.json' with { type: 'json' };
import { githubClient } from './lib/github.mjs';
import { inspectPipeline, summariseAction } from './lib/planner.mjs';
import { positiveIntegerSetting } from './lib/settings.mjs';

const client = githubClient();
const maxOpenPullRequests = positiveIntegerSetting(
  process.env.PIPELINE_MAX_OPEN_PRS || config.maxOpenPullRequests,
  'PIPELINE_MAX_OPEN_PRS',
);
const trustedReviewers = (process.env.TRUSTED_REVIEWERS || config.trustedReviewers.join(','))
  .split(',').map((value) => value.trim()).filter(Boolean);
const action = await inspectPipeline({ client, maxOpenPullRequests, trustedReviewers });
console.log(JSON.stringify({ action: summariseAction(action) }, null, 2));
