---
area: ux
blocked-by: [ux-form-validation, ux-unsaved-work-and-clashes]
needs-review: []
---

# Editing many rows at once

## Decide

- Whether any list is edited as a spreadsheet-style grid, and which ones warrant it.
- Whether people can paste many rows from Excel, Numbers or Google Sheets.
- How rows that will be added, archived or restored are shown before saving.
- How errors show inside the grid, and how saving reports them.
- How keyboard movement works: Tab, Enter and the arrow keys.

## Why we're asking

Fee schedules, item lists and practitioner sessions are built in bulk and rarely changed after.
Entering them one sheet at a time is slow and error-prone, and practices often already have
them in a spreadsheet. A grid is a substantial pattern, so it should exist once rather than be
reinvented by the first screen that needs it.

## Examples

- A practice manager pastes 60 private fee items from their old system's export. Three have no
  fee. What do they see before they save?
- A practice manager raises every standard consultation fee by $2. Row by row, or one grid
  edit?
- Someone presses Cancel after editing ten rows.

## Starts from

- SmoothPay's chart of accounts grid (PAY-005): Edit chart, a trailing blank row, an action bar
  with Cancel and Save, and paste from spreadsheets.
- The MBS reference screen, `apps/web/src/routes/mbs.tsx`.

## Blocks

Fee schedule setup.
