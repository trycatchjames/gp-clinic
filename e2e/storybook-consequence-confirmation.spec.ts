import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-015/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
  // The dialog is portalled and re-mounts during its enter animation, so wait for the settled
  // overlay rather than the story root before asserting or capturing anything.
  await expect(page.getByRole('dialog')).toBeVisible();
}

// The dialog renders outside the story root through a portal, so a screenshot of the evidence
// element would miss it. The viewport is the honest frame for an overlay.
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

test('[confirmation-disclosures] states target, context, retained history and downstream effects', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-consequence-confirmation--default');
  const dialog = page.getByRole('dialog');

  for (const term of ['Action applies to', 'Context', 'Kept in the record', 'Also changes']) {
    await expect(dialog.getByText(term, { exact: true })).toBeVisible();
  }
  await expect(dialog.getByText('Safer alternative')).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Cancel appointment/ })).toBeEnabled();

  // Opening onto the consequential action would let a held Enter key commit before the consequence
  // has been read.
  await expect(dialog.getByRole('button', { name: /Cancel appointment/ })).not.toBeFocused();
  await captureViewport(page, 'confirmation-disclosures');
});

test('[confirmation-blocked] names the unmet precondition beside the blocked action', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-consequence-confirmation--blocked');
  const dialog = page.getByRole('dialog');

  await expect(
    dialog.getByText('To continue, enter a reason and tick the acknowledgement.'),
  ).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Merge records/ })).toBeDisabled();
  await captureViewport(page, 'confirmation-blocked');
});

test('[confirmation-failure] keeps the dialog and says what did not happen', async ({ page }) => {
  await openStory(page, 'molecules-feedback-consequence-confirmation--failed-submit');
  const dialog = page.getByRole('dialog');

  await expect(dialog.getByRole('alert')).toContainText('The appointment was not cancelled.');
  await expect(dialog.getByRole('button', { name: /Cancel appointment/ })).toBeEnabled();
  await captureViewport(page, 'confirmation-failure');
});

test('[confirmation-narrow] keeps the consequence and both actions visible at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-feedback-consequence-confirmation--narrow');
  const dialog = page.getByRole('dialog');

  await expect(dialog.getByRole('heading', { name: 'Cancel this appointment' })).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Cancel appointment/ })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Keep appointment' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await captureViewport(page, 'confirmation-narrow');
});

test('[confirmation-keyboard] reaches cancel before confirm and never confirms on dismissal', async ({
  page,
}) => {
  await openStory(page, 'molecules-feedback-consequence-confirmation--default');
  const dialog = page.getByRole('dialog');

  const cancel = dialog.getByRole('button', { name: 'Keep appointment' });
  const confirm = dialog.getByRole('button', { name: /Cancel appointment/ });

  await cancel.focus();
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(confirm).toBeFocused();

  // Escape must read as "I have not decided", never as agreement.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Cancel appointment' })).toBeVisible();
});
