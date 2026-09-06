import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-030/screenshots');

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

test('[page-header-states] keeps current, refreshing, stale and unknown visibly different', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-page-header--all-states');
  const sheet = page.locator('[data-evidence="page-header-states"]');

  await expect(sheet.getByRole('heading', { name: 'Results inbox, current' })).toBeVisible();
  await expect(sheet.getByText(/^Refreshing\. Showing the view as at/)).toHaveCount(2);
  await expect(sheet.getByText(/^This view is behind the record/)).toHaveCount(2);
  await expect(sheet.getByText('Freshness of this view is not known')).toHaveCount(2);

  // A refreshing header still says which queue and location it is showing.
  await expect(sheet.getByText('Northside Demo Clinic')).toHaveCount(4);

  // None of them claims the banner landmark, so four on one screen stay distinguishable.
  await expect(sheet.getByRole('banner')).toHaveCount(0);
  await capture(page, 'page-header-states');
});

test('[page-header-stale] says the view is behind the record where the operator acts', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-page-header--stale');
  const header = page.locator('[data-evidence="page-header-stale"]');

  await expect(header.getByText(/This view is behind the record/).first()).toBeVisible();
  await expect(header.getByRole('button', { name: /Refresh/ })).toBeEnabled();

  // Stale is not carried by the tint alone; there is a mark beside the sentence.
  await expect(header.locator('svg.lucide-circle-alert')).toBeVisible();
  await capture(page, 'page-header-stale');
});

test('[page-header-narrow] wraps the title and keeps the refresh reachable at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-context-page-header--narrow');
  const header = page.locator('[data-evidence="page-header-narrow"]');

  const heading = header.getByRole('heading');
  const lines = await heading.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getClientRects().length;
  });
  // The title wraps rather than truncating: a screen's scope is not a place to lose words.
  expect(lines).toBeGreaterThan(1);
  expect(await heading.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);

  await expect(header.getByRole('button', { name: /Refresh/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'page-header-narrow');
});

test('[page-header-keyboard] refreshing moves no focus and repeats no announcement', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-page-header--keyboard-flow');
  const header = page.locator('[data-evidence="page-header-keyboard"]');
  const refresh = header.getByRole('button', { name: /Refresh/ });

  // The story's play has already refreshed twice from the keyboard.
  await expect(header.getByTestId('refreshes')).toContainText('Refreshes requested: 2');

  await refresh.focus();
  await page.keyboard.press('Enter');
  await expect(header.getByTestId('refreshes')).toContainText('Refreshes requested: 3');
  await expect(refresh).toBeFocused();

  // Three refreshes of an unchanged view leave one sentence, not three.
  await expect(header.getByText(/^Showing the view as at/)).toHaveCount(2);
});
