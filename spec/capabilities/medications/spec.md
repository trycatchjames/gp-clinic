# Medications

## Dependencies

- Domains: [allergy](../../domain/allergy/overview.md), [clinical record](../../domain/clinical-record/overview.md), [consultation](../../domain/consultation/overview.md), [medication](../../domain/medication/overview.md), [patient](../../domain/patient/overview.md), [problem](../../domain/problem/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians maintain the best available record of current and historical medicines, regardless of who prescribed them.

## Primary tasks

Add patient-reported/external/practice medicine; record authored dose/directions/source; reconcile list; mark none current; cease/hold/complete/reactivate; connect but not conflate with prescriptions; view history.

## Inputs and outputs

Consumes patient/encounter, local medicine catalogue and Prescription links. Produces Medication records and reconciliation statements for the health summary.

## Constraints

Prescription is not adherence; external/OTC/complementary sources matter; no dose inference; duplicates warn but never auto-merge; changes are attributable.

## Out of scope

Dispensing, pharmacy history, external medicines database, interaction/adherence automation.

## Rules

- Active, ceased, completed, proposed and entered-in-error states are explicit.
- Medicine identity, dose instructions, route, frequency, indication where known, start/stop dates, source and prescriber are preserved.
- Changing dose or directions creates a new version/order relationship rather than rewriting history.
- Ceasing requires effective date and reason; it does not assert disposal, adherence or external dispensing.
- Imported or patient-reported medicines are visibly distinguished from practice-prescribed medicines.

## Interactions

The medication list aggregates current assertions while the timeline retains every order, change and cessation. Prescribing may create or supersede an active medication entry after safety checks. Medication reconciliation records source and reviewer. Allergy warnings and problem/diagnosis context inform, but do not autonomously decide, prescribing.

## Permissions

`clinical.summary.view` shows the current list; `medication.manage` records/reconciles/status-changes. Prescription permissions do not automatically grant medication reconciliation, and vice versa. Administrative users have no default medication access.

## Screen contracts

### Screen contract: Medication list and reconciliation

#### Purpose

Shows what the practice currently understands the patient to take, its provenance and when that understanding was reviewed.

#### Layout and required information

Patient/allergy banner; assessment/reconciliation status and last reviewer/time; current medicines; on-hold; historical/ceased; selected medicine detail/history. Each row shows authored medicine/strength/form, directions/dose as recorded, source/prescriber, status, start/stop precision and last change.

#### Actions

Add practice/external/patient-reported/OTC/complementary medicine; edit draft/proposed; reconcile list; mark no current medicines only when no active item; cease/hold/complete/reactivate; mark entered-in-error; open linked prescriptions/encounters.

#### States/failure

Not assessed, assessed-none, current list, stale review, partial load and unavailable are distinct. Failed change leaves previous list current and preserves editor. Duplicate warning offers comparison, never auto-merge.

#### Permissions/accessibility

Clinical view/manage separate. Tabular and small-screen list modes expose the same provenance/actions; status is not colour-only.
