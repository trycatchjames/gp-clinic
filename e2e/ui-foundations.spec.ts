import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/UI-001/screenshots');

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

test.use({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'light',
  reducedMotion: 'reduce',
  serviceWorkers: 'block',
});

test('[keyboard-foundations] demonstrates the theme and operates foundations by keyboard', async ({
  page,
}) => {
  await page.goto('/foundations?fixture=design-system-states');
  await expect(page.getByRole('heading', { name: 'Quiet confidence for busy care.' })).toBeVisible();
  await expect(page.getByText(/Synthetic fixture · design-system-states/)).toBeVisible();

  await page.locator('[data-evidence="theme-foundations"]').screenshot({
    path: path.join(evidenceDirectory, 'theme-foundations.png'),
    animations: 'disabled',
  });

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to component gallery' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#foundation-controls')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused();

  const interactivePrimitives = page.locator('[data-evidence="interactive-primitives"]');
  await interactivePrimitives.scrollIntoViewIfNeeded();
  await interactivePrimitives.screenshot({
    path: path.join(evidenceDirectory, 'interactive-primitives.png'),
    animations: 'disabled',
  });

  const todayTab = page.getByRole('tab', { name: 'Today' });
  await todayTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'This week' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByText(/Weekly density is supplied/)).toBeVisible();

  const progressHelp = page.getByRole('button', { name: 'About setup progress' });
  await progressHelp.focus();
  await expect(page.getByRole('tooltip')).toHaveText(/calculated by capability code/);
  await page.keyboard.press('Escape');

  const menuTrigger = page.getByRole('button', { name: 'More actions' });
  await menuTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'View details' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menuTrigger).toBeFocused();

  const dialogTrigger = page.getByRole('button', { name: 'Review removal' });
  await dialogTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Remove this synthetic draft?' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialogTrigger).toBeFocused();

  const patterns = page.locator('[data-evidence="workflow-patterns"]');
  await patterns.scrollIntoViewIfNeeded();
  await expect(page.getByRole('region', { name: 'Amelia Hart' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Loading appointments' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await expect(page.getByRole('alert', { name: 'Changes were not saved' })).toHaveAttribute(
    'data-state',
    'failure',
  );
  await patterns.screenshot({
    path: path.join(evidenceDirectory, 'workflow-patterns.png'),
    animations: 'disabled',
  });

  const workspaceLabel = page.getByRole('textbox', { name: /Workspace label/ });
  await workspaceLabel.focus();
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

  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
});

test('[responsive-patterns] preserves context and actions at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/foundations?fixture=design-system-states');

  const patterns = page.locator('[data-evidence="responsive-patterns"]');
  await patterns.scrollIntoViewIfNeeded();
  await expect(page.getByRole('region', { name: 'Amelia Hart' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open record' })).toBeVisible();
  await expect(page.getByText('DEMO-1048')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await patterns.screenshot({
    path: path.join(evidenceDirectory, 'responsive-patterns.png'),
    animations: 'disabled',
  });
});
