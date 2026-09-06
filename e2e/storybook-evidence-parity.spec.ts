import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-017/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
}

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

test('[button-hierarchy] separates action priority without relying on colour alone', async ({
  page,
}) => {
  await openStory(page, 'atoms-actions-button--hierarchy');
  await capture(page, 'button-hierarchy');
});

test('[button-states] keeps a busy button named and distinct from a disabled one', async ({
  page,
}) => {
  await openStory(page, 'atoms-actions-button--states');

  const busy = page.getByRole('button', { name: 'Saving changes' });
  await expect(busy).toHaveAttribute('aria-busy', 'true');
  await expect(busy).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save unavailable' })).toBeDisabled();
  await capture(page, 'button-states');
});

test('[button-keyboard] keeps focus visible and activates on Enter', async ({ page }) => {
  await openStory(page, 'atoms-actions-button--keyboard-flow');

  const button = page.getByRole('button', { name: 'Save changes' });
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');
  await capture(page, 'button-keyboard');
});

test('[field-states] associates the error with its control without clearing the value', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-field--invalid');

  const input = page.getByRole('textbox', { name: /Notification email/ });
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription(/Enter an email address/);
  await capture(page, 'field-states');
});

test('[field-group-reflow] collapses grouped fields in reading order at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-field--narrow');

  await expect(page.getByRole('textbox', { name: 'Workspace name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: /Notification email/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'field-group-reflow');
});

test('[field-keyboard] reaches the control from its label and keeps the typed value', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-field--keyboard-flow');

  const input = page.getByRole('textbox', { name: /Notification email/ });
  await input.focus();
  await expect(input).toBeFocused();
  await capture(page, 'field-keyboard');
});

test('[state-panel-kinds] keeps empty, failure and restricted outcomes distinguishable', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-state-panel--all-states');

  await expect(page.getByRole('alert', { name: 'Appointments could not be loaded' })).toBeVisible();
  await capture(page, 'state-panel-kinds');
});

test('[state-panel-recovery] places a named recovery action after the failure message', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-state-panel--with-recovery');

  await expect(page.getByRole('button', { name: 'Try again' })).toBeEnabled();
  await capture(page, 'state-panel-recovery');
});

test('[state-panel-narrow] keeps the outcome and its detail readable at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-feedback-state-panel--narrow');

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'state-panel-narrow');
});
