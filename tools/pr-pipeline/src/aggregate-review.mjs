import { githubClient } from './lib/github.mjs';
import { aggregateReviews } from './lib/reviews.mjs';
import { reviewLanes } from './lib/planner.mjs';

const [sha] = process.argv.slice(2);
if (!sha) throw new Error('Usage: aggregate-review <sha>');
const passed = await aggregateReviews({ client: githubClient(), sha, lanes: reviewLanes });
if (!passed) process.exitCode = 1;
