# Prescription

## Purpose

Prescription records a legally responsible prescriber's direction for supply. Version 1 supports internal authoring, validation, printing/manual issue and lifecycle tracking only; it does not transmit to an exchange or pharmacy.

## Core attributes

Patient, prescriber and practitioner-at-location, authored time, one or more prescription items, medicine identity/display, strength/form, directions, dose/frequency/route where entered, quantity, repeats, indication where recorded, issue method, jurisdiction, status, cancellation/supersession reason and immutable rendered snapshot.

## Rules

- Only a user with `prescription.issue` and valid organisational/legal authorisation may issue; they issue as themselves.
- Patient, prescriber, location, active allergy/ADR facts and “not assessed” state are displayed before issue.
- Local validation covers completeness, positive quantity/non-negative repeats and internally known duplicates; it MUST NOT claim clinical appropriateness, interaction or schedule compliance without validated external/current knowledge.
- Jurisdiction-sensitive requirements are configured and legally reviewed; unsupported jurisdiction blocks clinical deployment, not necessarily draft entry.
- Issue creates an immutable snapshot. Corrections after issue use cancel/reissue or supersede; issued content is not edited in place.
- Print/manual handoff status means only that the practice produced/recorded the artefact, not that a pharmacy received or dispensed it.

## Invariants

1. An issued prescription has exactly one patient, prescriber, issue location/time and immutable content snapshot.
2. A prescription cannot be issued under an inactive/unauthorised prescriber-at-location identity.
3. Cancellation never deletes or recalls a physical copy; the UI communicates the operational limitation.
4. Issue is atomic: either the prescription and audit event commit, or neither appears issued.
5. Reprint is auditable and visibly identifies a copy/reprint according to policy.
