# Reporting

## Dependencies

- Domains: [audit](../../domain/audit.md), [billing](../../domain/billing.md), [claim](../../domain/claim.md), [invoice](../../domain/invoice.md), [patient](../../domain/patient.md), [practice](../../domain/practice.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Authorised managers and clinicians inspect operational, clinical-safety and financial trends without using reports as alternative patient-record mutation paths.

## Primary tasks

View appointments/access/DNA/waiting; unmatched/overdue results and recalls; task workload; record completeness/data quality; billing/debtors/payments/claims; audit/security exceptions; export authorised datasets.

## Inputs and outputs

Consumes versioned authorised projections from domain events/current state. Produces on-screen aggregates, drill-through and audited exports.

## Constraints

Role/purpose/minimum necessary; small-cell/re-identification risk; freshness/as-of time; totals reconcile to owners; clinical and financial reports separate; no user-performance surveillance by default; export audited.

## Out of scope

PIP/MBS programme submission, research extraction, data warehouse/vendor analytics and predictive clinical models.

## Rules

- Every report declares purpose, audience, inclusion criteria, exclusions, measures and an `as_of` time.
- Counts reconcile to canonical record owners; drill-through uses the same permission filters as the source capability.
- Small-cell, sensitive cohort and re-identification risks are controlled before display or export.
- Export requires explicit permission, purpose and audit and contains a generated-at timestamp and filter summary.
- Reports do not mutate records, determine diagnoses or silently submit data externally.

## Interactions

Reports consume authorised, versioned projections of appointment, safety-work, clinical-quality, billing and audit records. Users can drill from an aggregate to permitted source records without bypassing patient context. Data freshness is visible. Any corrected source record flows through on rebuild while prior exported artefacts retain their generation provenance.

## Permissions

`report.operational`, `report.clinical` and `report.financial` expose separate panels/datasets. Drill-through rechecks source permission. `data.export` is additional and requires purpose/scope; audit reporting uses `audit.view`. Counts of restricted data are suppressed/generalised where existence would disclose sensitive information.

## Screen contracts

### Screen contract: Operations and safety dashboard

#### Purpose and actors

Gives authorised managers/clinical leads actionable oversight of service operations and unresolved risk, with drill-through to source queues.

#### Required information

As-of time/freshness; appointment capacity/arrival/wait/DNA trends; unmatched documents/results count and oldest age; unreviewed/high-risk/follow-up results; overdue recalls/tasks by accountable owner; practitioner absence/offboarding gaps; unbilled appointments, debtors and claim exceptions; security/audit exceptions appropriate to role.

#### Semantics

Counts define numerator, denominator, timeframe, location and excluded states. Clinical and financial panels require respective permissions and can be completely absent without implying zero. Small-cell/sensitive drill-down protections apply. Trend charts offer data tables.

#### Actions/failure

Filter date/location/team; open source worklist with filters; export only with permission/reason. Stale/partial projections are labelled and not rendered as zero. Dashboard never mutates source state and never auto-assigns clinical priority.
