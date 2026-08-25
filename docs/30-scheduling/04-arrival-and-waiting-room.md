# Arrival, Waiting Room and Patient Flow

**Status:** `modelled`

## Purpose

Track a patient from front door to leaving, so the GP knows who is waiting, reception knows who
has been waiting too long, and nothing gets missed between the consultation ending and the
patient paying.

## Who does it

Receptionist, Practice Nurse, GP.

## The appointment status lifecycle

```
  booked ──► confirmed ──► arrived ──► with_nurse ──► waiting ──► in_consultation
     │           │            │                          │              │
     │           │            └──────────────────────────┘              │
     │           │                                                      ▼
     │           │                                                  completed
     │           │                                                      │
     ▼           ▼                                                      ▼
 cancelled   did_not_attend                                     billed / no_charge
```

Every transition is recorded with a timestamp and the user who made it. Those timestamps are what
produce waiting-time reporting, consultation-length analysis and MBS time-tier evidence.

## The workflow

### Arrival

1. Patient arrives; reception marks them **arrived**.
2. The arrival screen surfaces, in one view:
   - **Identity confirmation** (three identifiers — C6.1)
   - **Contact detail check** — "Is your mobile still 04…?" prompted if not confirmed in 6 months
   - **Entitlement status** — Medicare/DVA/concession card currency
   - **Outstanding account** balance, if any
   - **Front-desk alerts** — interpreter required, wheelchair, aggression risk
   - **Due activities** — care plan review due, cervical screening due, flu vaccine due,
     health assessment eligible. Reception can offer to add these to today's visit.
3. Anything requiring pre-consultation nurse work (BP, weight, spirometry, ECG, dressing) routes
   the patient to `with_nurse`.

### Waiting room

The waiting list shows, per patient: name, appointment time, wait duration, practitioner, status
and alerts. Waits over a threshold (default 20 minutes) highlight. The practitioner sees their own
column; reception sees all.

Practices that run late — all of them — need to be able to tell waiting patients the truth. The
board shows each practitioner's current running-late estimate, calculated from their actual
consultation start times today.

### Being called in

The GP marks the patient `in_consultation` from their own screen, which starts the encounter
timer. The timer matters: MBS attendance items are time-tiered (item 23 under 20 minutes, 36 at
least 20 and under 40, 44 at least 40 minutes), and the software should record actual duration
rather than ask the GP to remember.

### Completing

On completion the patient moves to `completed` and appears on the **billing queue** at reception
with the items the GP selected. The loop from consultation to payment is a handoff, not a hope.

### Did not attend (DNA)

Marked when the patient doesn't arrive within a configurable grace period. A DNA:
- Is recorded on the patient's record with a count
- May trigger an SMS ("we missed you today")
- Is surfaced to the GP if the patient had a clinically significant reason for the visit — a DNA
  for a follow-up on an abnormal result is a **safety event**, not an administrative one, and it
  feeds into the recall workflow

## Rules and constraints

1. Status transitions are validated — a patient cannot go from `booked` to `completed`.
2. `arrived` requires identity confirmation to have been acknowledged.
3. A DNA on an appointment linked to an open recall automatically escalates the recall.
4. Timestamps are immutable; a correction is a new entry with a reason, not an edit.
5. A completed appointment with no billing action after N hours appears on the practice manager's
   exception report.

## Data touched

`appointments`, `appointment_status_history`, `encounters`, `tasks`, `recalls`, `notifications`.

## Offline behaviour

**Fully supported.** Arrival, status transitions and DNA marking all queue. Status transitions
are replayed in timestamp order so the history reconstructs correctly.

## Standards mapping

GP1.1 Responsive system for patient care · C6.1 Patient identification · GP2.2 Follow-up systems ·
C2.3 Accessibility of services

## Feature files

`features/scheduling/arrival-and-waiting-room.feature`,
`features/scheduling/appointment-status-lifecycle.feature`,
`features/scheduling/did-not-attend.feature`
