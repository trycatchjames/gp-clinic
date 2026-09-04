import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-002/screenshots');

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function openStory(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

async function captureEvidence(page: Page, evidenceId: string) {
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

test('[storybook-foundation-keyboard] reviews theme and representative contracts', async ({
  page,
}) => {
  await openStory(page, 'foundations-theme--compact-clinical');
  await expect(page.getByRole('heading', { name: 'Compact Clinical' })).toBeVisible();
  await captureEvidence(page, 'storybook-theme-foundations');

  await openStory(page, 'atoms-actions-button--hierarchy');
  await captureEvidence(page, 'storybook-button-states');

  await openStory(page, 'atoms-actions-button--keyboard-flow');
  const button = page.getByRole('button', { name: 'Save changes' });
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');
  await page.keyboard.press('Enter');

  await openStory(page, 'molecules-forms-field--invalid');
  const invalidInput = page.getByRole('textbox', { name: /Notification email/ });
  await expect(invalidInput).toHaveAttribute('aria-invalid', 'true');
  await expect(invalidInput).toHaveAccessibleDescription(/Enter an email address/);
  await captureEvidence(page, 'storybook-field-states');

  await openStory(page, 'molecules-feedback-state-panel--all-states');
  await expect(page.getByRole('alert', { name: 'Appointments could not be loaded' })).toBeVisible();
  await captureEvidence(page, 'storybook-state-panel-states');
});

test('[storybook-narrow-reflow] keeps grouped fields usable without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'foundations-theme--compact-clinical');
  await expect(page.getByRole('heading', { name: 'Compact Clinical' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await openStory(page, 'molecules-forms-field--grouped');

  await expect(page.getByRole('textbox', { name: 'Workspace name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Notification email' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await page.locator('#storybook-root').screenshot({
    path: path.join(evidenceDirectory, 'storybook-narrow-reflow.png'),
    animations: 'disabled',
  });
});
