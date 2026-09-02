# Recall and reminder

## Purpose

Recall owns a patient-specific clinical follow-up obligation and evidence of attempts/resolution. Preventive Reminder owns a routine prompt about due care. Appointment Reminder belongs to appointment communication. These concepts must not be collapsed.

## Recall attributes

Patient; clinical reason protected from reception-facing messages; reason category; source result/encounter/problem/investigation; responsible practitioner; administrative assignee; priority and due date; contact policy; status; contact attempts; linked appointments/tasks; clinical closure outcome and author.

## Preventive reminder attributes

Patient; reminder type/reason; due date; recurrence; source/rule version; communication consent/preference; offered/sent/declined/completed status and linked appointment/care activity.

## Rules

- A recall remains open through failed contacts, appointment creation, cancellation and DNA until the required clinical event occurs or an authorised clinician records a reasoned decision to cease pursuit. [RACGP-SGP5, GP2.2]
- Every contact attempt records time, channel, destination snapshot, actor, outcome and safe message/template; failed attempts count as history, not completion.
- Administrative users may carry out authorised contact instructions but cannot view the protected clinical reason unless separately permitted or close clinically.
- Communication content reveals no more than necessary and checks do-not-use/consent/policy.
- Preventive-reminder non-response does not automatically create a recall. A clinician may separately create one when clinically indicated.
- Recurrence creates a new reminder cycle linked to the former one; it does not erase the prior cycle.
- Recall priority/escalation timing is practice policy approved by clinical governance, not a software diagnosis.

## Invariants

1. Every open recall has a patient, responsible clinician/team, due date, priority and source/reason.
2. Recall closure always records a clinical outcome or clinician decision, actor and time.
3. Booking attendance is evidence toward resolution, not proof of resolution.
4. Reminder opt-out cannot suppress a clinically required recall; recall communications still follow lawful safe-contact policy.
5. Task completion cannot close a recall by side effect.

## Recall and reminder states

### Recall

`open → contact_in_progress → appointment_arranged → clinically_resolved`

Alternatives: `open/contact/appointment → unable_to_contact` (still open obligation); any open state → `ceased_by_clinician`.

`unable_to_contact` is a work/escalation state, not closure. A cancellation or DNA returns `appointment_arranged` to `contact_in_progress` and records escalation. Only `clinically_resolved` and `ceased_by_clinician` are closed states.

### Preventive reminder

`due → offered/sent → appointment_arranged → completed`; alternatives `declined`, `opted_out`, `expired` according to practice policy. Non-response may remain due/expired without pursuit. Each transition preserves communication evidence.
