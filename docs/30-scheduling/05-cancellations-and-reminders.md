# Cancellations, Reschedules and Appointment Reminders

**Status:** `specified`

## Purpose

Recover cancelled capacity, reduce DNAs, and make sure a reminder never becomes a privacy breach.

## Who does it

Receptionist, the patient (online or by SMS reply), and the system (automated reminders).

## The workflow

### Cancelling

1. A cancellation records who cancelled (patient / practice / system), when, and a reason.
2. Cancelling with less than the configured notice period marks it `late_cancellation`, tracked
   separately from a courteous one.
3. The freed slot is immediately offered to the **waitlist**.
4. If the appointment was linked to an open recall, care plan review, or a follow-up on a
   significant result, the cancellation **does not close that loop** — the underlying recall stays
   open and is escalated. This is the single most important rule on this page.

### Rescheduling

Rescheduling preserves the appointment's identity and its links (recall, care plan, referral),
and records the original time. A rescheduled appointment is not a cancel-plus-new-booking, because
that breaks the audit trail of how long a patient waited for a clinically-needed follow-up.

### Practice-initiated cancellation

When a practitioner is unexpectedly away, the affected list is generated and worked through with
bulk actions: reschedule to another practitioner, reschedule to another day, or cancel with an
apology message. Every affected patient is individually accounted for and the list is not
dismissible until each one is resolved.

### Reminders

| Timing | Channel | Content |
|---|---|---|
| At booking | SMS/email | Confirmation with date, time, practitioner, location, expected cost |
| 48 hours before (configurable) | SMS | Reminder with confirm/cancel reply options |
| 2 hours before (optional) | SMS | Final reminder |

Reminder content rules, which exist because reminders go to phones other people can see:

1. **Never include the reason for the visit.** Ever.
2. Never include a diagnosis, medication or result.
3. Include only: practice name, date, time, practitioner name (configurable — some practices omit
   this for sensitive services), location.
4. Send only on channels the patient has consented to, checking consent **at send time**.
5. Respect quiet hours (no SMS before 8am or after 8pm local time).
6. A patient can opt out of reminders entirely without opting out of recalls, which are a
   different obligation.

### Reply handling

`YES` confirms, `NO` cancels and releases the slot to the waitlist. Anything else is routed to
reception as a message — a free-text reply to an appointment reminder is often a patient telling
you something clinically important, and it must not be discarded.

## Rules and constraints

1. Cancelling an appointment never closes an underlying recall.
2. Late cancellation and DNA are distinct and separately reported.
3. Reminders check consent at send time, not at schedule time.
4. All sent reminders are logged with content, channel, timestamp and delivery status.
5. Practice-initiated cancellations require every affected patient to be resolved individually.

## Data touched

`appointments`, `appointment_status_history`, `notifications`, `notification_deliveries`,
`waitlist_entries`, `recalls`, `consents`.

## Offline behaviour

Cancellation and reschedule queue offline. Reminders are server-side and unaffected.

## Standards mapping

GP1.1 Responsive system for patient care · GP2.2 Follow-up systems · C6.3 Confidentiality and
privacy · C1.2 Communications

## Feature files

`features/scheduling/cancellation-and-reschedule.feature`,
`features/scheduling/appointment-reminders.feature`
