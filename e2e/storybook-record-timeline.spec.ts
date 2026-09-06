import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-028/screenshots');

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

test('[timeline-entries] groups by the day an entry applied and names a later recording', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-timeline--with-actions');
  const region = page.locator('[data-evidence="timeline-entries"]');

  await expect(region.getByRole('heading', { name: '4 September 2026' })).toBeVisible();
  await expect(region.getByRole('heading', { name: '28 August 2026' })).toBeVisible();

  // Only the entry written down days later carries a recorded time.
  await expect(region.getByText(/^Recorded /)).toHaveCount(1);
  await expect(region.getByText(/Recorded 02\/09\/2026/)).toBeVisible();
  await capture(page, 'timeline-entries');
});

test('[timeline-amendment] keeps both halves of the chain readable on their own', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-timeline--amendment-chain');
  const region = page.locator('[data-evidence="timeline-amendment"]');

  await expect(region.getByText('Amended since')).toBeVisible();
  await expect(region.getByText('Amendment')).toBeVisible();
  await expect(region.getByText(/Amends the consultation note of 20 August 2026/)).toBeVisible();
  await expect(region.getByText(/Amended on 22 August 2026/)).toBeVisible();
  await capture(page, 'timeline-amendment');
});

test('[timeline-narrow] stacks the metadata at 360 pixels without losing which time is which', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-data-display-record-timeline--narrow');
  const region = page.locator('[data-evidence="timeline-narrow"]');

  await expect(region.getByText(/Recorded 02\/09\/2026/)).toBeVisible();
  await expect(region.getByText('Dr Aroha Duong').first()).toBeVisible();

  // A long summary wraps rather than pushing the timeline off the side of the screen.
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'timeline-narrow');
});

test('[timeline-keyboard] reaches each entry’s action in the order the entries are read', async ({
  page,
}) => {
  await openStory(page, 'molecules-data-display-record-timeline--keyboard-flow');
  const region = page.locator('[data-evidence="timeline-keyboard"]');
  const actions = region.getByRole('button', { name: 'Open entry' });

  await expect(actions).toHaveCount(3);
  await page.keyboard.press('Tab');
  await expect(actions.nth(0)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.nth(1)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.nth(2)).toBeFocused();

  // Reading the timeline changes nothing about the entries in it.
  await expect(region.getByText('Amended since')).toHaveCount(0);
  await expect(region.getByText('Entered in error')).toHaveCount(0);
});
