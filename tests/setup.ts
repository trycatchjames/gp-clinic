import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without global test APIs, so React Testing Library never installs
// its own cleanup hook. Without this, each render stays in the document and
// later queries match stale nodes from earlier tests.
afterEach(cleanup);

// jsdom has no layout engine, so `scrollIntoView` exists only to throw. Components that bring a
// control into view after moving focus to it are correct to call it; stub it so the assertion
// under test is the focus move rather than the absence of a layout.
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = () => {};
}
