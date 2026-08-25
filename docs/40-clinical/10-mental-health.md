# Mental Health

**Status:** `specified`

## Purpose

General practice provides the majority of mental health care in Australia. The workflow has a
specific MBS structure (Better Access), a specific training gate, and a set of safety
requirements that the software must handle without turning a sensitive consultation into a form.

## Who does it

GP, GP Registrar. Referral to psychologists, psychiatrists and other providers.

## The MBS structure — and the training gate

| Purpose | Items |
|---|---|
| Prepare a **GP Mental Health Treatment Plan** | **2700 / 2701** (by duration), or **2715 / 2717** |
| Review a plan | Review items |
| Mental health consultation | Dedicated attendance items |

**2715 and 2717 attract a higher schedule fee but require the GP to have completed Mental Health
Skills Training accredited by the GPMHSC.** All GPs can access 2700/2701; only MHST-trained GPs
can access 2715/2717.

This is one of the most frequently miscoded areas in general practice, so the software enforces
it: the `mental_health_skills_training` flag on the practitioner profile determines which items
are offered, and the higher items simply do not appear for a practitioner without the flag.

## The workflow

### Preparing a GP Mental Health Treatment Plan

1. **Assessment**: presenting concerns, history, mental state examination, risk assessment,
   relevant physical health, substance use, social circumstances and supports.
2. **Outcome measure** — a validated tool (K10, DASS-21, PHQ-9, EPDS in the perinatal context),
   recorded with its score so change can be measured at review.
3. **Risk assessment** — suicide and self-harm risk, risk to others, risk from others. Documented,
   with the safety plan if one is needed.
4. **Diagnosis or formulation.**
5. **Goals and treatment plan**, agreed with the patient.
6. **Referrals** — psychologist, mental health social worker, occupational therapist,
   psychiatrist. Track sessions used against the patient's allocation.
7. **Crisis plan**: what the patient does if things get worse, including after-hours contacts and
   crisis lines. Recorded and given to the patient.
8. **Review date.**

### Reviewing

Repeat the outcome measure, compare, review progress against goals, review medication, review
risk, and revise the plan.

### Risk and safety

- Risk assessment is a **distinct, timestamped record**, not a paragraph in a note, so that it can
  be found instantly and its currency assessed.
- A patient assessed at elevated risk generates a follow-up obligation with an escalation ladder
  like a recall — a DNA on a mental health follow-up is a safety event.
- Crisis contacts are on the patient's record where any clinician, including after-hours cover,
  can find them.

### Sensitivity

Mental health information is health information with additional stigma risk. Practically:

- Appointment reminders never mention the reason (a general rule, doubly enforced here)
- Practices may configure some appointment types to omit the practitioner name from reminders
- The consultation note carries the same access controls as everything else — reception cannot
  read it
- A patient can request that specific information not be included in a shared health summary or
  My Health Record upload, and that restriction is honoured and recorded

## Rules and constraints

1. MBS items 2715/2717 are only offered where the practitioner holds MHST.
2. A mental health treatment plan requires a recorded outcome measure and a recorded risk
   assessment.
3. Elevated-risk patients generate a tracked follow-up that cannot be closed administratively.
4. Session counts against the patient's allocation are tracked and shown before further referral.
5. Crisis plan contact details are surfaced on the patient banner to clinical users.

## Data touched

`care_plans` (type `mental_health`), `outcome_measures`, `risk_assessments`, `safety_plans`,
`referrals`, `referral_session_allocations`, `recalls`, `practitioners`.

## Offline behaviour

Plans and risk assessments are readable offline and can be drafted offline. Elevated-risk
follow-up creation is online-only — the software will not let a safety obligation sit in a queue.

## Standards mapping

C5.1 Diagnosis and management of health issues · C1.3 Informed patient decisions ·
C2.1 Respectful and culturally appropriate care · GP2.2 Follow-up systems ·
C6.3 Confidentiality and privacy · QI3.1 Managing clinical risks

## Feature files

`features/clinical/mental-health-treatment-plan.feature`,
`features/clinical/mental-health-item-eligibility.feature`,
`features/clinical/risk-assessment.feature`
