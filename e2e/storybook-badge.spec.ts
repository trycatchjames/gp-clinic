import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-009/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test('renders explicit semantic variants and captures their evidence', async ({ page }) => {
  await openStory(page, 'atoms-data-display-badge--variants');

  const region = page.getByRole('region', { name: 'Badge semantic variants' });
  await expect(region.getByText('Completed', { exact: true })).toBeVisible();
  await expect(region.getByText('Similar details', { exact: true })).toBeVisible();
  await expect(region.getByText('Manual record', { exact: true })).toBeVisible();
  await expect(region.locator('[data-slot="badge"]')).toHaveCount(7);

  await region.screenshot({
    path: path.join(evidenceDirectory, 'badge-semantic-variants.png'),
    animations: 'disabled',
  });
});

test('keeps a long label readable at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-data-display-badge--long-label');

  const badge = page.locator('[data-slot="badge"]');
  await expect(badge).toContainText('Similar demographic details');
  expect(await badge.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
