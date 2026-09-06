import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-020/screenshots');

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

test('[save-state-kinds] keeps all six states distinct and reserves "saved" for a durable commit', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-save-state--all-states');
  const states = page.locator('[data-evidence="save-state-kinds"]');

  for (const text of [
    'Unsaved changes',
    'Saving',
    'not on the record',
    'Not saved.',
    'Changed elsewhere.',
  ]) {
    await expect(states.getByText(text, { exact: false }).first()).toBeVisible();
  }

  // Exactly one state may begin with the word "saved", and it is the durable one.
  const durable = await states.evaluate((element) =>
    // Leaf spans only: a wrapper repeats its child's text and would double the count.
    [...element.querySelectorAll('span:not(.sr-only)')].filter(
      (span) => span.children.length === 0 && /^Saved\b/.test(span.textContent ?? ''),
    ).length,
  );
  expect(durable).toBe(1);
  await capture(page, 'save-state-kinds');
});

test('[save-state-local] says locally held work is not on the record', async ({ page }) => {
  await openStory(page, 'molecules-operation-states-save-state--held-locally');
  const state = page.locator('[data-evidence="save-state-local"]');

  await expect(state.getByText(/not on the record/)).toBeVisible();
  await expect(state.getByText(/^Saved/)).toHaveCount(0);
  await capture(page, 'save-state-local');
});

test('[save-state-failure] says what happened and never implies the text was lost', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-save-state--save-failure');
  const state = page.locator('[data-evidence="save-state-failure"]');

  // Start-anchored: the announced form of the same state is a separate, fuller line.
  await expect(state.getByText(/^Not saved\. The connection dropped/)).toBeVisible();
  await expect(state.getByRole('button', { name: 'Save again' })).toBeEnabled();
  await capture(page, 'save-state-failure');
});

test('[save-state-narrow] wraps the state and its recovery action at 360 pixels', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openStory(page, 'molecules-operation-states-save-state--narrow');

  await expect(page.getByRole('button', { name: 'Save again' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );
  await capture(page, 'save-state-narrow');
});

test('[save-state-editor] moves back to unsaved on typing without taking the cursor', async ({
  page,
}) => {
  await openStory(page, 'molecules-operation-states-save-state--in-editor');

  const note = page.getByRole('textbox', { name: 'Consultation note' });

  // The story's own play function types into the note; wait for the state it leaves behind before
  // taking over, or the two drivers interleave and the flow is timing-dependent.
  await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible();

  // Save first, so the transition below is proved from a known durable state.
  await page.getByRole('button', { name: 'Save note' }).click();
  await expect(page.getByText(/^Saved \d/)).toBeVisible();

  await note.click();
  await note.press('End');
  await note.pressSequentially(' Plan discussed.');

  await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible();
  // The whole reason this announces politely rather than alerting: the operator is mid-sentence.
  await expect(note).toBeFocused();
});
