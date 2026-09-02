# Observations

## Dependencies

- Domains: [clinical record](../../domain/clinical-record.md), [consultation](../../domain/consultation.md), [observation](../../domain/observation.md), [patient](../../domain/patient.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians and scoped nurses record measurements and dated clinical assertions that can be reviewed and trended safely.

## Primary tasks

Record value/unit/method/context; enter patient-reported data with provenance; correct entered-in-error; view table/trend; calculate a transparent derived value where explicitly specified (for example BMI from height/weight).

## Inputs and outputs

Consumes patient/encounter and local observation definitions. Creates Observation records and derived links shown in summary/timeline.

## Constraints

Original value/unit retained; graph comparability explicit; source flags/ranges are not diagnosis; implausible-value prompts are confirmable and versioned.

## Out of scope

Device integration, remote monitoring and automated diagnosis/risk scoring.

## Rules

- Each observation records patient, concept, value, unit, effective time, recorder, method/context and source.
- The original value and unit remain available after normalisation or correction.
- Implausible-value warnings require confirmation; they are not diagnoses.
- Trend graphs combine only explicitly compatible concepts and units and expose gaps or transformations.
- Entered-in-error creates an additive correction event and removes the value from ordinary trend calculations.

## Interactions

Observations can be entered in a consultation or the patient record and linked to the encounter that supplied context. Derived values identify their input observations and formula/version. Chronic-care plans and reports may consume authorised projections but cannot change the source observation. Concurrent editing follows the shared optimistic-concurrency rule.

## Permissions

`clinical.summary.view`/`clinical.entry.view` control reading. `observation.record` requires authorised clinical/nursing scope; correction also requires entered-in-error/amendment authority. Reporting access uses de-identified/aggregated projections unless `report.clinical` and patient drill-through are granted.

## Screen contracts

### Observation entry and trend

#### Purpose

Record a measurement safely and inspect comparable prior values.

#### Content and controls

Patient banner; concept, value, unit, effective time, method/site/context and source fields; implausible-value confirmation; table and optional trend for compatible observations. Derived values expose their inputs and formula version.

#### States

Empty, loading, no prior values, validation warning, concurrent change, saved and entered-in-error. Keyboard order follows the clinical entry sequence and charts have equivalent tabular text.
