import { githubClient } from './lib/github.mjs';
import { publishReview } from './lib/reviews.mjs';

const [lane, pullNumberValue, sha, reportPath] = process.argv.slice(2);
const pullNumber = Number(pullNumberValue);
if (!lane || !pullNumber || !sha || !reportPath) {
  throw new Error('Usage: publish-review <lane> <pr> <sha> <report>');
}
const passed = await publishReview({ client: githubClient(), lane, pullNumber, sha, reportPath });
console.log(`${lane}: ${passed ? 'PASS' : 'FAIL'}`);
