# Appointment

## Purpose

Appointment reserves time for a patient or an explicit hold with a practitioner and optional resources. It coordinates access and clinic flow; it is not the clinical encounter or invoice.

## Core attributes

- patient or hold purpose; practitioner; location; appointment type;
- start instant, location timezone, positive duration and optional required rooms/resources;
- visit mode, patient-stated booking reason, reception-safe note and clinical-triage flag/reference;
- operational status and timestamps for arrival, consultation start/end and billing handoff where applicable;
- booking source (`internal_manual` in Version 1), creator, priority/add-on/overbook reason;
- cancellation/DNA reason, reschedule lineage and recall/task associations;
- optional recurring-series identifier, occurrence position and series rule snapshot;
- version for concurrency and full change history.

## Relationships and boundaries

An appointment may produce at most one primary encounter and may be associated with an invoice, recall or task. An encounter may exist without an appointment. Appointment type provides defaults, never immutable clinical/billing truth. Availability validates proposed bookings but does not own them.

## Rules

- Booking and every move MUST revalidate practitioner/location/resource availability and conflicts against the latest state.
- Double-booking is blocked unless practice policy permits the specific context and the user has `appointment.overbook`; override reason is mandatory.
- Patient-reported urgency is recorded and routed according to practice policy; the system does not diagnose or prioritise clinically.
- Cancellation and DNA do not delete the appointment. Rescheduling records an audited change/version, retaining previous time/practitioner/location.
- Appointment notes MUST be reception-safe and MUST NOT substitute for a patient alert, clinical note, task or recall.
- A recall-related appointment does not complete its recall automatically.
- Recurring booking creates a finite, previewed set of ordinary appointments. Each occurrence has its own state/history; changing or cancelling one never silently changes the series, and changing future occurrences reports conflicts item by item.

## Appointment invariants

1. An appointment has exactly one start instant, one positive duration, one practitioner and one location.
2. A patient appointment has exactly one patient. A non-patient hold has a structured hold purpose and no invented patient.
3. An appointment interval is interpreted in its location timezone and stored as an unambiguous instant range.
4. Two active appointments cannot occupy a hard-exclusive practitioner/resource interval unless an authorised, reasoned overbook policy allows it.
5. Cancelled, did-not-attend and entered-in-error appointments are retained and excluded from active capacity calculations according to their state.
6. Rescheduling never erases the preceding schedule; actor, time, old/new values and reason are auditable.
7. Appointment state cannot be used as proof that clinical documentation or billing is complete.
8. Arrival, consultation-start and completion timestamps reflect actual transitions, not scheduled time.
9. A completed appointment cannot be dragged or casually edited; correction requires a privileged reasoned operation and cannot alter linked clinical history.
10. A failure to save a booking or reschedule leaves the original calendar unchanged.
11. A patient cannot be marked DNA before the appointment's configured eligibility time without an authorised exception.
12. Cancelling or marking DNA on an appointment linked to an open recall leaves the recall open and emits a follow-up signal.
13. Every recurring occurrence is a first-class appointment. The series rule cannot be used to reconstruct and overwrite historical occurrences.

## Appointment state model

### Canonical operational states

```text
scheduled → arrived → waiting → in_consultation → at_billing → completed
scheduled/arrived/waiting → cancelled
scheduled/arrived/waiting → did_not_attend
scheduled → rescheduled (historical transition marker; current appointment returns to scheduled)
any non-final state → entered_in_error (privileged correction)
```

`waiting` may be entered with arrival or later after reception/nursing preparation. `at_billing` may be skipped when no billing handoff is needed. An appointment can be `scheduled` in the past while awaiting explicit DNA/cancel/administrative resolution; time does not silently change state.

| Transition | Permission/actor | Preconditions | Side effects/audit |
|---|---|---|---|
| create → scheduled | `appointment.create` | patient/hold valid; interval and resources valid | creation event and booking source |
| scheduled → arrived | `appointment.arrive` | identity verified; not cancelled | actual arrival time, waiting entry |
| arrived ↔ waiting | `appointment.flow.manage` | current visit | timestamp/reason when moved back |
| arrived/waiting → in_consultation | authorised practitioner/clinical delegate | patient context confirmed; no other active encounter conflict | create/link encounter; record starter |
| in_consultation → at_billing | encounter completer | encounter completion succeeds | billing handoff only; no clinical content exposed |
| at_billing → completed | `billing.finalise` or no-charge authorised flow | required billing disposition exists | completion time |
| scheduled/arrived/waiting → cancelled | `appointment.cancel` | reason required; warn if arrived | release capacity; retain history; notify linked obligations |
| eligible non-final → did_not_attend | `appointment.dna` | configured time threshold or override | retain slot/history; notify linked recall/task |
| active scheduled → rescheduled | `appointment.reschedule` | new interval atomically validates | old/new schedule audit; reminder delivery becomes stale |

Invalid transitions return the current state and allowed next actions. No transition is inferred from opening a screen.
