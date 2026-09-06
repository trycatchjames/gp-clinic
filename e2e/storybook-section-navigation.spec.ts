import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-031/screenshots');

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

test('[section-nav-states] marks the current section as a location and counts the rest', async ({
  page,
}) => {
  await openStory(page, 'molecules-navigation-section-navigation--attention');
  const nav = page.locator('[data-evidence="section-nav-states"]');

  await expect(nav.getByRole('link', { name: 'Timeline' })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('tab')).toHaveCount(0);

  // A zero count is shown rather than omitted, and attention is in the name as well as the tint.
  await expect(nav.getByRole('link', { name: 'Observations, 0 items' })).toBeVisible();
  await expect(
    nav.getByRole('link', { name: 'Recalls and tasks, 2 items, needs attention' }),
  ).toBeVisible();
  await capture(page, 'section-nav-states');
});

test('[section-nav-narrow] scrolls without clipping and keeps the current section on screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-navigation-section-navigation--narrow');
  const nav = page.locator('[data-evidence="section-nav-narrow"]');
  const current = nav.getByRole('link', { name: /Recalls and tasks/ });

  // The list is wider than the screen and scrolls inside its own container.
  const scrolls = await nav
    .getByRole('navigation')
    .evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(scrolls).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  // The current section is brought into view, so the operator's location is never off screen.
  await expect(current).toBeInViewport();
  await capture(page, 'section-nav-narrow');
});

test('[section-nav-keyboard] reaches each section by Tab and never by arrow key', async ({
  page,
}) => {
  await openStory(page, 'molecules-navigation-section-navigation--keyboard-flow');
  const nav = page.locator('[data-evidence="section-nav-keyboard"]');
  const overview = nav.getByRole('link', { name: 'Overview' });
  const timeline = nav.getByRole('link', { name: 'Timeline' });

  // The story's play followed Overview from the keyboard and left it current.
  await expect(overview).toHaveAttribute('aria-current', 'page');

  await timeline.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  // Arrow keys do nothing here: these are links, not a composite widget with a roving tab stop.
  await expect(timeline).toBeFocused();
  await expect(overview).toHaveAttribute('aria-current', 'page');

  await page.keyboard.press('Tab');
  await expect(nav.getByRole('link', { name: /Problems/ })).toBeFocused();

  // Reaching a section does not follow it.
  await expect(overview).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByTestId('current')).toContainText('Showing: Overview');
});
