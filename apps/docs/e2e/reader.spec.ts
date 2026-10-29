import { test, expect } from '@playwright/test';

test('read core domains, follow Markdown links and share a document', async ({ page }, testInfo) => {
  await page.goto('/');
  const article = page.locator('article');
  await expect(article.getByRole('heading', { level: 2 })).toHaveText([
    'Appointment book', 'Contact', 'Clinical', 'Back office', 'Organisation and access', 'Reporting',
  ]);
  await page.screenshot({ path: testInfo.outputPath('core-domains-desktop.png'), fullPage: true });
  await page.getByRole('complementary', { name: 'On this page' }).getByRole('link', { name: 'Clinical', exact: true }).click();
  await expect(page).toHaveURL(/#clinical$/);
  await expect(article.getByRole('heading', { name: 'Clinical', exact: true })).toBeInViewport();
  await article.getByRole('link', { name: 'Calendar', exact: true }).click();
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('Calendar');
  await expect(page).toHaveURL(/doc=spec%2Fcapabilities%2Fcalendar%2Fspec.md/);
  await page.getByRole('link', { name: 'Acceptance examples', exact: true }).last().click();
  await expect(article.locator('pre')).toContainText('Feature:');
  await page.goBack();
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('Calendar');
  await page.reload();
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('Calendar');
  await page.screenshot({ path: testInfo.outputPath('calendar-desktop.png'), fullPage: true });
  await article.getByRole('link', { name: /appointment/i }).first().click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(article.getByRole('heading', { level: 1 })).toBeVisible();
});

test('search content, recover from empty results and handle missing documents', async ({ page }) => {
  await page.goto('/');
  const search = page.getByLabel('Search documentation');
  await search.fill('supersession');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  await expect(page.getByRole('status')).not.toContainText('0 documents');
  await page.getByRole('main').getByRole('link', { name: /Prescription/i }).first().click();
  await expect(page.locator('article')).toContainText(/supersession/i);
  await search.fill('zz-no-matching-document-zz');
  await expect(page.getByRole('status')).toContainText('0 documents');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(search).toHaveValue('');
  await page.goto('/?doc=missing.md');
  await expect(page.getByRole('alert')).toContainText('Document not found');
  await page.getByRole('link', { name: 'Browse core domains' }).click();
  await expect(page.locator('article h1')).toHaveText('Core domains');
  await page.goto('/?doc=SPEC.md');
  await page.locator('article').getByRole('link', { name: 'spec/product', exact: true }).click();
  await expect(page.locator('article h1')).toHaveText('Product foundations');
});

test('mobile reading keeps navigation, search and wide tables usable', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Documentation', exact: true }).getByRole('link', { name: 'Reporting', exact: true }).click();
  await expect(page.locator('article h1')).toHaveText('Reporting');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByLabel('Search documentation').fill('billing');
  await page.getByRole('button', { name: /Show \d+ results/ }).click();
  await page.getByRole('main').getByRole('link', { name: /^Billing and invoicing/ }).click();
  await expect(page.locator('article h1')).toHaveText('Billing and invoicing');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('billing-mobile.png'), fullPage: true });
  await page.goto('/?doc=spec%2Farchitecture%2Fdomain-boundaries.md');
  await expect(page.locator('article table')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('domain-table-mobile.png'), fullPage: true });
});

test('artifact server exposes only built assets', async ({ request }) => {
  await expect((await request.get('/')).status()).toBe(200);
  await expect((await request.get('/package.json')).status()).toBe(404);
  await expect((await request.get('/scripts/serve.mjs')).status()).toBe(404);
  await expect((await request.get('/%2e%2e%2fpackage.json')).status()).toBe(404);
  await expect((await request.post('/')).status()).toBe(405);
});
