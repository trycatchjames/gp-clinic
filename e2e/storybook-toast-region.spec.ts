import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-019/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
}

// The stack is fixed to the viewport rather than laid out inside the story root, so the viewport
// is the honest frame for it.
async function captureViewport(page: Page, evidenceId: string) {
  await page.screenshot({
    path: path.join(evidenceDirectory, `${evidenceId}.png`),
    animations: 'disabled',
  });
}

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test.use({ viewport: { width: 1280, height: 800 } });

test('[toast-tones] tells success, status and failure apart without relying on colour', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-toast-region--tones');
  const region = page.getByRole('region', { name: 'Notifications' });

  await expect(region.getByRole('listitem')).toHaveCount(3);
  for (const word of ['Completed.', 'Update.', 'Failed.']) {
    await expect(region.getByText(word, { exact: true })).toBeAttached();
  }
  await captureViewport(page, 'toast-tones');
});

test('[toast-failure] says what did not happen and offers the safe next step', async ({ page }) => {
  await openStory(page, 'molecules-feedback-toast-region--failure-with-recovery');
  const region = page.getByRole('region', { name: 'Notifications' });

  await expect(region.getByText(/nothing has been sent/i)).toBeVisible();
  await expect(region.getByRole('button', { name: 'Retry sending' })).toBeEnabled();

  // A failure is the only tone that interrupts, because the operator's next action depends on it.
  const assertive = page.locator('[aria-live="assertive"]');
  await expect(assertive).toContainText('Referral letter was not sent');
  await captureViewport(page, 'toast-failure');
});

test('[toast-content-stress] wraps a long partial-failure message in full', async ({ page }) => {
  await openStory(page, 'molecules-feedback-toast-region--content-stress');
  const region = page.getByRole('region', { name: 'Notifications' });

  // A truncated clause here could turn a partial result into an apparent success.
  await expect(region.getByText(/still shows the full balance/i)).toBeVisible();
  await captureViewport(page, 'toast-content-stress');
});

test('[toast-narrow] keeps both messages and their controls readable at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-feedback-toast-region--narrow');
  const region = page.getByRole('region', { name: 'Notifications' });

  await expect(region.getByRole('listitem')).toHaveCount(2);
  await expect(region.getByRole('button', { name: /Open the account/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await captureViewport(page, 'toast-narrow');
});

test('[toast-announcement] announces the outcome politely and leaves focus where it was', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-toast-region--announcement');

  // The regions have to be waiting before the message arrives; one inserted with its text is
  // unreliably announced.
  await expect(page.locator('[aria-live="polite"]')).toBeAttached();
  await expect(page.locator('[aria-live="assertive"]')).toBeAttached();

  const trigger = page.getByRole('button', { name: 'Move appointment' });
  await trigger.click();

  await expect(page.locator('[aria-live="polite"]')).toContainText('Appointment moved');
  await expect(page.locator('[aria-live="assertive"]')).not.toContainText('Appointment moved');
  await expect(trigger).toBeFocused();

  // The visible stack is a landmark, not a second live region, so the message is announced once.
  const region = page.getByRole('region', { name: 'Notifications' });
  await expect(region).not.toHaveAttribute('aria-live', /.*/);
});

test('[toast-keyboard] reaches the dismissal by keyboard and clears the announcement', async ({
  page,
}) => {
  // The Keyboard Flow story's own play function dismisses its message as part of the component
  // test, so this flow drives the untouched Default story instead.
  await openStory(page, 'molecules-feedback-toast-region--default');

  await page.keyboard.press('Tab');
  const dismiss = page.getByRole('button', { name: 'Dismiss: Appointment moved' });
  await expect(dismiss).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: 'Notifications' })).toHaveCount(0);
  await expect(page.locator('[aria-live="polite"]')).toBeEmpty();
});
