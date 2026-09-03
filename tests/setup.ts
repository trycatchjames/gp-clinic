import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without global test APIs, so React Testing Library never installs
// its own cleanup hook. Without this, each render stays in the document and
// later queries match stale nodes from earlier tests.
afterEach(cleanup);
