import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-026/screenshots');

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

test('[itemised-preview] names every record the operation would touch and claims no outcome', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-itemised-outcome--preview');
  const region = page.locator('[data-evidence="itemised-preview"]');

  await expect(region.getByRole('status')).toContainText('6 results');
  await expect(region.getByRole('status')).toContainText('6 ready');
  await expect(region.getByRole('listitem')).toHaveCount(6);
  // Nothing has happened, so nothing interrupts and nothing says it is done.
  await expect(region.getByRole('alert')).toHaveCount(0);
  await expect(region.getByText('Done', { exact: true })).toHaveCount(0);
  await capture(page, 'itemised-preview');
});

test('[itemised-partial-failure] cannot be read as complete success', async ({ page }) => {
  await openStory(page, 'molecules-operation-states-itemised-outcome--partial-failure');
  const region = page.locator('[data-evidence="itemised-partial-failure"]');
  const summary = region.getByRole('alert');

  await expect(summary).toContainText('6 results');
  await expect(summary).toContainText('1 failed');
  await expect(summary).toContainText('1 skipped');
  await expect(summary).toContainText('4 done');

  // What still needs the operator is on screen; what succeeded is put away behind a disclosure.
  const entries = region.getByRole('listitem');
  await expect(entries).toHaveCount(2);
  await expect(entries.nth(0)).toContainText('Failed');
  await expect(entries.nth(0)).toContainText('Nothing about its review changed');
  await expect(entries.nth(0).getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(entries.nth(1)).toContainText('Skipped');
  await expect(region.getByRole('button', { name: /4 results done/ })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await capture(page, 'itemised-partial-failure');
});

test('[itemised-narrow] wraps a reason in full at 360 pixels rather than hiding a clause', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-operation-states-itemised-outcome--narrow');
  const region = page.locator('[data-evidence="itemised-narrow"]');

  const reason = region.getByText(/The result moved back to Dr Rowena Aspinall/);
  await expect(reason).toBeVisible();

  // A reason that wraps has more than one rendered line and no horizontal overflow of its own.
  const lines = await reason.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getClientRects().length;
  });
  expect(lines).toBeGreaterThan(1);
  expect(
    await reason.evaluate((element) => element.scrollWidth <= element.clientWidth),
  ).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'itemised-narrow');
});

test('[itemised-keyboard] reaches each recovery step beside its record and holds focus on the disclosure', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-itemised-outcome--keyboard-flow');
  const region = page.locator('[data-evidence="itemised-keyboard"]');
  const disclosure = region.getByRole('button', { name: /4 results done/ });
  const retry = region.getByRole('button', { name: 'Try again' });

  // The story's play leaves the succeeded records open.
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true');

  // The recovery step for the failed record is reached before the disclosure over the finished ones.
  await page.keyboard.press('Tab');
  await expect(retry).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(disclosure).toBeFocused();

  // Closing the finished records leaves the operator on the control they used.
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
  await expect(disclosure).toBeFocused();
});
