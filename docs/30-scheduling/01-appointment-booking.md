# Appointment Booking

**Status:** `modelled`

## Purpose

The appointment book is the operational heart of a practice. Everything else — clinical work,
billing, reporting — hangs off it. It has to be fast, dense, and forgiving, because a receptionist
uses it several hundred times a day while a phone is ringing.

## Who does it

Receptionist (most bookings), Practice Nurse, GP (follow-ups booked from within a consultation),
and the patient (online booking).

## The workflow

### Booking by phone or at the desk

1. **Identify the patient** — search by name/DOB. If not found, register (see
   [patient registration](../20-patient-management/01-patient-registration.md)).
2. **Establish the reason for the visit.** Free text, plus an optional structured reason.
   This is where the triage prompt fires — see [03-triage-at-booking.md](03-triage-at-booking.md).
3. **Choose appointment type.** The type sets the default duration and the expected cost.
4. **Choose practitioner.** Options offered in this order, because it reflects how practices
   actually think:
   - The patient's **usual GP** (continuity — GP2.1)
   - Any GP with the required competency
   - Next available
   Patient preferences (e.g. requires a female practitioner) filter the list, and the reason is
   shown so reception doesn't have to remember.
5. **Choose a slot.** The book shows availability across practitioners for the day/week.
6. **Confirm cost.** For a private-billing practice, the expected out-of-pocket for that
   appointment type is displayed and can be read to the patient — informed financial consent
   (C1.5) starts here, not at the till.
7. **Confirm contact details** and reminder preference.
8. **Book.** Confirmation SMS/email sent if the patient has consented to that channel.

### Booking from within a consultation

A GP booking a follow-up mid-consultation gets a compressed flow: patient is known, reason is
prefilled from the plan, practitioner defaults to themselves, and the interval ("6 weeks") is
chosen rather than a date. The system finds the nearest matching slot.

### Longer appointments

Reception is prompted to offer a longer appointment when:
- The patient asks for one
- The reason text matches a configured pattern (multiple problems, mental health, care plan,
  "lots to discuss")
- The patient has a care plan due
- The patient is over 75, or has more than N active problems

This is the practical expression of "book the right length" — the thing every GP wishes reception
did more of.

### Double booking and overbooking

Allowed where the appointment type permits, always with a visible marker in the book, and the
practitioner sees it. Emergency/urgent overbooking has its own reason code so that overbooking
pressure can be measured rather than guessed at.

## Rules and constraints

1. An appointment must have: patient, practitioner, location, type, start, duration, and a reason.
2. A slot cannot be booked outside the practitioner's session availability without an override
   (recorded with a reason).
3. A slot cannot be booked at a location where the practitioner has no provider number unless the
   appointment is marked non-billable.
4. Concurrent booking of the same slot is prevented by a database constraint, not optimism.
5. Appointments for inactive or deceased patients are blocked.
6. Booking a patient with an expired Medicare card raises a non-blocking warning at booking and a
   blocking one at bulk billing.

## Data touched

`appointments`, `appointment_status_history`, `patients`, `session_templates`,
`appointment_types`, `notifications`.

## Offline behaviour

**Fully supported.** The book for today and tomorrow at the current location is cached.
Bookings made offline use a client-generated UUID and queue in the outbox. Slot conflicts are
detected on sync: the losing booking becomes a conflict item shown to reception with both
appointments, rather than silently dropped.

## Standards mapping

GP1.1 Responsive system for patient care · GP2.1 Continuous and comprehensive care ·
C1.5 Costs associated with care · C2.3 Accessibility of services

## Feature files

`features/scheduling/appointment-booking.feature`,
`features/scheduling/appointment-book-view.feature`,
`features/scheduling/booking-conflicts.feature`
