# Screen contract: Medication list and reconciliation

## Purpose

Shows what the practice currently understands the patient to take, its provenance and when that understanding was reviewed.

## Layout and required information

Patient/allergy banner; assessment/reconciliation status and last reviewer/time; current medicines; on-hold; historical/ceased; selected medicine detail/history. Each row shows authored medicine/strength/form, directions/dose as recorded, source/prescriber, status, start/stop precision and last change.

## Actions

Add practice/external/patient-reported/OTC/complementary medicine; edit draft/proposed; reconcile list; mark no current medicines only when no active item; cease/hold/complete/reactivate; mark entered-in-error; open linked prescriptions/encounters.

## States/failure

Not assessed, assessed-none, current list, stale review, partial load and unavailable are distinct. Failed change leaves previous list current and preserves editor. Duplicate warning offers comparison, never auto-merge.

## Permissions/accessibility

Clinical view/manage separate. Tabular and small-screen list modes expose the same provenance/actions; status is not colour-only.
