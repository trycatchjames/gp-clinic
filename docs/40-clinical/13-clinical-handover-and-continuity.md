# Clinical Handover and Continuity

**Status:** `specified`

## Purpose

RACGP **C5.3 (Clinical handover)** requires the practice to have a system for handing over care
safely. **GP2.1** requires continuous and comprehensive care. Continuity in general practice is
not a nice-to-have — it is the mechanism by which the specialty works.

## Where handover actually happens

| Handover | Risk | System response |
|---|---|---|
| GP to GP within the practice (leave, part-time) | Outstanding results, open recalls, pending referrals fall through | Coverage assignment with an explicit inbox and task handover |
| GP to after-hours / deputising service | The covering clinician has no context | Offline-capable summary; after-hours report returns and is actioned |
| Practice to hospital (admission, ED) | Medicines and allergies unknown at the point of admission | Current health summary, printable and shareable |
| Hospital to practice (discharge) | Discharge summary read and filed but not acted on | Discharge summary triggers a **reconciliation and action** task, not just filing |
| GP to specialist and back | Referral loop never closes | Open referral tracking |
| Practitioner leaving the practice | Results and recalls orphaned | Offboarding checklist blocks removal until reassigned |
| Shift handover at reception | Escalations and messages lost | Message queue with acknowledgement, not sticky notes |

## The workflows

### Planned absence

When a practitioner is going on leave, the system produces a coverage plan:

- Who covers their results inbox (must be a named practitioner)
- Who covers their recalls and tasks
- What to do with their appointments
- The dates

Nothing is left to "the practice will handle it". The coverage assignment is time-bounded and
reverts automatically.

### Discharge summaries

A discharge summary arriving from a hospital creates a task, not just a document. The GP must
record:

- Medication changes reconciled into the current medicines list
- New diagnoses added to the problem list
- Follow-up actions required and by when
- Whether a post-discharge review appointment is needed (and it usually is, within 7 days)

Only then is the summary marked actioned.

### Usual GP and continuity measurement

Every patient has a nominated **usual GP** (and, where applicable, a MyMedicare-registered
practitioner). The practice can measure continuity: the proportion of a patient's visits with
their usual GP. Low continuity is not automatically bad — but it should be visible.

## Rules and constraints

1. A practitioner's absence cannot be recorded without a coverage assignment for results and
   recalls.
2. Discharge summaries and specialist letters are tracked to **actioned**, not to **read**.
3. Practitioner offboarding cannot complete with unactioned results or open recalls assigned to
   them.
4. Handover summaries always include current medicines, allergies and active problems.
5. After-hours encounter reports are tracked to acknowledgement by the usual GP.

## Data touched

`coverage_assignments`, `results`, `recalls`, `tasks`, `documents`, `medication_reconciliations`,
`appointments`, `patients`.

## Offline behaviour

Handover summaries are generated from cached data offline. Coverage assignment is online-only.

## Standards mapping

C5.3 Clinical handover · GP2.1 Continuous and comprehensive care · GP2.2 Follow-up systems ·
GP2.3 Engaging with other services · GP2.4 Transfer of care

## Feature files

`features/clinical/clinical-handover.feature`,
`features/clinical/discharge-summary-actioning.feature`,
`features/clinical/practitioner-absence-coverage.feature`
