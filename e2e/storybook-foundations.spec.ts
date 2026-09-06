import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-002/screenshots');

const storyUrl = (id: string) => `/iframe.html?id=${id}&viewMode=story`;

async function openStory(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
}

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test.use({ viewport: { width: 1280, height: 800 } });

// DS-002 proved the harness itself: the palette, the traced metadata and a reviewable static build.
// The per-contract screenshots it once bundled into this file are now captured under their
// catalogue names by storybook-evidence-parity.spec.ts, so each contract owns the evidence its own
// entry declares instead of sharing a foundation-wide capture.
test('[storybook-foundation-keyboard] reviews the theme and reaches a traced contract by keyboard', async ({
  page,
}) => {
  await openStory(page, 'foundations-theme--compact-clinical');
  await expect(page.getByRole('heading', { name: 'Compact Clinical' })).toBeVisible();
  await page.locator('[data-evidence="storybook-theme-foundations"]').screenshot({
    path: path.join(evidenceDirectory, 'storybook-theme-foundations.png'),
    animations: 'disabled',
  });

  await openStory(page, 'atoms-actions-button--keyboard-flow');
  const button = page.getByRole('button', { name: 'Save changes' });
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');
  await page.keyboard.press('Enter');
});

test('[storybook-narrow-reflow] keeps the foundations page usable without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'foundations-theme--compact-clinical');

  await expect(page.getByRole('heading', { name: 'Compact Clinical' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await page.locator('#storybook-root').screenshot({
    path: path.join(evidenceDirectory, 'storybook-narrow-reflow.png'),
    animations: 'disabled',
  });
});
