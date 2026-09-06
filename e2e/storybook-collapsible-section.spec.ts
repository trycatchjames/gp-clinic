import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-023/screenshots');

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

test('[collapsible-open] shows the summary body beside the indicators it never hides', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-collapsible-section--default');
  const section = page.locator('[data-evidence="collapsible-open"]');

  await expect(section.getByRole('button', { name: /Health summary/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(section.getByText('Metformin 1 g twice daily, perindopril 5 mg daily')).toBeVisible();
  await expect(section.getByText('Anaphylaxis: amoxicillin')).toBeVisible();
  await capture(page, 'collapsible-open');
});

test('[collapsible-closed] keeps the safety indicators and the size on screen while closed', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-collapsible-section--closed');
  const section = page.locator('[data-evidence="collapsible-closed"]');

  await expect(section.getByText('Anaphylaxis: amoxicillin')).toBeVisible();
  await expect(section.getByText('Interpreter required — Dari')).toBeVisible();
  await expect(section.getByText('9 items')).toBeVisible();

  // Closed means gone, not merely invisible: a control a sighted operator cannot see must not
  // still be reachable by keyboard.
  await expect(section.getByText('Current medicines')).toHaveCount(0);
  await capture(page, 'collapsible-closed');
});

test('[collapsible-narrow] wraps a long indicator in full at 360 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-context-collapsible-section--narrow');

  // A shortened allergy is a prescribing risk, so the whole class stays readable.
  await expect(page.getByText(/every other beta-lactam/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'collapsible-narrow');
});

test('[collapsible-keyboard] toggles from the keyboard without moving focus off the control', async ({
  page,
}) => {
  await openStory(page, 'molecules-context-collapsible-section--keyboard-flow');

  const toggle = page.getByRole('button', { name: /Health summary/ });
  // The story's own play function toggles twice and ends open; wait for that before taking over.
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  // Losing focus here would drop a keyboard operator back to the top of the record.
  await expect(toggle).toBeFocused();
  await expect(toggle).not.toHaveAttribute('aria-controls');
  await expect(page.getByText('Anaphylaxis: amoxicillin')).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toBeFocused();
});
