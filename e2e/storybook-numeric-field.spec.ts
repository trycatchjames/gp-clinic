import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-027/screenshots');

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

test('[numeric-field-states] keeps an entry it cannot read exactly as it was typed', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-numeric-field--all-states');
  const sheet = page.locator('[data-evidence="numeric-field-states"]');

  await expect(sheet.getByLabel('Fee for item 44')).toHaveValue('8o.30');
  await expect(sheet.getByLabel('Fee for item 36')).toHaveValue('82.305');
  await expect(sheet.getByLabel('Fee for item 44')).toHaveAttribute('aria-invalid', 'true');

  // Figures are tabular and end-aligned, so amounts in a column compare.
  const alignment = await sheet
    .getByLabel('Fee', { exact: true })
    .evaluate((element) => getComputedStyle(element).textAlign);
  expect(alignment).toBe('right');

  // No entry is a native number input, so none of them carries a spinner.
  await expect(sheet.locator('input[type="number"]')).toHaveCount(0);
  await capture(page, 'numeric-field-states');
});

test('[numeric-field-narrow] keeps the unit beside the entry at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-numeric-field--narrow');
  const sheet = page.locator('[data-evidence="numeric-field-narrow"]');

  // The visible adornment and the spoken unit are separate elements, which is why each unit
  // resolves twice. Assert the visible one, and that the entry is described by the spoken one.
  const adornments = sheet.locator('span[aria-hidden="true"]');
  await expect(adornments.filter({ hasText: '$' })).toBeVisible();
  await expect(adornments.filter({ hasText: 'services' })).toBeVisible();
  await expect(sheet.getByLabel('Services')).toHaveAccessibleDescription(/services/);

  // The entry is padded clear of its unit, so a right-aligned amount never runs into it.
  const services = sheet.getByLabel('Services');
  const unitWidth = await adornments
    .filter({ hasText: 'services' })
    .evaluate((element) => element.getBoundingClientRect().width);
  const padding = await services.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).paddingRight),
  );
  expect(padding).toBeGreaterThan(unitWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'numeric-field-narrow');
});

test('[numeric-field-keyboard] never changes the amount by wheel or arrow key', async ({ page }) => {
  await openStory(page, 'molecules-forms-numeric-field--keyboard-flow');
  const region = page.locator('[data-evidence="numeric-field-keyboard"]');
  const input = region.getByLabel('Fee');

  // The story's play leaves a canonicalised amount behind.
  await expect(input).toHaveValue('82.30');

  await input.focus();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveValue('82.30');

  // A pointer passing over a fee must not be able to change it.
  await input.hover();
  await page.mouse.wheel(0, 120);
  await page.mouse.wheel(0, -240);
  await expect(input).toHaveValue('82.30');
  await expect(region.getByTestId('accepted')).toContainText('8230 cents');
});
