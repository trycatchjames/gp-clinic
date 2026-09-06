import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-029/screenshots');

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

test('[comparison-differences] states each difference as a word and never leaves a side blank', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-comparison--default');
  const region = page.locator('[data-evidence="comparison-differences"]');

  await expect(region.getByText('Conflict')).toBeVisible();
  await expect(region.getByText('Same')).toBeVisible();
  await expect(region.getByText('Differs')).toHaveCount(4);

  // A side that does not hold a fact says so, because a blank would read as agreement.
  await expect(region.getByText('Not recorded')).toHaveCount(2);

  // Every value keeps the record it came from, so a stacked layout cannot detach one.
  await expect(region.getByText('Record NRT-4821')).toHaveCount(6);
  await expect(region.getByText('Record NRT-4822')).toHaveCount(6);
  await capture(page, 'comparison-differences');
});

test('[comparison-resolving] proposes no survivor and resolves one fact at a time', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-comparison--resolving');
  const region = page.locator('[data-evidence="comparison-resolving"]');

  // The story arrives with one fact already resolved by its caller and nothing else preselected.
  await expect(region.getByRole('radio', { checked: true })).toHaveCount(1);
  await expect(region.getByRole('status')).toContainText('4 of 5 differences still to resolve');

  const allergies = region.getByRole('radiogroup', { name: 'Recorded allergies' });
  await allergies.getByRole('radio', { name: 'Keep Record NRT-4821' }).check();

  await expect(region.getByRole('radio', { checked: true })).toHaveCount(2);
  await expect(region.getByRole('status')).toContainText('3 of 5 differences still to resolve');
  await capture(page, 'comparison-resolving');
});

test('[comparison-narrow] stacks the two sides in reading order at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-data-display-record-comparison--narrow');
  const region = page.locator('[data-evidence="comparison-narrow"]');

  const left = region.getByText('Marlee Tran');
  const right = region.getByText('Marley Tranh');
  const leftBox = await left.boundingBox();
  const rightBox = await right.boundingBox();

  // Stacked, not side by side: the second value sits below the first rather than beside it.
  expect(rightBox?.y ?? 0).toBeGreaterThan(leftBox?.y ?? 0);
  await expect(region.getByText('Record NRT-4821').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'comparison-narrow');
});

test('[comparison-keyboard] moves through the facts in the order they are read', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-comparison--keyboard-flow');
  const region = page.locator('[data-evidence="comparison-keyboard"]');
  const groups = region.getByRole('radiogroup');

  // The story's play resolves the first fact from the keyboard.
  await expect(groups.nth(0).getByRole('radio', { name: 'Keep Record NRT-4821' })).toBeChecked();
  await expect(region.getByRole('status')).toContainText('4 of 5 differences still to resolve');

  // Tab reaches the next fact's group rather than the next option within this one, so a reviewer
  // moves through the facts in the order they read them.
  await groups.nth(0).getByRole('radio', { name: 'Keep Record NRT-4821' }).focus();
  await page.keyboard.press('Tab');
  await expect(groups.nth(1).getByRole('radio', { name: 'Keep Record NRT-4821' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(groups.nth(2).getByRole('radio', { name: 'Keep Record NRT-4821' })).toBeFocused();

  // Arrows move within one fact's options and choose nothing: focus movement never selects.
  await groups.nth(1).getByRole('radio', { name: 'Keep Record NRT-4821' }).focus();
  await page.keyboard.press('ArrowDown');
  const second = groups.nth(1).getByRole('radio', { name: 'Keep Record NRT-4822' });
  await expect(second).toBeFocused();
  await expect(second).not.toBeChecked();

  // Resolving a fact leaves every other fact unresolved.
  await page.keyboard.press('Space');
  await expect(second).toBeChecked();
  await expect(groups.nth(2).getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(region.getByRole('status')).toContainText('3 of 5 differences still to resolve');
});
