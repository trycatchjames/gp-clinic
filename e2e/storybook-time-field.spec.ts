import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-013');

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

test('captures ready and asynchronous time-field states', async ({ page }) => {
  await openStory(page, 'molecules-forms-local-time-field--default');
  await expect(page.getByRole('option', { name: /9:15 am/ })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await capture(page, 'storybook-local-time-field');

  await openStory(page, 'molecules-forms-local-time-field--result-states');
  await expect(page.getByRole('status')).toHaveCount(2);
  await expect(page.getByRole('alert')).toHaveCount(1);
  await capture(page, 'storybook-local-time-field-states');
});

test('[storybook-local-time-field-keyboard] skips unavailable time and selects explicitly', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-local-time-field--default');
  const input = page.getByRole('combobox', { name: 'Appointment start time' });
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: '9:30 am' })).toHaveAttribute(
    'data-active',
    'true',
  );
  await expect(input).toHaveValue('');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('9:30 am');
  await expect(input).toBeFocused();
});

test('fits long timezone and option content at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-local-time-field--narrow');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByText(/Lord Howe Daylight Time/)).toBeVisible();
  await capture(page, 'storybook-local-time-field-narrow');
});
