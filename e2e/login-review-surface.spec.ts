import { expect, test } from '@playwright/test';

test('the sign-in surface supports a clear keyboard path', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'GP Practice Management' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await page.getByLabel('Email').focus();
  await page.keyboard.type('jess.turner@example.com');
  await page.keyboard.press('Tab');
  await page.keyboard.type('BrunswickDemo2026');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeFocused();
  await page.screenshot({ path: 'test-results/playwright/login-review-surface.png', fullPage: true });
});
