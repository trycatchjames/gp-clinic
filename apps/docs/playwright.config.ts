import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './e2e',
  outputDir: '../../test-results/docs',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4174', trace: 'on', video: 'on' },
  projects: [{ name: 'docs-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm docs:artifact && node test-results/product-docs/scripts/serve.mjs',
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
