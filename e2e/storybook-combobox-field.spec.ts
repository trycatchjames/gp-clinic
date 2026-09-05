import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-010');

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

test('captures the ready and result-state contracts', async ({ page }) => {
  await openStory(page, 'molecules-forms-combobox-field--default');
  await expect(page.getByRole('listbox', { name: 'Referral recipient options' })).toBeVisible();
  await capture(page, 'storybook-combobox-field');

  await openStory(page, 'molecules-forms-combobox-field--result-states');
  await expect(page.getByRole('status')).toHaveCount(2);
  await expect(page.getByRole('alert')).toHaveCount(1);
  await capture(page, 'storybook-combobox-field-states');
});

test('[storybook-combobox-field-keyboard] moves focus without selecting, then selects explicitly', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-combobox-field--default');
  const input = page.getByRole('combobox', { name: 'Referral recipient' });

  await input.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const active = page.getByRole('option', { name: /Dr Samira Malik/ });
  await expect(active).toHaveAttribute('data-active', 'true');
  await expect(active).toHaveAttribute('aria-selected', 'false');
  await expect(input).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Dr Samira Malik — Harbour Cardiology');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();
});

test('keeps the field and long options contained at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-combobox-field--narrow');

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await expect(page.getByText('Community Dietetics and Diabetes Education Service')).toBeVisible();
  await capture(page, 'storybook-combobox-field-narrow');
});
