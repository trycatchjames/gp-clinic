import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(
  process.cwd(),
  'delivery/evidence/PATSEARCH-001/screenshots',
);

test.beforeAll(async () => {
  await mkdir(evidenceDirectory, { recursive: true });
});

/**
 * Captures a named slice screenshot of the whole page.
 *
 * Element-clipped shots hid the surrounding context a reviewer needs — which
 * account is signed in, which screen they are on, and what was typed to produce
 * the results — so every evidence shot is full page.
 */
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

/** Signs in as the seeded receptionist and lands on the patient search screen. */
async function signInAsReceptionistAndOpenSearch(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Jess Turner/ }).click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Find a patient' }).click();
  await expect(page.getByRole('heading', { name: 'Find a patient' })).toBeVisible();
}

test('[multi-identifier-search] finds family members by Medicare card without verifying identity', async ({
  page,
}) => {
  await signInAsReceptionistAndOpenSearch(page);

  await expect(page.getByText('Search by name, date of birth, address, phone or record number.')).toBeVisible();
  await captureEvidence(page, 'initial-search');

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });

  // A record number finds exactly the one patient it belongs to.
  await query.fill('R000004');
  await expect(page.getByRole('button', { name: /Isla Ngo/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mia Ngo/ })).not.toBeVisible();
  await captureEvidence(page, 'record-number-match');

  // A phone number is another approved identifier, and also finds one patient.
  await query.fill('0412 555 005');
  await expect(page.getByRole('button', { name: /Mia Ngo/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Isla Ngo/ })).not.toBeVisible();

  // Locality is often the quickest practical discriminator at reception.
  await query.fill('3056');
  await expect(page.getByRole('button', { name: /Margaret Anne Doyle/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Isla Ngo/ })).not.toBeVisible();

  // The family's shared Medicare card number finds both — separately.
  await query.fill('3261125853');
  const islaResult = page.getByRole('button', { name: /Isla Ngo/ });
  const miaResult = page.getByRole('button', { name: /Mia Ngo/ });
  await expect(islaResult).toBeVisible();
  await expect(miaResult).toBeVisible();

  // Each carries its own IRN, and neither claims identity verification.
  await expect(islaResult).toContainText('IRN 1');
  await expect(miaResult).toContainText('IRN 2');
  await expect(islaResult).toContainText('not verified');
  await expect(miaResult).toContainText('not verified');
  await expect(page.getByText('Verified', { exact: true })).toHaveCount(0);
  await captureEvidence(page, 'medicare-family-match');

  // Neither was opened automatically — a deliberate choice is still required.
  await expect(page.getByText('Selected:', { exact: true })).not.toBeVisible();
});

test('[keyboard-selection] similar names stay distinct and require a deliberate keyboard choice', async ({
  page,
}) => {
  await signInAsReceptionistAndOpenSearch(page);

  const query = page.getByRole('textbox', { name: /Name, address, postcode/ });
  const dob = page.getByLabel('Date of birth');
  await query.fill('Ngo');
  await dob.fill('2015-04-02');

  const islaResult = page.getByRole('button', { name: /Isla Ngo/ });
  const miaResult = page.getByRole('button', { name: /Mia Ngo/ });
  await expect(islaResult).toBeVisible();
  await expect(miaResult).toBeVisible();
  await expect(islaResult).toContainText('Similar details');
  await expect(miaResult).toContainText('Similar details');
  await captureEvidence(page, 'similar-candidates');

  // Reaching the list is a normal Tab stop; focusing it never opens a candidate.
  await islaResult.focus();
  await expect(islaResult).toBeFocused();
  await expect(page.getByText('Selected:', { exact: true })).not.toBeVisible();

  // Tab moves to the next candidate too.
  await page.keyboard.press('Tab');
  await expect(miaResult).toBeFocused();

  // Arrow keys also move focus between candidates; still nothing is opened.
  await page.keyboard.press('ArrowUp');
  await expect(islaResult).toBeFocused();
  await expect(page.getByText('Selected:', { exact: true })).not.toBeVisible();

  // Enter opens only the deliberately focused candidate.
  await page.keyboard.press('Enter');
  const selected = page.getByRole('status').filter({ hasText: 'Selected:' });
  await expect(selected).toBeVisible();
  await expect(selected).toContainText('Isla Ngo');
  await expect(selected).not.toContainText('Mia Ngo');
  await captureEvidence(page, 'selected-patient');
});
