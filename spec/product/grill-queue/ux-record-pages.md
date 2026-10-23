---
area: ux
blocked-by: [ux-surfaces, ux-navigation]
needs-review: [clinical-safety, privacy]
---

# Record pages

## Decide

- One layout for a record's page, such as a patient or a practitioner: tabs or sections, and
  which one it opens on.
- A card per section with its own Edit, and what a person without edit permission sees.
- The page's main action and what sits in its menu.
- What identifies the patient on every page of their record, and whether it stays visible as
  the page scrolls.
- What the History tab shows and how it relates to the record's version history.

## Why we're asking

Wrong-patient errors are among the most serious in general practice. Every page of a patient's
record must make clear whose record it is, and every record should be laid out the same way so
staff know where to look. The GP question in
[open questions](../../research/open-questions.md) on what must stay visible at all times
feeds this directly. The record will grow quickly once clinical capabilities start, so the
shape should be set first.

## Examples

- A GP opens Ms Jane Citizen, born 12/05/1958. What is always on screen: name, date of birth,
  age, record number, allergies, alerts?
- Two patients named Jane Citizen with different birth dates. What distinguishes them in the
  record's header?
- A receptionist opens a patient's record. Which tabs can they see, and what do restricted tabs
  look like?
- A GP wants to see who changed a patient's address and when.

## Starts from

- [Patient identity](../../decisions/ADR-003-patient-identity.md).
- The record history and version comparison patterns from DS-028 and DS-029.
- SmoothPay's employee record: Overview, Details, a confidential tab and History, with a sheet
  per section.

## Blocks

Patient record screens; several patients open at once.
