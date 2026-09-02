# Medication

## Purpose

Medication is the longitudinal record of a medicine a patient is reported or intended to be taking. It supports reconciliation and continuity; it is distinct from a prescription and from administration.

## Core attributes

Medicine display, optional local code/system/version, form/strength, dose and directions as authored, route/frequency, indication where recorded, start/stop dates with precision, status, source (`practice_prescribed`, `external_prescriber`, `patient_reported`, `over_the_counter`, `complementary`), prescriber if known, author/reconciler and related prescription/encounter.

## Rules and invariants

- Current medication includes relevant externally prescribed, OTC and complementary medicines; source must be visible. [RACGP-SGP5, C7.1/QI2.1]
- Issuing a prescription may create/update a medication only through an explicit confirmed action. A prescription alone is not proof of use.
- Medication reconciliation records who reviewed the list, when and what changed; “no current medication” is an assessed statement.
- Ceasing a medication records clinical reason where supplied and never deletes prior prescriptions.
- Dose/directions are stored as authored text plus any safe structure entered by the user; the system must not infer or calculate a dose.
- Duplicate active medicines are warned based on stable local identity where available but not auto-merged.
- Historical terminology changes do not rewrite the authored medicine display.

## Medication lifecycle

`proposed → active → ceased|completed|on_hold → active`; any state may become `entered_in_error` by authorised correction.

- `proposed`: suggested/imported and not confirmed current.
- `active`: recorded as currently taken/intended.
- `on_hold`: temporarily paused, with reason and review date where known.
- `completed`: finite course recorded complete.
- `ceased`: intentionally stopped.

Transitions retain actor, date, clinical reason and source. Time passing never automatically completes a course without an explicit rule reviewed for safety; Version 1 defaults to manual confirmation.
