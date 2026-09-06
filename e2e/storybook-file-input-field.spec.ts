import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-014');

async function capture(page: Page, evidenceId: string) {
  const target = page.locator(`[data-evidence="${evidenceId}"]`);
  await expect(target).toBeVisible();
  await target.screenshot({
    path: path.join(evidenceDirectory, 'screenshots', `${evidenceId}.png`),
    animations: 'disabled',
  });
}

test.beforeAll(async () => {
  await mkdir(path.join(evidenceDirectory, 'screenshots'), { recursive: true });
});

test('[storybook-file-input-field] offers a named choose button with drop as a convenience', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-file-input-field--empty');

  await expect(page.getByRole('button', { name: 'Choose file' })).toBeVisible();
  await expect(page.getByRole('group', { name: /^Drop files for/ })).toBeVisible();
  await expect(page.getByRole('list')).toHaveCount(0);
  await capture(page, 'storybook-file-input-field');
});

test('[storybook-file-input-field-states] keeps each per-item state textually distinct', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-file-input-field--states');

  const items = page.getByRole('listitem');
  await expect(items).toHaveCount(5);
  await expect(items.nth(0)).toContainText('Not uploaded yet');
  await expect(items.nth(1)).toHaveAttribute('aria-busy', 'true');
  await expect(items.nth(2)).toContainText('Not yet filed to the patient record');
  await expect(items.nth(3)).toContainText('Nothing was filed to the record');
  await expect(items.nth(4)).toContainText('Rejected');
  await capture(page, 'storybook-file-input-field-states');
});

test('[storybook-file-input-field-keyboard] reaches retry and remove without a pointer', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-file-input-field--keyboard-flow');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Retry' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /^Remove / })).toBeFocused();
  await capture(page, 'storybook-file-input-field-keyboard');
});

test('[storybook-file-input-field-narrow] wraps long filenames and actions at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-file-input-field--narrow');

  await expect(page.getByText(/wongaburra-community-health-cardiology/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await capture(page, 'storybook-file-input-field-narrow');
});
