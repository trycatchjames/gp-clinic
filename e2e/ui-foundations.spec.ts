import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDirectory = path.join(
  process.cwd(),
  'delivery/evidence/UI-001/screenshots',
);

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test.use({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
});

test('[keyboard-foundations] exposes and operates the foundation controls by keyboard', async ({
  page,
}) => {
  await page.goto('/foundations?fixture=design-system-states');
  await expect(page.getByRole('heading', { name: 'Accessible control gallery' })).toBeVisible();
  await expect(page.getByText('Synthetic fixture · design-system-states')).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to form states' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused();
  await page.locator('[data-evidence="foundation-controls"]').screenshot({
    path: path.join(evidenceDirectory, 'foundation-controls.png'),
    animations: 'disabled',
  });

  await page.reload();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#form-states')).toBeFocused();

  await page.keyboard.press('Tab');
  const workspaceLabel = page.getByRole('textbox', { name: /Workspace label/ });
  await expect(workspaceLabel).toBeFocused();
  await workspaceLabel.fill('Reception workspace');

  await page.keyboard.press('Tab');
  const invalidEmail = page.getByRole('textbox', { name: 'Notification email' });
  await expect(invalidEmail).toBeFocused();
  await expect(invalidEmail).toHaveAttribute('aria-invalid', 'true');
  await expect(invalidEmail).toHaveAttribute('aria-errormessage', 'notification-email-error');
  await expect(invalidEmail).toHaveAccessibleDescription(
    /Receives non-clinical workspace notices.*Enter an email address/,
  );
  const focusShadow = await invalidEmail.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(focusShadow).not.toBe('none');
  await page.locator('[data-evidence="form-states"]').screenshot({
    path: path.join(evidenceDirectory, 'form-states.png'),
    animations: 'disabled',
  });

  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Handover note' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('combobox', { name: 'Default view' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('option', { name: 'Today' })).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'This week' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('combobox', { name: 'Default view' })).toHaveText(/This week/);

  await page.keyboard.press('Tab');
  const keyboardHints = page.getByRole('checkbox', { name: 'Show keyboard hints' });
  await expect(keyboardHints).toBeFocused();
  await page.keyboard.press('Space');
  await expect(keyboardHints).not.toBeChecked();

  await page.keyboard.press('Tab');
  const comfortableDensity = page.getByRole('radio', { name: 'Comfortable' });
  await expect(comfortableDensity).toBeFocused();
  await page.keyboard.press('ArrowDown');
  const compactDensity = page.getByRole('radio', { name: 'Compact' });
  await expect(compactDensity).toBeFocused();
  await page.keyboard.press('Space');
  await expect(compactDensity).toBeChecked();

  await page.keyboard.press('Tab');
  const announcements = page.getByRole('switch', { name: 'Announce changes' });
  await expect(announcements).toBeFocused();
  await page.keyboard.press('Space');
  await expect(announcements).not.toBeChecked();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save preferences' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Preferences saved for this synthetic fixture.')).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
