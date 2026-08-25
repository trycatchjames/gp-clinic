# Online Booking and Waitlist

**Status:** `specified`

## Purpose

Take booking pressure off the phone without letting the wrong things get booked online.

## Who does it

The patient, unsupervised. That is the whole design problem.

## The workflow

### Online booking

1. Patient identifies themselves — existing patients by name, DOB and a verification code sent to
   their registered mobile; new patients by completing a registration form.
2. Patient selects a reason from a **curated list** (not free text as the primary input; free
   text is allowed as an addition).
3. The system filters to appointment types that are (a) marked online-bookable and (b) valid for
   that reason.
4. Availability is shown honouring `min_notice_minutes`, `max_advance_days`, and
   `new_patients_allowed`.
5. Expected cost is shown before confirmation. Always.
6. Booking is confirmed with SMS/email.

### What must not be bookable online

- Anything the practice has flagged as requiring triage (chest pain, breathing difficulty,
  suspected fracture, mental health crisis)
- Appointment types requiring a competency the available practitioners don't hold
- Procedures requiring preparation or consent discussion
- First appointments for a new patient at a practice not accepting new patients

When a patient selects a reason that maps to a triage-required type, the flow stops and shows the
practice's message with the phone number — and, for red-flag symptoms, the direction to call 000
or attend an emergency department. This screen is written by the practice and reviewed as part of
its clinical governance.

### Waitlist

1. When no suitable slot exists, the patient (or reception) can join the waitlist with a reason,
   an urgency, preferred practitioners, and available days/times.
2. When a cancellation creates a slot, the waitlist is matched: urgency first, then preference
   fit, then time waiting.
3. Matched patients are offered the slot by SMS with a time-limited hold (default 30 minutes).
4. Unclaimed holds release the slot back to the book and move to the next match.

The waitlist is how a practice recovers the revenue and the access lost to cancellations, and how
it demonstrates a "responsive system for patient care" (GP1.1).

## Rules and constraints

1. Online booking never exposes practitioner-level clinical information.
2. A patient can hold at most N future online bookings (default 3) to prevent slot hoarding.
3. Cancellation online is permitted up to a configurable notice period; inside it the patient is
   asked to call.
4. Every online booking is flagged as such so the practice can review what's coming in.

## Data touched

`appointments`, `waitlist_entries`, `waitlist_offers`, `online_booking_sessions`,
`notifications`.

## Offline behaviour

Not applicable — online booking is by definition online. The practice-side waitlist is readable
offline.

## Standards mapping

GP1.1 Responsive system for patient care · C1.1 Information about your practice ·
C1.5 Costs associated with care · C2.3 Accessibility of services

## Feature files

`features/scheduling/online-booking.feature`, `features/scheduling/waitlist.feature`
