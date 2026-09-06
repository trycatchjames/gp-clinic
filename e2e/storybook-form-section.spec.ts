import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-022/screenshots');

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

test('[form-section-states] tells an ordinary, an optional and a failing section apart', async ({
  page,
}) => {
  await openStory(page, 'molecules-forms-form-section--all-states');
  const states = page.locator('[data-evidence="form-section-states"]');

  await expect(states.getByRole('region')).toHaveCount(3);
  // Exact: the optional section's description also contains the word.
  await expect(states.getByText('Optional', { exact: true })).toBeVisible();
  await expect(states.getByText('1 problem to correct')).toBeVisible();

  // Every section is a labelled group, so a screen-reader user can navigate the form by region.
  const named = await states.evaluate((element) =>
    [...element.querySelectorAll('section')].every((section) =>
      Boolean(section.getAttribute('aria-labelledby')),
    ),
  );
  expect(named).toBe(true);
  await capture(page, 'form-section-states');
});

test('[form-section-narrow] wraps a long title, description and marker at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-forms-form-section--narrow');

  await expect(page.getByText('Optional')).toBeVisible();
  await expect(page.getByText('3 problems to correct')).toBeVisible();
  await expect(page.getByText(/cannot be told apart from one nobody has reached yet/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'form-section-narrow');
});
