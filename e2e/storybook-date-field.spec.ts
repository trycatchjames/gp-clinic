import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-011');

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

test('captures the open calendar and text-entry states', async ({ page }) => {
  await openStory(page, 'molecules-forms-australian-date-field--default');
  await expect(page.getByRole('dialog', { name: 'April 2027' })).toBeVisible();
  await capture(page, 'storybook-australian-date-field');

  await openStory(page, 'molecules-forms-australian-date-field--field-states');
  await expect(page.getByRole('alert')).toHaveText(/four-digit year/);
  await capture(page, 'storybook-australian-date-field-states');
});

test('[storybook-australian-date-field-keyboard] navigates without selecting then selects explicitly', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-australian-date-field--selected');
  const input = page.getByRole('textbox', { name: 'Appointment date' });

  await input.focus();
  await page.keyboard.press('Alt+ArrowDown');
  await expect(page.getByRole('button', { name: 'Saturday 3 April 2027' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('button', { name: 'Saturday 10 April 2027' })).toBeFocused();
  await expect(page.getByRole('textbox')).toHaveValue('03/04/2027');
  await page.keyboard.press('PageDown');
  await expect(page.getByRole('button', { name: 'Monday 10 May 2027' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('10/05/2027');
  await expect(input).toBeFocused();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('fits the complete field and calendar at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-australian-date-field--narrow');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByRole('dialog', { name: 'April 2027' })).toBeVisible();
  await capture(page, 'storybook-australian-date-field-narrow');
});
