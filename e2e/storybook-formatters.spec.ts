import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-006/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test('[storybook-display-formatters] renders the shared Australian display rules', async ({
  page,
}) => {
  await openStory(page, 'foundations-display-formatters--australian-display');
  await expect(page.getByRole('heading', { name: 'Australian formats, one system' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '$76.35' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0412 345 678' })).toBeVisible();
  await page.locator('[data-evidence="storybook-display-formatters"]').screenshot({
    path: path.join(evidenceDirectory, 'storybook-display-formatters.png'),
    animations: 'disabled',
  });
});
