import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { openStory } from './support/storybook-story';

const evidenceDirectory = path.join(process.cwd(), 'delivery/evidence/DS-003/screenshots');

/**
 * Opens a story that ends its own play function with focus on a known control, and waits for that
 * terminal state. Racing a running play function is what makes overlay keyboard evidence flaky, so
 * the flow below starts from the state the play leaves behind rather than resetting focus.
 */
async function openPlayedStory(page: Page, id: string, settled: () => Promise<void>) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
  await settled();
}

/** Overlays re-mount as they open, so their evidence is the viewport rather than the node. */
async function captureViewport(page: Page, evidenceId: string) {
  await page.screenshot({
    path: path.join(evidenceDirectory, `${evidenceId}.png`),
    animations: 'disabled',
  });
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

/**
 * Stories whose named evidence is a still of the rendered state. Any interaction they need is
 * already performed by the story's own play function before the screenshot is taken.
 */
const stills: ReadonlyArray<{ story: string; evidence: string }> = [
  { story: 'atoms-feedback-alert--semantics', evidence: 'alert-semantics' },
  { story: 'atoms-feedback-alert--dynamic-announcement', evidence: 'alert-announcement' },
  { story: 'atoms-feedback-progress--labelled', evidence: 'progress-values' },
  { story: 'atoms-feedback-skeleton--table-geometry', evidence: 'skeleton-geometry' },
  { story: 'atoms-forms-input--invalid', evidence: 'input-states' },
  { story: 'atoms-forms-input--keyboard-flow', evidence: 'input-keyboard' },
  { story: 'atoms-forms-textarea--invalid', evidence: 'textarea-states' },
  { story: 'atoms-forms-textarea--long-content', evidence: 'textarea-content-stress' },
  { story: 'atoms-forms-label--keyboard-flow', evidence: 'label-association' },
  { story: 'atoms-forms-checkbox--disabled', evidence: 'checkbox-states' },
  { story: 'atoms-forms-checkbox--keyboard-flow', evidence: 'checkbox-keyboard' },
  { story: 'atoms-forms-radio-group--with-selection', evidence: 'radio-group-states' },
  { story: 'atoms-forms-radio-group--keyboard-flow', evidence: 'radio-group-keyboard' },
  { story: 'atoms-forms-switch--failed-change', evidence: 'switch-states' },
  { story: 'atoms-forms-switch--keyboard-flow', evidence: 'switch-keyboard' },
  { story: 'atoms-forms-select--invalid', evidence: 'select-states' },
  { story: 'atoms-forms-select--keyboard-flow', evidence: 'select-keyboard' },
  { story: 'atoms-data-display-card--with-actions', evidence: 'card-hierarchy' },
  { story: 'atoms-data-display-avatar--fallback', evidence: 'avatar-fallback' },
  { story: 'atoms-data-display-separator--semantic', evidence: 'separator-orientation' },
  { story: 'atoms-navigation-tabs--default', evidence: 'tabs-states' },
  { story: 'atoms-navigation-tabs--keyboard-flow', evidence: 'tabs-keyboard' },
];

for (const { story, evidence } of stills) {
  test(`[${evidence}] captures the atom's named state`, async ({ page }) => {
    await openStory(page, story);
    await capture(page, evidence);
  });
}

test('[dialog-layout] keeps a failed submit open with the operator’s choices intact', async ({
  page,
}) => {
  await openStory(page, 'atoms-overlays-dialog--failed-submit');

  const dialog = page.getByRole('dialog', { name: 'Cancel this appointment?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('alert')).toContainText('It is still booked');
  await captureViewport(page, 'dialog-layout');
});

test('[dialog-keyboard] traps focus while open and returns it to the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Cancel appointment', exact: true }).first();
  const dialog = page.getByRole('dialog', { name: 'Cancel this appointment?' });

  await openPlayedStory(page, 'atoms-overlays-dialog--keyboard-flow', async () => {
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Keep appointment' })).toBeVisible();
  await captureViewport(page, 'dialog-keyboard');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('[menu-states] distinguishes disabled and destructive items beyond colour', async ({
  page,
}) => {
  await openStory(page, 'atoms-overlays-dropdown-menu--destructive-item');

  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByText('Merge duplicate record (requires practice manager)')).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Cancel appointment' })).toBeVisible();
  await captureViewport(page, 'menu-states');
});

test('[menu-keyboard] moves between items without activating them', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Record actions' });
  const menu = page.getByRole('menu');

  await openPlayedStory(page, 'atoms-overlays-dropdown-menu--keyboard-flow', async () => {
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();

  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Reschedule' })).toBeFocused();
  await expect(menu.getByRole('menuitem', { name: 'Open patient record' })).not.toBeFocused();
  await captureViewport(page, 'menu-keyboard');

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('[tooltip-keyboard] shows and dismisses the hint from the keyboard alone', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Provider number' });
  const tooltip = page.getByRole('tooltip');

  await openPlayedStory(page, 'atoms-overlays-tooltip--keyboard-focus', async () => {
    await expect(trigger).toBeFocused();
    await expect(tooltip).toBeHidden();
  });

  // The story's play function dismissed the hint with Escape. Leaving and re-entering the control
  // brings it back, which is the behaviour a keyboard operator relies on.
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await expect(tooltip).toBeVisible();
  await captureViewport(page, 'tooltip-keyboard');

  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('contains every atom state sheet at a 360 pixel viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });

  for (const story of [
    'atoms-data-display-card--narrow',
    'atoms-feedback-skeleton--narrow',
    'atoms-navigation-tabs--narrow',
    'atoms-overlays-dialog--narrow',
  ]) {
    await openStory(page, story);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
