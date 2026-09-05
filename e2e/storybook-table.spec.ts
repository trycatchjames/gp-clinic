import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-007/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

async function capture(page: Page, evidenceId: string) {
  const target = page.locator(`[data-evidence="${evidenceId}"]`);
  await expect(target).toBeVisible();
  await target.screenshot({
    path: path.join(evidenceDirectory, `${evidenceId}.png`),
    animations: 'disabled',
  });
}

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test('renders a compact semantic numeric comparison', async ({ page }) => {
  await openStory(page, 'atoms-data-display-table--numeric-comparison');
  await expect(page.getByRole('table', { name: 'Synthetic fee comparison' })).toBeVisible();
  await capture(page, 'storybook-table-comparison');
});

test('contains table overflow at a 360 pixel viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-data-display-table--narrow');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'storybook-table-narrow');
});
