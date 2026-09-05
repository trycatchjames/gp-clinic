import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-012');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

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

test('captures the complete range and precise invalid states', async ({ page }) => {
  await openStory(page, 'molecules-forms-australian-date-range-field--default');
  await expect(page.getByRole('dialog', { name: 'April 2027' })).toBeVisible();
  await capture(page, 'storybook-australian-date-range');

  await openStory(page, 'molecules-forms-australian-date-range-field--range-states');
  await expect(page.getByRole('alert')).toHaveCount(2);
  await capture(page, 'storybook-australian-date-range-states');
});

test('[storybook-australian-date-range-keyboard] selects one boundary and preserves the other', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-australian-date-range-field--start-only');
  const startInput = page.getByRole('textbox', { name: 'Start date' });
  const endInput = page.getByRole('textbox', { name: 'End date' });

  await startInput.focus();
  await page.keyboard.press('Alt+ArrowDown');
  await expect(page.getByRole('button', { name: 'Saturday 3 April 2027' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(startInput).toHaveValue('04/04/2027');
  await expect(endInput).toHaveValue('');
  await expect(startInput).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: /Choose Start date/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(endInput).toBeFocused();
});

test('stacks both boundaries and an open calendar at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 1000 });
  await openStory(page, 'molecules-forms-australian-date-range-field--narrow');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByRole('textbox', { name: 'End date' })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'April 2027' })).toBeVisible();
  await capture(page, 'storybook-australian-date-range-narrow');
});
