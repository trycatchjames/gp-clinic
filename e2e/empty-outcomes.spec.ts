import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-032/screenshots');

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

/** Full-page, so the reviewer sees the outcome against the screen that produced it. */
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

/**
 * Both screens rendered two icons for one outcome: the mark State Panel chooses for the state, and
 * a second decorative one the retired wrapper forwarded. The count is the assertion — a panel that
 * still carried its own icon would pass a "shows an empty state" check unchanged.
 */
async function expectOneEmptyMark(page: Page, title: string) {
  const panel = page.getByRole('region', { name: title });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-state', 'empty');
  await expect(panel.locator('svg')).toHaveCount(1);
  await expect(panel.locator('svg.lucide-circle-dashed')).toBeVisible();
}

test('[empty-outcome-search] a search that matches nothing explains itself once', async ({
  page,
}) => {
  await signIn(page, /Jess Turner/);
  await page.getByRole('link', { name: 'Find a patient' }).click();
  await expect(page.getByRole('heading', { name: 'Find a patient' })).toBeVisible();

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });
  await query.fill('Wongaburra');

  await expectOneEmptyMark(page, 'No matches');
  await expect(
    page.getByText('Try another name, date of birth, address or phone before registering.'),
  ).toBeVisible();

  // Compact keeps the panel quieter than the records it sits beside; it must not become a
  // full-height interruption on a mid-task screen.
  const panel = page.getByRole('region', { name: 'No matches' });
  expect((await panel.boundingBox())!.height).toBeLessThan(200);

  // Nothing empty may be mistaken for a failure, and the search box keeps what was typed.
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(query).toHaveValue('Wongaburra');
  await captureEvidence(page, 'empty-outcome-search');

  // The empty outcome is a state of the same list, not a dead end: typing again brings records back.
  await query.fill('Ngo');
  await expect(page.getByRole('button', { name: /Isla Ngo/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'No matches' })).toBeHidden();
});

test('[empty-outcome-locations] a practice with no sites reads the same way', async ({ page }) => {
  // The seeded practice has two locations, so the changed state is unreachable from seed data
  // alone. The list is emptied at the transport, which leaves the screen — and the component under
  // review — exactly as shipped. Synthetic and empty: no patient or practice data is introduced.
  await page.route('**/api/practices/*/locations', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await signIn(page, /Michelle Barnes/);
  await page.getByRole('link', { name: 'Locations', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Locations', level: 1 })).toBeVisible();

  await expectOneEmptyMark(page, 'No locations yet');
  await expect(page.getByText('Add your first site in the setup wizard.')).toBeVisible();
  await captureEvidence(page, 'empty-outcome-locations');
});
