import { githubClient } from './lib/github.mjs';
import { finishWork } from './lib/work.mjs';

const state = await finishWork({ client: githubClient() });
console.log(`Published ${state.mode} work from ${state.branch}.`);
