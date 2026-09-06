import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-021/screenshots');

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

test('[error-summary-list] lists every affected field beside its section and keeps the field error', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-form-error-summary--default');
  const summary = page.locator('[data-evidence="error-summary-list"]');

  await expect(summary.getByRole('listitem')).toHaveCount(4);
  await expect(summary.getByRole('link', { name: /^Identity: Family name/ })).toBeVisible();

  // The summary supplements the per-field error required by the Field contract; it never replaces
  // it, so the same message is still attached to the control.
  const field = page.getByRole('textbox', { name: 'Family name' });
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await capture(page, 'error-summary-list');
});

test('[error-summary-single] counts one problem in the singular', async ({ page }) => {
  await openStory(page, 'molecules-forms-form-error-summary--single-error');
  const summary = page.locator('[data-evidence="error-summary-single"]');

  await expect(
    summary.getByText('There is 1 problem to correct before this can be saved'),
  ).toBeVisible();
  await capture(page, 'error-summary-single');
});

test('[error-summary-narrow] wraps long section, label and message text at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-form-error-summary--narrow');

  // Scoped to the summary's own list: the same message is also attached to its field, which is
  // exactly the point — the summary supplements the per-field error rather than replacing it.
  const summary = page.locator('[data-evidence="error-summary-narrow"] ul');
  await expect(summary.getByText(/The rest of this registration has been kept/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'error-summary-narrow');
});

test('[error-summary-keyboard] takes focus on a failed submit and hands it to the named control', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-form-error-summary--keyboard-flow');

  const summary = page.getByRole('group', {
    name: 'There are 4 problems to correct before this can be saved',
  });
  // The story's own play function submits twice and moves focus as it goes. Wait for it to settle
  // before taking over, or the two drivers interleave and the flow is timing-dependent.
  await expect(summary).toBeFocused();

  // A further failing submit is reported again rather than silently ignored, and focus lands on
  // the summary, not the first field: the operator sees the whole list before being dropped into
  // one control.
  const submit = page.getByRole('button', { name: 'Save registration' });
  await submit.focus();
  await page.keyboard.press('Enter');
  await expect(summary).toBeFocused();

  await page.keyboard.press('Tab');
  const first = page.getByRole('link', { name: /^Identity: Family name/ });
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Family name' })).toBeFocused();
});
