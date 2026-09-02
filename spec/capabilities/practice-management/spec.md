# Practice management

## Dependencies

- Domains: [appointment](../../domain/appointment.md), [billing](../../domain/billing.md), [location](../../domain/location.md), [practice](../../domain/practice.md), [practitioner](../../domain/practitioner.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Practice managers and nominated administrators configure the organisation safely and monitor operational readiness.

## Primary tasks

Maintain practice/locations/hours/timezones/rooms; appointment types; fee schedules/items; teams/roles; safe-contact/result/recall policies; document/communication templates; jurisdiction settings; closures; view configuration history and unresolved impacts.

## Inputs and outputs

Consumes governance approvals and permissions. Changes Practice/Location/configuration aggregates and triggers impact worklists for future appointments/responsibilities.

## Constraints

Configuration is effective-dated/versioned; cannot weaken hard invariants; history is immutable; changes preview affected bookings/billing/templates; administrator does not gain clinical access.

## Out of scope

Accreditation certification, payroll/accounting, external directory/identifier registration and facilities inventory beyond schedulable resources.

## Rules

- Practice and location records have stable identifiers; display names and contact details are versioned attributes.
- Clinical and operational configuration changes record actor, time, reason and effective period.
- Local catalogues cannot silently redefine historical records that captured a prior version.
- Deactivation prevents new use while preserving references from appointments, encounters, invoices and audit events.
- Security-sensitive configuration requires elevated permission and is included in administrative review reporting.

## Interactions

Practice configuration supplies locations, hours, appointment types, reason catalogues, document templates and local fee snapshots to downstream capabilities. Published changes affect new work from their effective time; finalised historical snapshots remain stable. User access and clinician identity are managed separately so a person can change role or location without rewriting clinical authorship.

## Permissions

`practice.configure`, `location.manage`, `availability.manage`, `fee_schedule.manage`, `notification.template.manage`, `role.manage` and `user.manage` are separate grants. High-risk policy/role changes may require secondary approval. None grants patient clinical content. Configuration/audit visibility is scoped to the relevant area.

## Screen contracts

### Screen contract: Practice settings

#### Purpose and actors

Allows authorised managers to inspect and change effective-dated practice configuration with impact preview and history.

#### Layout

Navigation for practice, locations/hours/timezones, rooms/resources, appointment types/policies, communication/recall/result policy, templates, billing items/fees, teams/roles and jurisdiction/safety configuration. Main panel shows current effective version, draft changes, validation, affected-record preview and change history.

#### Behaviour

Edits are draft until reviewed/activated. Effective-date changes show future appointments, practitioner books, fee uses or issued template dependencies affected. Hard invariants cannot be disabled. Sensitive policy changes may require second approval.

#### States/failure

Read-only/loading/draft/validation/active/historical. Failed activation leaves prior version active and draft recoverable. Partial impact analysis blocks activation when affected records cannot be safely enumerated.

#### Permissions

Configuration areas use separate permissions. Technical administrator can manage infrastructure/auth settings but receives no clinical content. Audit/history is read-only.
