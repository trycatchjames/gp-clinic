import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-008/screenshots');

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

test('[storybook-data-table-controls] sorts, pages and discloses nested rows', async ({ page }) => {
  await openStory(page, 'molecules-data-display-data-table--sortable-paginated');
  await expect(page.getByRole('table', { name: 'Synthetic patient account invoices' })).toBeVisible();
  await capture(page, 'storybook-data-table');

  const issuedSort = page.getByRole('button', {
    name: 'Sort by issued date, currently descending',
  });
  await issuedSort.focus();
  await expect(issuedSort).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('columnheader', { name: /issued date/i })).toHaveAttribute(
    'aria-sort',
    'ascending',
  );

  await page.getByRole('combobox', { name: 'Rows per page' }).click();
  await page.getByRole('option', { name: '10' }).click();
  await expect(page.getByText('Page 1 of 2')).toBeVisible();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();

  await openStory(page, 'molecules-data-display-data-table--hierarchy');
  await expect(page.getByRole('table', { name: 'Line items for INV-1049' })).toBeVisible();
  await capture(page, 'storybook-data-table-hierarchy');

  const expand = page.getByRole('button', { name: 'Show details for INV-1052' });
  await expand.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Hide details for INV-1052' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.getByRole('table', { name: 'Line items for INV-1052' })).toBeVisible();
});

test('contains data-table overflow at a 360 pixel viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-data-display-data-table--narrow');
  await expect(page.getByRole('button', { name: /Sort by issued date/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'storybook-data-table-narrow');
});
