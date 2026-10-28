import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/UI-002/screenshots');

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

async function captureEvidence(page: Page, id: string) {
  await page.screenshot({
    path: path.join(evidenceDirectory, `${id}.png`),
    fullPage: true,
    animations: 'disabled',
  });
}

test.use({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
});

async function signIn(page: Page, name: RegExp) {
  await page.goto('/login');
  await page.getByRole('button', { name }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('[dashboard] the dashboard renders in the theme', async ({ page }) => {
  await signIn(page, /Dr Anita Raman/);
  await expect(page.getByRole('heading', { name: /Good (morning|afternoon|evening), Anita/ })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 249, 250)');
  await captureEvidence(page, 'dashboard');
});

test('[patient-search-keyboard] arrow keys reach a patient without choosing them', async ({
  page,
}) => {
  await signIn(page, /Jess Turner/);
  await page.getByRole('link', { name: 'Find a patient' }).click();

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });
  await query.fill('Ngo');

  const list = page.getByRole('list', { name: 'Matching patients' });
  const rows = list.getByRole('button');
  await expect(rows.first()).toBeVisible();
  await captureEvidence(page, 'patient-search-results');

  // Reaching a record never chooses it.
  await rows.first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('status').filter({ hasText: 'Selected:' })).toHaveCount(0);

  // Only explicit activation does.
  await page.keyboard.press('Enter');
  await expect(rows.nth(1)).toHaveAttribute('aria-pressed', 'true');
  const selected = page.getByRole('status').filter({ hasText: 'Selected:' });
  await expect(selected).toBeVisible();

  // Clearing returns focus to the query, ready for the next search.
  await selected.getByRole('button', { name: 'Clear' }).click();
  await expect(query).toBeFocused();
});
