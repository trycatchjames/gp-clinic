---
area: ux
blocked-by: [ux-surfaces]
needs-review: [clinical-safety]
---

# Save feedback

## Decide

Direction chosen on 24 October 2026: when the browser's checks pass, the sheet or dialog closes
at once, one toast shows Saving… and then Saved, and an error reopens the form with the draft and
its field errors. Still to decide:

- What happens when the error arrives after the person has moved to another page or patient.
- How a `409` conflict reopens: the newer version beside the person's draft, neither discarded.
- Whether any clinical write, such as an allergy, a prescription or a result action, must stay
  open until the API confirms instead.
- How long the Saved toast stays, and whether a failure toast stays until dismissed.
- Whether a lost connection offers Review draft, and how a retry avoids saving twice.

## Why we're asking

Closing before the API confirms makes the app feel fast, but for a moment the screen shows a
change that has not happened. In payroll that is a small risk; in a clinic a person may already
be acting on it. The current specification says the opposite (keep the form open while
saving), so it must be rewritten either way, and every form will copy whatever it says.

## Examples

- A receptionist changes a patient's phone number and turns to the next caller. The API rejects
  the number two seconds later. The sheet reopens over the next patient's booking: is that
  right, or does the toast offer Review draft instead?
- A nurse records a new penicillin allergy and the save fails on a network drop. The GP opens
  the record a minute later. Does the allergy form close before the save is confirmed?
- Two staff edit the same patient's address. The second save gets a `409`. What does the second
  person see when the form reopens?

## Starts from

- [Validation and save feedback](../experience/web-patterns.md#validation-and-save-feedback).
- SmoothPay's pattern, first used for pay items (PAY-002).
- The [clinical safety requirements](../../cross-cutting/clinical-safety/).

## Blocks

Every form; form validation; unsaved work; messages and guidance; a shared form helper.
