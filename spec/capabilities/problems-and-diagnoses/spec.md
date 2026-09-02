# Problems and diagnoses

## Dependencies

- Domain: [Problem and diagnosis](../../domain/problem.md), [problem lifecycle](../../domain/problem.md), [consultation](../../domain/consultation.md), and [patient](../../domain/patient.md).
- Cross-cutting: [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), and [privacy](../../cross-cutting/privacy/specification.md).
- Boundaries and decisions: [domain boundaries](../../architecture/domain-boundaries.md), [core-resource summaries](../../contracts/schemas/core-resources.md), and [ADR-002: additive clinical-record amendments](../../decisions/ADR-002-clinical-record-amendments.md).

## Outcome and actors

Clinicians record encounter assessments and maintain a concise longitudinal problem list for safe continuity.

## Primary tasks

Add coded or free-text diagnosis; record certainty; explicitly promote to problem; activate/inactivate/resolve/reactivate; correct entered-in-error; view supporting encounters and history.

## Inputs and outputs

Consumes encounter/patient context and a versioned local terminology catalogue. Creates Diagnosis or Problem records and summary changes.

## Rules

- A problem records concept/free text, clinical status, verification status, onset/resolution when known, recorder and source encounter.
- Encounter diagnosis and longitudinal problem-list inclusion are separate assertions; a diagnosis does not silently become a problem.
- Suspected, provisional and confirmed meanings remain distinct and visible.
- Resolution is not deletion. Resolution or entered-in-error preserves the prior assertion and reason.
- Authored text and the original code version remain available when terminology changes.
- The system never infers a diagnosis solely from an observation, medicine, result or billing item.

## Interactions

A clinician may record an encounter diagnosis and deliberately promote it to the longitudinal problem list. Problems can contextualise medicines, investigations, referrals and care plans without owning those records. The patient summary shows current verified status; the timeline includes changes. Templates may suggest capture fields but cannot auto-confirm a diagnosis.

## Permissions

`clinical.summary.view`/`clinical.entry.view` read; `problem.manage` creates diagnoses/problems and changes longitudinal status. Entered-in-error requires elevated clinical correction authority. Reception, billing and technical administration have no default access or mutation rights. Only clinical permission mutates these records.

## Screen contracts

### Problem and diagnosis editor

#### Purpose

Record an encounter diagnosis or maintain the longitudinal problem list without overstating certainty.

#### Content and controls

Patient banner; concept/free text; verification and clinical status; onset/resolution; source encounter; and separate controls for “this encounter” and “add to problem list”. Existing possible matches are shown before creating a duplicate.

#### States

Draft, validation warning, saved, resolved and entered-in-error. Suspected/provisional/confirmed labels are textual, and changing status requires an attributable reason where clinically material.

## Out of scope

Automated diagnostic suggestion, external terminology API and eligibility inference.
