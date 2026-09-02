# Appointment management

## Dependencies

- Domains: [appointment](../../domain/appointment.md), [availability](../../domain/availability.md), [location](../../domain/location.md), [patient](../../domain/patient.md), [practitioner](../../domain/practitioner.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Receptionists and authorised clinical/management staff create and maintain safe reservations and move patients through reception flow.

## Primary tasks

Book existing/provisional patients or structured holds; select type/duration/mode/resources; validate conflicts; overbook with authority; reschedule; cancel; record DNA; arrive/return to waiting; associate a recall; find appointment history.

## Inputs and outputs

Consumes patient identity, availability, type defaults, practitioner/location/resources and permissions. Creates/changes Appointment and emits operational/audit history; may signal Consultation, Recall and Billing but does not complete them.

## Constraints

Identity is verified at booking/contact and again at arrival according to practice workflow. Appointment note is reception-safe. Every material change has explicit save outcome. Concurrent changes return a conflict. A cancellation or DNA linked to a recall leaves the recall active.

## Out of scope

Clinical assessment, online booking, external notifications and payment processing.

## Rules

- Create/reschedule validates patient/hold, practitioner, location, start/duration, availability, resource and conflict policy in one commit.
- Type defaults are proposals; changing type never silently overwrites a user-set duration/resource.
- Arrival records that identity was verified using the practice's approved three-identifier process; it does not store secrets or require Medicare.
- Cancellation reason/category and actor are retained. DNA eligibility follows policy and is never inferred merely from elapsed time.
- Overbook/add-on requires policy, permission and reason and remains visibly flagged.
- Appointment history is never deleted by reschedule/cancel/DNA/entered-in-error.
- Recall association survives appointment changes; only clinical recall closure resolves the obligation.
- A recurring booking is finite and previewed with every occurrence/conflict before commit. The user explicitly chooses one occurrence or this-and-future for later edits; completed/past occurrences never move with a series edit.

## Interactions

Booking may begin in Calendar or Patient Record and returns the committed appointment. Patient registration can return a new provisional/active patient to the same editor without losing slot context. Arrival adds the patient to Waiting Room. Start Consultation creates/links Encounter only after clinical context checks. Successful Encounter completion advances to billing handoff or completed according to policy. Billing failure leaves the appointment at billing, not clinically in consultation.

Cancellation/reschedule may make a previously recorded appointment-reminder attempt stale; Version 1 records the need but does not send an external update. A linked recall/task receives an event and remains independently open.

## Permissions

Use the granular scheduling permissions in [`../../cross-cutting/authorization/permissions.md`](../../cross-cutting/authorization/permissions.md). Create does not imply overbook; edit does not imply cancel/DNA; arrive does not imply start consultation. Clinical appointment reasons and patient clinical summary require separate clinical permissions. Correcting completed/entered-in-error appointments requires elevated lifecycle authority and reason.

## Screen contracts

### Appointment activity

#### Purpose

Inspect the complete lifecycle of one appointment without confusing current status with history.

#### Primary content

Patient identity, practitioner/location, current schedule, recurrence-series reference where present, state, arrival/start/completion times, encounter and invoice links, and an ordered event history with actor, time and reason.

#### Actions

Authorised users may reschedule, cancel, record arrival/DNA, add an operational note or follow a linked record. Actions are state- and permission-aware. History is never editable or deletable.

#### Safety and accessibility

Identity banner remains visible. State uses text as well as colour. Date/time shows Australian format and timezone; changed values show before/after meaning.
