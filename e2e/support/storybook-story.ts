import { expect, type Page } from '@playwright/test';

/**
 * Waits until a story's own play function has stopped moving focus.
 *
 * Resetting focus while a play function is still running does not merely race it — every click
 * steals focus from the keyboard events the play is sending, so the story ends up in a state it
 * never reaches on its own and the test reads a lie. Waiting for the active element to hold still
 * is a proxy for "the play is done" that needs no hook into Storybook's channel.
 */
async function playSettled(page: Page) {
  await page.waitForFunction(
    () => {
      const held = window as unknown as { __focusHeldSince?: { at: number; element: Element | null } };
      const element = document.activeElement;
      const now = Date.now();
      if (!held.__focusHeldSince || held.__focusHeldSince.element !== element) {
        held.__focusHeldSince = { at: now, element };
        return false;
      }
      return now - held.__focusHeldSince.at > 400;
    },
    undefined,
    { polling: 100 },
  );
}

/**
 * Opens one story and returns it with focus reset to the document.
 *
 * A story's play function may leave focus part-way through its flow, so the tab order a test
 * asserts below is the one a fresh operator would meet and the first Tab counts as keyboard focus.
 * Any state the play established — a selection, an open panel — is left alone.
 */
export async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.waitForFunction(
    () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
  );
  await playSettled(page);
  await page.mouse.click(2, 2);
  await expect(page.locator('body')).toBeFocused();
}
