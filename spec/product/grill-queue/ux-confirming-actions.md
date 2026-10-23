---
area: ux
blocked-by: [ux-surfaces]
needs-review: [clinical-safety]
---

# Confirming consequential actions

## Decide

- Which actions ask first, which offer undo instead, and which happen in one step.
- What a confirmation shows: the target, what changes downstream and what is kept.
- Whether any action needs a typed confirmation, such as the patient's name.
- How a corrective action differs from a destructive one, such as marking an entry in error
  rather than deleting it.

## Why we're asking

Too many confirmations slow the front desk and train people to click through them; too few let
a slip cancel an appointment or revoke access. Today revoking an invitation in Settings › Team
happens from a row button. The receptionist question in
[open questions](../../research/open-questions.md) asks which appointment changes need
confirmation during peak call volume, and the answer should come from the same rule.

## Examples

- A receptionist cancels a patient's appointment while on the phone. Confirm, undo toast, or one
  step?
- A practice manager revokes a staff member's invitation. Does a dialog name the person and say
  what they lose?
- A GP marks a consultation note as entered in error. Does the confirmation show that the note
  is kept and shown as struck through?
- A practice manager archives a location that still has future appointments.

## Starts from

- [Actions and consequences](../experience/web-patterns.md#actions-and-consequences).
- [Clinical record amendments](../../decisions/ADR-002-clinical-record-amendments.md).
- `apps/web/src/routes/settings/team.tsx`.

## Blocks

Archiving, revoking, cancelling and correcting anywhere in the app.
