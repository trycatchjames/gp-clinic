import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-025/screenshots');

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

test.use({ viewport: { width: 1280, height: 800 } });

test('[bulk-selection-states] keeps the bar the same shape from nothing selected to a selection beyond the page', async ({
  page,
}) => {
  await openStory(page, 'molecules-lists-bulk-selection--in-table');
  const states = page.locator('[data-evidence="bulk-selection-states"]');
  const resting = states.getByRole('region', { name: 'Selected results, none' });
  const part = states.getByRole('region', { name: 'Selected results, part of this page' });
  const beyond = states.getByRole('region', { name: 'Selected results, beyond this page' });

  await expect(resting).toContainText('No results selected');
  await expect(part).toContainText('2 results selected');
  await expect(beyond).toContainText('22 results selected');

  // The resting bar offers nothing over the records, so the first tick does not move the rows.
  await expect(resting.getByRole('button')).toHaveCount(1);
  await capture(page, 'bulk-selection-states');
});

test('[bulk-selection-beyond-page] says how much of the selection is not on screen', async ({
  page,
}) => {
  await openStory(page, 'molecules-lists-bulk-selection--beyond-page');
  const region = page.locator('[data-evidence="bulk-selection-beyond-page"]');

  // Five rows are visible and selectable; the count is larger, and the difference is stated.
  await expect(region.getByRole('checkbox', { checked: true })).toHaveCount(6);
  await expect(region.getByRole('status')).toContainText('22 results selected');
  await expect(region.getByRole('status')).toContainText('17 not on this page');
  await expect(
    region.getByRole('button', { name: 'Select all 240 matching results' }),
  ).toBeEnabled();
  await capture(page, 'bulk-selection-beyond-page');
});

test('[bulk-selection-blocked] refuses a result the operator may not act on and names the rule', async ({
  page,
}) => {
  await openStory(page, 'molecules-lists-bulk-selection--blocked-rows');
  const region = page.locator('[data-evidence="bulk-selection-blocked"]');
  const blocked = region.getByRole('checkbox', { name: /Cervical screening/ });

  await expect(blocked).toBeDisabled();
  await expect(region.getByText(/1 result on this page cannot be included/)).toBeVisible();

  const disposition = region.getByRole('button', { name: 'Record review outcome' });
  await expect(disposition).toBeDisabled();
  await expect(
    region.getByText(/A review outcome is recorded one result at a time/),
  ).toBeVisible();

  // The refusal is not carried by the disabled tint alone.
  await expect(blocked.locator('..').locator('svg.lucide-ban')).toBeVisible();
  await capture(page, 'bulk-selection-blocked');
});

test('[bulk-selection-narrow] keeps the count, the scope and the actions readable at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-lists-bulk-selection--narrow');
  const region = page.locator('[data-evidence="bulk-selection-narrow"]');

  await expect(region.getByRole('status')).toContainText('17 not on this page');
  await expect(region.getByRole('button', { name: 'Clear selection' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'bulk-selection-narrow');
});

test('[bulk-selection-keyboard] selects only on Space and keeps focus through clearing', async ({
  page,
}) => {
  await openStory(page, 'molecules-lists-bulk-selection--keyboard-flow');
  const region = page.locator('[data-evidence="bulk-selection-keyboard"]');
  const clear = region.getByRole('button', { name: 'Clear selection' });

  // The story's play has already cleared the selection, so this flow starts from an empty one.
  await expect(region.getByRole('status')).toContainText('No results selected');

  const first = region.getByRole('checkbox', { name: /Marlee Tran/ });
  await first.focus();
  await expect(first).not.toBeChecked();
  // Arriving on a row does not select it. Only Space does.
  await expect(region.getByRole('status')).toContainText('No results selected');

  await page.keyboard.press('Space');
  await expect(first).toBeChecked();
  await expect(region.getByRole('status')).toContainText('1 result selected');

  const page_all = region.getByRole('checkbox', {
    name: 'Select all reviewable results on this page',
  });
  await expect(page_all).toHaveAttribute('aria-checked', 'mixed');

  await clear.focus();
  await page.keyboard.press('Enter');
  await expect(region.getByRole('status')).toContainText('No results selected');
  await expect(clear).toBeFocused();
});
