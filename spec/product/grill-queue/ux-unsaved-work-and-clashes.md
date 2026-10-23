---
area: ux
blocked-by: [ux-save-feedback]
needs-review: [clinical-safety]
---

# Unsaved work and edit clashes

## Decide

- What happens when someone closes a sheet, presses Escape or leaves the page with unsaved
  changes: warn, keep a draft, or discard.
- Whether drafts survive a page reload or a closed tab, and for how long.
- What a person sees when someone else has changed the record they are looking at or editing:
  a live update, a notice, or nothing until they save.
- How a person compares their change with the newer one and chooses.

## Why we're asking

Several staff work on the same patients at once: reception, nurses and GPs. With close-on-save,
drafts live longer outside the form, so the rules for keeping and discarding them must be
clear. The [error handling](../../cross-cutting/error-handling/) and
[data integrity](../../cross-cutting/data-integrity/) requirements forbid silently discarding a
failed save or a conflict, but no screen pattern yet says how that looks.

## Examples

- A receptionist half-fills a new patient's details, gets interrupted by a phone call and
  clicks away. When they come back, is the draft there?
- A nurse updates a patient's emergency contact while the GP has the same details open. The
  GP's screen still shows the old contact. Does it update, show a notice, or wait?
- A GP presses Escape in a sheet with three changed fields. Does it close, or ask first?

## Starts from

- [States](../experience/web-patterns.md#states), whose Conflict row says neither version is
  discarded.
- [Keyboard and focus](../experience/web-patterns.md#keyboard-and-focus): Escape closes a
  transient surface only when that loses no work.
- SmoothPay's spreadsheet grid, where Cancel with unsaved changes asks first.

## Blocks

Shared front-desk computers; editing many rows at once.
