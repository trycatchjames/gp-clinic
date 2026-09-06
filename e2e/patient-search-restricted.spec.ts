import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(
  process.cwd(),
  'delivery/evidence/PATSEARCH-002/screenshots',
);

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

/** Full page, so the reviewer sees who is signed in and what was typed. */
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

async function signInAsReceptionistAndOpenSearch(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Jess Turner/ }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Find a patient' }).click();
  await expect(page.getByRole('heading', { name: 'Find a patient' })).toBeVisible();
}

test('[restricted-stub] a restricted record prevents a duplicate without disclosing its contents', async ({
  page,
}) => {
  await signInAsReceptionistAndOpenSearch(page);

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });
  await query.fill('Fenech');

  // The family has three records: one active but restricted, one inactive and
  // one deceased. Two are ordinary candidates; the restricted one is not.
  const list = page.getByRole('list', { name: 'Matching patients' });
  await expect(list.getByRole('button', { name: /Bernadette Fenech/ })).toBeVisible();
  await expect(list.getByRole('button', { name: /Stanley Fenech/ })).toBeVisible();
  await expect(page.getByText('Inactive', { exact: true })).toBeVisible();
  await expect(page.getByText('Deceased', { exact: true })).toBeVisible();

  const panel = page.getByRole('region', { name: 'One matching record is restricted' });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-state', 'restricted');

  // The stub carries the identity that stops a duplicate being created.
  await expect(panel).toContainText('Rosalind Fenech');
  await expect(panel).toContainText('Record R000008');
  await expect(panel).toContainText('matched on name');

  // And nothing beyond it. These are the exact values the API withholds; if the
  // stub ever leaked them, they would appear here.
  await expect(panel).not.toContainText('Pascoe Vale');
  await expect(panel).not.toContainText('3044');
  await expect(panel).not.toContainText('555 008');
  await expect(panel).not.toContainText('Sussex');

  // The restricted record is not offered as a candidate, so it cannot be bound
  // into a booking or an arrival by a keyboard operator working down the list.
  await expect(list.getByRole('button', { name: /Rosalind Fenech/ })).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: 'Selected:' })).toHaveCount(0);

  // An authorised path is offered, and it names what to quote.
  await expect(panel).toContainText('ask a treating practitioner');
  await expect(panel).toContainText('quoting the record number');

  await captureEvidence(page, 'restricted-stub');
});

test('[restricted-stub] the same record reads in full for a holder of sensitive-record access', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Dr Anita Raman/ }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Find a patient' }).click();

  await page.getByRole('textbox', { name: /Name, address, postcode/ }).fill('Fenech');

  const list = page.getByRole('list', { name: 'Matching patients' });
  const row = list.getByRole('button', { name: /Rosalind Fenech/ });
  await expect(row).toBeVisible();
  await expect(row).toContainText('Pascoe Vale 3044');
  await expect(page.getByRole('region', { name: /restricted/ })).toHaveCount(0);
});

test('[search-failure] a failed search never reads as proof that no patient exists', async ({
  page,
}) => {
  await signInAsReceptionistAndOpenSearch(page);

  // A total search failure is not reachable from seeded data, so the dependency
  // is failed at the transport. Nothing about the screen under review changes.
  await page.route('**/api/practices/*/patients/search*', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/problem+json',
      body: JSON.stringify({
        type: 'about:blank',
        title: 'Service Unavailable',
        status: 503,
        detail: 'Patient search is temporarily unavailable.',
      }),
    });
  });

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });
  await query.fill('Fenech');

  // A failure panel carries alert semantics rather than region semantics, so it
  // is announced when it replaces the results the operator was waiting for.
  const panel = page.getByRole('alert').filter({ hasText: 'Search failed' });
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute('data-state', 'failure');
  await expect(panel).toHaveAccessibleName('Search failed');

  // The three things the scenario turns on.
  await expect(panel).toContainText('Patient search is temporarily unavailable.');
  await expect(panel).toContainText('a matching patient may still exist');
  await expect(panel).toContainText('Do not register a new patient until search is working');

  // A failure must never be dressed as an empty result: the empty panel and its
  // "before registering" guidance are the sentence that would license a
  // duplicate, and neither may appear here.
  await expect(page.getByRole('region', { name: 'No matches' })).toHaveCount(0);
  await expect(page.getByText(/before registering/)).toHaveCount(0);
  await expect(page.getByRole('list', { name: 'Matching patients' })).toHaveCount(0);

  // Recovery is offered, and it is a retry rather than a way past the failure.
  await expect(panel.getByRole('button', { name: 'Try the search again' })).toBeVisible();

  await captureEvidence(page, 'search-failure');
});
