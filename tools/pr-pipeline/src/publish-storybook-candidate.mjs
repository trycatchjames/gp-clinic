import { githubClient } from './lib/github.mjs';
import { updateStorybookCandidate } from './lib/body.mjs';

const [pullNumberValue, sha] = process.argv.slice(2);
const pullNumber = Number(pullNumberValue);
if (!pullNumber || !sha) throw new Error('Usage: publish-storybook-candidate <pr> <sha>');

const client = githubClient();
const pull = await client.request('GET', `/pulls/${pullNumber}`);
const body = updateStorybookCandidate(pull.body, {
  sha,
  artifactUrl: process.env.STORYBOOK_ARTIFACT_URL,
  artifactName: process.env.STORYBOOK_ARTIFACT_NAME,
});
await client.request('PATCH', `/pulls/${pullNumber}`, { body });
console.log(`storybook candidate: ${process.env.STORYBOOK_ARTIFACT_URL ? 'linked' : 'unavailable'}`);
