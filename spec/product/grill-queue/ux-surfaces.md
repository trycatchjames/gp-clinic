---
area: ux
blocked-by: []
needs-review: []
---

# Choosing a surface

## Decide

- When a task uses a full page, a right-side sheet, a dialog, a popover or editing in place.
- Whether creating a record and editing one use the same surface.
- Whether a sheet may open a dialog (for a confirmation) and whether anything may open a second
  sheet.
- The single "which surface?" table every screen follows.

## Why we're asking

The same kind of task should look the same everywhere. Today only the onboarding team step
uses an overlay, a dialog for adding a practitioner, and nothing uses a sheet. The next screen
that needs an overlay will set the habit by accident, and the one after it may set a different
one. Save feedback, validation and confirmations all depend on which surfaces exist.

## Examples

- A receptionist updates a patient's mobile number while the patient waits at the desk. Sheet,
  dialog, or edit in place on the record?
- A practice manager adds a new practitioner with a provider number, AHPRA registration and
  sessions. Is that a sheet, or long enough for its own page?
- A GP filters the appointment list by practitioner. Popover, or a sheet of filters?
- Registering a new patient takes a dozen fields across identity, contact and Medicare. Page or
  sheet, and is it the same surface as editing those details later?

## Starts from

- [Viewing and editing records](../experience/web-patterns.md#viewing-and-editing-records),
  which already prefers sheets for section edits and dialogs for brief actions.
- `apps/web/src/routes/onboarding/step-team.tsx`, the only overlay today.
- SmoothPay's web patterns, where company details open in sheets and Add company is a dialog.

## Blocks

Every new screen; save feedback; confirming actions; record pages.
