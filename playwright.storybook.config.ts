import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.STORYBOOK_PORT ?? 6006);
const baseURL = process.env.STORYBOOK_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  testMatch: 'storybook-foundations.spec.ts',
  outputDir: 'test-results/playwright-storybook',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/storybook', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'on',
    video: process.env.CI ? 'off' : 'on',
    screenshot: 'only-on-failure',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm --filter @gp/web storybook --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
