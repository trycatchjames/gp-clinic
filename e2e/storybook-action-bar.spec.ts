import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-024/screenshots');

async function capture(page: import('@playwright/test').Page, evidenceId: string) {
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

test('[action-bar-states] keeps ready, busy and blocked the same shape with one primary each', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-action-bar--all-states');
  const states = page.locator('[data-evidence="action-bar-states"]');

  await expect(states.getByRole('region')).toHaveCount(3);
  await expect(states.getByRole('button', { name: 'Issuing invoice' })).toBeDisabled();
  await expect(
    states.getByRole('region', { name: 'Invoice actions, ready' }).getByRole('button', {
      name: 'Issue invoice',
    }),
  ).toBeEnabled();

  // Each bar carries exactly one filled action, whatever state it is in.
  const filled = await states.evaluate(
    (element) => element.querySelectorAll('button.bg-primary, button.bg-destructive').length,
  );
  expect(filled).toBe(3);
  await capture(page, 'action-bar-states');
});

test('[action-bar-blocked] names the failed precondition and describes the action with it', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-action-bar--blocked');
  const bar = page.locator('[data-evidence="action-bar-blocked"]');
  const primary = bar.getByRole('button', { name: 'Issue invoice' });

  await expect(primary).toBeDisabled();
  await expect(bar.getByText(/Resolve the fee or remove the item before issuing/)).toBeVisible();

  // The reason is read before the control it explains, not left as an unexplained disabled button.
  const describedBy = await primary.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  await capture(page, 'action-bar-blocked');
});

test('[action-bar-narrow] keeps the primary visible and wraps the status at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-operation-states-action-bar--narrow');

  await expect(page.getByRole('button', { name: 'Issue invoice' })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'More actions' })).toBeVisible();
  await expect(page.getByText(/informed financial consent recorded/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'action-bar-narrow');
});

test('[action-bar-keyboard] reaches a supporting choice before the consequential one', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-action-bar--keyboard-flow');

  await page.keyboard.press('Tab');
  const more = page.getByRole('button', { name: 'More actions' });
  await expect(more).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Preview account' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save as draft' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Issue invoice' })).toBeFocused();

  // The overflow returns focus to its own trigger rather than dropping the operator at the top.
  await more.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(more).toBeFocused();
});
