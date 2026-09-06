import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-004/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
  // A story's own play function may have left focus part-way through its flow. Click the empty
  // margin to reset it, so the tab order asserted below is the one a fresh operator would meet and
  // the first Tab counts as keyboard focus.
  await page.mouse.click(2, 2);
  await expect(page.locator('body')).toBeFocused();
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

test('[filter-bar-states] keeps searching, no matches and partial results distinct', async ({
  page,
}) => {
  await openStory(page, 'molecules-search-filter-bar--states');

  await expect(page.getByText('Searching…')).toBeVisible();
  await expect(page.getByText('No patients match these filters')).toBeVisible();
  await expect(page.getByText('7 of 12 patients shown · one location did not respond')).toBeVisible();
  await capture(page, 'filter-bar-states');
});

test('[filter-bar-keyboard] reaches the query first, then each filter in task order', async ({
  page,
}) => {
  await openStory(page, 'molecules-search-filter-bar--keyboard-flow');
  const region = page.getByRole('search');

  await page.keyboard.press('Tab');
  await expect(region.getByRole('searchbox')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(region.getByLabel('Location')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(region.getByLabel('Record status')).toBeFocused();
  await capture(page, 'filter-bar-keyboard');
});

test('[list-view-selection] marks the chosen record without relying on colour', async ({ page }) => {
  await openStory(page, 'molecules-lists-list-view--selected');

  const selected = page.getByRole('button', { pressed: true });
  await expect(selected).toHaveCount(1);
  await expect(selected).toContainText('Marley Tranh');
  await expect(selected.getByText('Selected')).toBeAttached();
  await capture(page, 'list-view-selection');
});

test('[list-view-density] keeps both densities scannable', async ({ page }) => {
  await openStory(page, 'molecules-lists-list-view--compact');
  await capture(page, 'list-view-density');
});

test('[list-view-keyboard] moves focus through records without selecting them', async ({
  page,
}) => {
  await openStory(page, 'molecules-lists-list-view--keyboard-flow');
  const rows = page.getByRole('button');

  await page.keyboard.press('Tab');
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'false');

  await page.keyboard.press('Enter');
  await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'true');

  await page.keyboard.press('ArrowUp');
  await expect(rows.first()).toBeFocused();
  await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await capture(page, 'list-view-keyboard');
});

test('[context-banner-states] keeps identity, status, facts and notice structurally distinct', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-context-banner--states');

  await expect(page.getByRole('region', { name: 'Marlee Tran' })).toBeVisible();
  await expect(page.getByText('Documented anaphylaxis to amoxicillin. Confirm before prescribing.')).toBeVisible();
  await expect(page.getByText('Not recorded')).toBeVisible();
  await capture(page, 'context-banner-states');
});

test('[context-banner-narrow] keeps identity and actions usable at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-context-context-banner--narrow');

  await expect(page.getByRole('heading', { name: 'Wilhelmina Papadopoulos-Ashworth' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open record' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await capture(page, 'context-banner-narrow');
});

test('[summary-list-density] keeps comfortable and compact comparable', async ({ page }) => {
  await openStory(page, 'molecules-data-display-summary-list--compact');
  await capture(page, 'summary-list-density');
});

test('[summary-list-content-stress] preserves long identifiers and stated absences', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-summary-list--content-stress');

  await expect(page.getByText('NRT-5140-ARCHIVE-2019-000418')).toBeVisible();
  await expect(page.getByText('Not recorded')).toBeVisible();
  await capture(page, 'summary-list-content-stress');
});

test('contains every molecule narrow layout at a 360 pixel viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  for (const story of [
    'molecules-search-filter-bar--narrow',
    'molecules-lists-list-view--narrow',
    'molecules-data-display-summary-list--narrow',
  ]) {
    await openStory(page, story);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }

  await openStory(page, 'molecules-search-filter-bar--narrow');
  await capture(page, 'filter-bar-narrow');
});
