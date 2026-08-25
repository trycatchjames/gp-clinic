# Results Management, Recalls and Reminders

**Status:** `specified`

## Purpose

This is the highest-risk workflow in general practice software. A clinically significant result
that is not acted on is the classic negligence case, and RACGP **GP2.2** requires the practice's
follow-up system to be designed so that the level of follow-up matches the clinical significance
of the result.

There is a legal distinction the software must never blur:

> There is **no legal duty to have a reminder system**, but GPs **do have a legal duty to recall
> patients** to inform them about clinically significant results.

So **recalls and reminders are different entities, with different rules, different escalation and
different reporting.**

## Who does it

The **ordering practitioner** is responsible for their results. Practice Nurse and reception
execute contact attempts. Practice Manager monitors the system.

## Results inbox

### Receiving

Results arrive (by secure messaging or manual entry in the prototype) and are matched to:
patient, ordering practitioner, and the originating request. Unmatched results go to an
**unmatched queue** that is worked daily and never left to accumulate.

### Reviewing

The ordering practitioner sees each result with the original indication, the patient's relevant
history, and previous values of the same test for trend. They then assign an **action**:

| Action | Meaning | What the system does |
|---|---|---|
| `no_action_normal` | Normal, nothing needed | Files, optionally notifies patient "all normal" |
| `no_action_expected_abnormal` | Abnormal but expected and already managed | Files with the reason recorded |
| `inform_patient` | Patient should be told, non-urgent | Generates a contact task |
| `routine_recall` | Patient needs to come in | Creates a **recall**, routine urgency |
| `urgent_recall` | Patient needs to come in soon | Creates a **recall**, urgent |
| `immediate_contact` | Contact now — critical result | Escalates immediately to a named person |
| `refer` | Needs specialist input | Opens the referral workflow |

Every result must be actioned. **Nothing is filed without a decision** — there is no "mark as
read".

### Critical results

Results flagged critical by the laboratory, or judged critical by the practitioner, bypass the
normal queue: immediate on-screen alert to the ordering practitioner, and if not acknowledged
within a configured window, escalation to the duty GP and then the practice principal. The
practice also needs a defined process for critical results arriving **outside opening hours** —
recorded in the practice's after-hours arrangement and surfaced to whoever is covering.

## Recalls

A recall is an obligation. It has:

- A **reason** (clinical, recorded), a **priority** (`routine`, `urgent`, `critical`), a **due
  date**, and a **responsible practitioner**
- An **escalation ladder**, configurable per priority, e.g. for urgent:
  1. SMS + phone call, same day
  2. Phone call, next day
  3. Registered letter, day 3
  4. Escalate to the responsible GP for a decision on further steps
- A **contact attempt log** — every attempt, with channel, time, who made it and the outcome
- A **closure**: the patient attended, or the practitioner recorded a clinical decision to stop
  pursuing, with a reason

Recalls survive appointment cancellations and DNAs. A DNA on a recall appointment **escalates the
recall** rather than closing it.

### Communication rules

Recall messages never state the result or the reason. They say the practice needs to speak with
the patient and ask them to call or attend. The reason is discussed with the person, verified.

## Reminders

A reminder is a population-health prompt: cervical screening due, bowel screening kit due,
diabetes cycle of care, annual flu vaccine, 75+ health assessment eligible, care plan review due.

- Generated from rules against the coded problem list, age, sex and the Red Book schedule
- Sent on consented channels only, honouring quiet hours
- No escalation ladder, no duty to pursue, patient can opt out entirely
- Surfaced opportunistically at the point of care ("due today" on the arrival screen), which is
  where they are actually most effective

## Rules and constraints

1. **Recalls and reminders are distinct entities and are never merged.**
2. Every result requires an explicit action before it is filed.
3. Unmatched results are worked daily; the age of the oldest unmatched result is on the practice
   dashboard.
4. A recall cannot be closed by an administrative action alone — closure requires either patient
   attendance or a clinician's recorded decision.
5. Every contact attempt is logged, including failed ones. "We tried" is not defensible; "we tried
   at 14:32 on 3 March by phone, no answer, message left" is.
6. When a practitioner leaves, their open results and recalls **must** be reassigned before their
   access is removed — enforced by the offboarding checklist.
7. Recall and reminder communications never disclose clinical content.

## Data touched

`results`, `result_actions`, `unmatched_results`, `recalls`, `recall_contact_attempts`,
`reminders`, `reminder_rules`, `notifications`, `tasks`, `audit_log_entries`.

## Offline behaviour

Results are readable offline. Actioning a result queues, **except** `immediate_contact`, which is
online-only and tells the user to act by phone now. Recall contact attempts can be logged offline.

## Standards mapping

GP2.2 Follow-up systems · C5.3 Clinical handover · C3.3 Emergency response plan ·
QI3.1 Managing clinical risks · QI1.3 Improving clinical care · C4.1 Health promotion and
preventive care

## Feature files

`features/clinical/results-inbox.feature`, `features/clinical/critical-results.feature`,
`features/clinical/recalls.feature`, `features/clinical/reminders.feature`,
`features/clinical/unmatched-results.feature`
