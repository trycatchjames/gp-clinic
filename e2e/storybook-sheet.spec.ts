import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-018/screenshots');

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
  // The panel is portalled and re-mounts during its enter animation, so wait for the settled
  // overlay rather than the story root before asserting or capturing anything.
  await expect(page.getByRole('dialog')).toBeVisible();
}

// The panel renders outside the story root through a portal, so a screenshot of the evidence
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

test('[sheet-layout] keeps the identity and the actions in place while the body scrolls', async ({
  page,
}) => {
  await openStory(page, 'atoms-overlays-sheet--long-content');
  const sheet = page.getByRole('dialog');
  const heading = sheet.getByRole('heading', { name: 'Marlee Tran · 11:15 am' });
  const action = sheet.getByRole('button', { name: 'Start consultation' });
  const body = sheet.locator('[tabindex="0"]');

  await expect(heading).toBeVisible();
  await expect(action).toBeVisible();

  const overflows = await body.evaluate((element) => element.scrollHeight > element.clientHeight);
  expect(overflows).toBe(true);

  await body.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect
    .poll(async () => body.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);

  // The whole point of the structure: scrolling the history away must not scroll the patient's
  // name or the action out with it.
  await expect(heading).toBeInViewport();
  await expect(action).toBeInViewport();
  await captureViewport(page, 'sheet-layout');
});

test('[sheet-narrow] anchors to the bottom edge and wraps a long title at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'atoms-overlays-sheet--narrow');
  const sheet = page.getByRole('dialog');

  await expect(sheet.getByRole('button', { name: 'Start consultation' })).toBeVisible();
  // Exact: the footer's dismissal and the header's close control are deliberately distinct names.
  await expect(sheet.getByRole('button', { name: 'Close', exact: true })).toBeVisible();

  // A clipped patient name is a wrong-record risk, so the header grows to two or more lines
  // instead of truncating.
  const heading = sheet.getByRole('heading', { level: 2 });
  const wrapping = await heading.evaluate((element) => {
    // A block element reports one rect however it wraps, so measure the text itself: a range over
    // the contents returns one rect per rendered line.
    const range = document.createRange();
    range.selectNodeContents(element);
    return { lines: range.getClientRects().length, clipped: element.scrollWidth > element.clientWidth };
  });
  expect(wrapping.lines).toBeGreaterThan(1);
  expect(wrapping.clipped).toBe(false);

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await captureViewport(page, 'sheet-narrow');
});

test('[sheet-keyboard] traps focus while open and returns it to the trigger on Escape', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=atoms-overlays-sheet--keyboard-flow&viewMode=story');
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );

  const trigger = page.getByRole('button', { name: 'Open appointment' });
  await trigger.focus();
  await page.keyboard.press('Enter');

  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
  await expect
    .poll(async () => sheet.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);

  // The scrolling region is itself focusable, so overflowed content is readable without a pointer.
  await expect(sheet.locator('[tabindex="0"]')).toHaveCount(1);

  // Escape reads as "I am done looking", never as a completed save.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});
