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
