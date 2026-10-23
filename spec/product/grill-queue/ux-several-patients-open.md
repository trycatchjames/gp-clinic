---
area: ux
blocked-by: [ux-record-pages]
needs-review: [clinical-safety]
---

# Several patients open at once

## Decide

- Whether a person may have several patients' records open in different browser tabs.
- If so, how each tab makes its patient unmistakable, and whether the app warns when a second
  patient is opened.
- If not, how the app keeps a single patient in context and what happens to an open draft when
  someone switches.
- How a note, a prescription or a result action is tied to the patient it was started for, even
  if the person switches tabs.

## Why we're asking

Staff habitually keep several tabs open. A note started for one patient and finished in a tab
showing another is a classic wrong-patient error. The browser makes multiple tabs possible
whatever we decide, so the product must decide how to make them safe.

## Examples

- A GP has Patient A's record in one tab and opens Patient B's result in another, then returns
  to the first tab and keeps typing a note. Which patient is the note for, and how is that
  obvious?
- A receptionist books Patient A while looking up Patient B's phone number in another tab.
- A GP is called away mid-note and opens another patient for an urgent question. What happens
  to the first note?

## Starts from

- Record pages, once settled.
- [Patient identity](../../decisions/ADR-003-patient-identity.md) and the
  [clinical safety requirements](../../cross-cutting/clinical-safety/).

## Blocks

Consultation notes; prescriptions; result actions.
