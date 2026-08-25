# Triage at Booking and Reception

**Status:** `specified`

## Purpose

The receptionist is the first clinical filter in general practice, and they are not clinically
trained. RACGP **GP1.1** requires a system that ensures patients with urgent needs are seen
appropriately, and **C8.1** requires non-clinical staff to be trained for their role. Software
can carry a lot of that load if it prompts at the right moment.

## Who does it

Receptionist, supported by a nurse or GP for escalation.

## The workflow

### Red-flag prompting at booking

When the reason for the visit is entered, the text is matched against a configured red-flag set.
On a match, the booking flow interrupts with a scripted question set and a clear instruction.

| Red flag | Prompt | Default action |
|---|---|---|
| Chest pain / chest tightness / arm or jaw pain | "Are you having chest pain right now?" | **Call 000.** Do not book. |
| Difficulty breathing, severe shortness of breath | "Are you struggling to breathe now?" | **Call 000.** Do not book. |
| Stroke symptoms (FAST): face droop, arm weakness, speech | "When did this start?" | **Call 000.** Do not book. |
| Severe bleeding, loss of consciousness, seizure | — | **Call 000.** |
| Suicidal thoughts, self-harm, mental health crisis | Scripted response + escalate to nurse/GP now | Same-day, escalate immediately |
| Baby under 3 months with fever | — | Same-day, escalate to nurse |
| Severe abdominal pain, vomiting blood, black stools | — | Same-day, escalate to nurse |
| Anaphylaxis / severe allergic reaction | — | **Call 000.** |
| Head injury with vomiting or drowsiness | — | Escalate now |
| Pregnancy with bleeding or severe pain | — | Escalate now |

Two design rules:

1. **The prompt is a script, not a decision.** Reception reads it and follows the instruction.
   They are never asked to judge.
2. **Escalation is one click** and lands with a named person (the triage nurse on duty, or the
   duty GP), not into a queue nobody owns.

### Escalation

An escalation creates an urgent task with the patient, the reason text, the reception notes and a
timestamp. It appears immediately on the nurse's and duty GP's screens with an audible alert. It
must be acknowledged; unacknowledged escalations escalate again after 2 minutes.

### Walk-ins and deteriorating patients in the waiting room

A "patient in waiting room deteriorating" action is available from the arrivals screen at all
times. It creates the same escalation and records the time — because the interval between
noticing and being seen is exactly what gets examined after an adverse event.

## Rules and constraints

1. Red-flag configuration is practice-editable but ships with a safe default set, and changes are
   version-controlled and audit-logged.
2. Red-flag prompts fire on online booking too, and there they stop the booking entirely.
3. Every fired prompt is recorded with what was shown, what reception selected, and what happened
   — this is both a safety net and QI evidence (QI3.1).
4. The software never tells a patient they are fine. It only ever escalates or books.

## Data touched

`triage_prompts`, `triage_events`, `tasks`, `appointments`, `audit_log_entries`.

## Offline behaviour

Red-flag configuration is cached so prompts still fire offline. Escalation tasks queue, but the
UI makes clear that an offline escalation must **also** be raised verbally — a queued escalation
is not an escalation.

## Standards mapping

GP1.1 Responsive system for patient care · C8.1 Education and training of non-clinical staff ·
C3.3 Emergency response plan · QI3.1 Managing clinical risks

## Feature files

`features/scheduling/triage-red-flags.feature`,
`features/scheduling/waiting-room-escalation.feature`
