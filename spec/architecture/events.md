# Domain events

## Purpose

Domain events state completed facts for internal coordination, history and projections. They do not imply a message broker. An implementation may use an outbox, transaction log or in-process publication if durability/order guarantees hold.

## Semantics

- Event names are past tense and versioned, for example `appointment.arrived.v1`.
- An event is published only after its fact commits; consumers are idempotent.
- Ordering is guaranteed per aggregate/version, not globally.
- Events carry identifiers and minimum necessary facts, not unrestricted clinical documents.
- Replay must not re-send patient communications or duplicate financial/clinical actions; side-effect consumers use idempotency and explicit delivery ledgers.
- Contract-breaking changes create a new major event version and a compatibility/migration plan.

## Important events

Patient: `patient.created`, `patient.demographics_changed`, `patient.deceased_recorded`, `patient.merged`.  
Scheduling: `appointment.booked`, `appointment.rescheduled`, `appointment.arrived`, `appointment.cancelled`, `appointment.did_not_attend`, `availability.changed`.  
Clinical: `encounter.started`, `encounter.completed`, `clinical_entry.amended`, `allergy.changed`, `prescription.issued`, `investigation.issued`, `result.received`, `result.assigned`, `result.reviewed`.  
Work: `recall.created`, `recall.contact_recorded`, `recall.closed`, `task.reassigned`, `document.unmatched`.  
Financial: `invoice.issued`, `payment.recorded`, `payment.reversed`, `claim.status_recorded`.  
Security: permission/membership changes are security audit events and may emit minimal revocation events.

The normative envelope is in [`../contracts/events/domain-events.md`](../contracts/events/domain-events.md).
