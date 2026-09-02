# Practitioner management

## Dependencies

- Domains: [availability](../../domain/availability.md), [location](../../domain/location.md), [practice](../../domain/practice.md), [practitioner](../../domain/practitioner.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Practice managers maintain practitioner identity, credentials, locations, books and coverage without confusing practitioner with user access.

## Primary tasks

Create practitioner; record type/credentials/effective dates; assign locations/provider identifiers; link user; configure book eligibility/availability; record supervision/delegation; plan absence; offboard and reassign responsibilities.

## Inputs and outputs

Consumes Location, User/membership, permissions and governance evidence. Produces Practitioner/PractitionerLocation, coverage/delegation and work impact lists.

## Constraints

Provider number per location/effective date; no auto-permission from practitioner type; expiry visible; deactivation blocked until open work reviewed; authorship remains.

## Out of scope

AHPRA/Services Australia verification, roster/payroll and external provider directories.

## Rules

- A practitioner has one stable internal identifier independent of user account, provider number or location.
- Qualifications, identifiers, role, locations, sessions and effective dates are explicit and provenance-bearing.
- Provider numbers are location/service-context attributes and are not interchangeable across places of service.
- Offboarding reassigns open results, recalls, tasks and appointments before access is removed.
- Deactivation preserves authorship and financial records and blocks new assignment unless deliberately reactivated.

## Interactions

Practitioner configuration feeds calendar availability, encounter authorship, result responsibility and billing context. A linked user account grants permissions but is not the practitioner record. Changes to sessions or locations trigger conflict previews for future appointments. Offboarding produces a reviewable transfer plan and cannot complete while owned safety work remains unassigned.

## Permissions

`practitioner.manage` changes professional/location facts; `availability.manage` changes sessions; `user.manage`/`role.manage` change access; they are independent. Responsibility reassignment requires source-domain assignment permission. Offboarding initiator cannot bypass clinical ownership acceptance or rewrite authorship.

## Screen contracts

### Screen contract: Practitioner profile and offboarding

#### Purpose

Maintains a practitioner and safely manages location credentials, books, delegation and departure.

#### Layout/information

Identity/type; credentials/effective dates; practitioner-location matrix with provider identifiers; linked user/membership (separate); book/availability eligibility; supervision/delegation; absence; responsibility inventory; audit/history.

#### Actions

Create/edit effective facts, add/remove location, configure availability link, record cover/delegation, link/unlink user, suspend booking/prescribing according to policy, start offboarding, reassign future appointments/results/recalls/tasks/drafts, deactivate.

#### Offboarding behaviour

Inventory lists each open obligation by domain, count/oldest/urgency and destination. Bulk reassignment previews conflicts and itemised results. Access deactivation is blocked until required work is accepted by named practitioners/team queues; authorship remains.

#### States/failure

Active/restricted/inactive and credential expiry are distinct. Failed reassign leaves source owner for failed items and blocks deactivation. Provider identifier updates do not alter historical encounters/invoices.
