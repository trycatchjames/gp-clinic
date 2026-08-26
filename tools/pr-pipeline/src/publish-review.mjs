import { githubClient } from './lib/github.mjs';
import { publishReview } from './lib/reviews.mjs';

const [pullNumberValue, sha, reportPath] = process.argv.slice(2);
const pullNumber = Number(pullNumberValue);
if (!pullNumber || !sha || !reportPath) {
  throw new Error('Usage: publish-review <pr> <sha> <report>');
}
const passed = await publishReview({ client: githubClient(), pullNumber, sha, reportPath });
console.log(`review: ${passed ? 'PASS' : 'FAIL'}`);
