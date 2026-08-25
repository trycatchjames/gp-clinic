# Chronic Condition Management

**Status:** `specified`

## Purpose

Support the structured, longitudinal care of patients with chronic conditions — the work that
consumes most of general practice's capacity and generates a significant share of its revenue.

This workflow changed materially on **1 July 2025** and the software must handle the transition.

## What changed on 1 July 2025

GP Management Plans (MBS 721) and Team Care Arrangements (MBS 723) were **replaced** by the
**GP Chronic Condition Management Plan (GPCCMP)**:

| Purpose | New item | Replaced |
|---|---|---|
| Prepare a GP Chronic Condition Management Plan | **965** | 229, 721, 92024, 92055 (GPMP) and 230, 723, 92025, 92056 (TCA) |
| Review a GP Chronic Condition Management Plan | **967** | 732 |

Key consequences:

- The plan is now **one artefact**, not a GPMP plus a separate TCA.
- The items are **linked to MyMedicare registration** where the patient is registered; patients
  not registered can still receive the items from their usual GP.
- **Transition:** patients with a GPMP and/or TCA in place before 1 July 2025 can continue to
  access allied health and other services consistent with those plans **until 1 July 2027**.

So the data model holds **both** plan shapes concurrently, and the UI is explicit about which one
a patient is on and what that means for their allied health allocation.

## Who does it

GP leads; Practice Nurse does much of the preparation, data gathering and review coordination.

## The workflow

### Identifying eligible patients

The system surfaces patients with a chronic condition (coded, present or likely to be present for
at least six months) who have no current plan, or whose plan is due for review. Common drivers:
diabetes, COPD, asthma, ischaemic heart disease, heart failure, chronic kidney disease, arthritis,
cancer, stroke, mental illness.

### Preparing a plan (MBS 965)

1. **Assess** — current conditions, medications, results, functional status, risk factors, the
   patient's own goals and priorities.
2. **Agree goals** with the patient. This is a shared-decision-making step, and the plan records
   the patient's goals in their words, not just clinical targets.
3. **Set management actions** — what the patient will do, what the practice will do, and by when.
4. **Identify the care team** — allied health, specialists, other providers.
5. **Arrange allied health services** — referrals generated from the plan, tracked against the
   patient's annual allocation.
6. **Give the patient a copy.** Required, and it's also the whole point.
7. **Set the review date.**

### Reviewing a plan (MBS 967)

Progress against each goal, changes in condition or medication, results since the last review,
allied health services used and their reports, and a revised plan. The review is a substantive
clinical activity, and the software's job is to put last time's plan and everything that happened
since on one screen.

### Related structured care

- **Diabetes cycle of care** — the schedule of checks (HbA1c, BP, lipids, eyes, feet, kidney
  function, weight, self-care education) with due dates and completion tracking
- **Asthma cycle of care** — including a written **asthma action plan**
- **Heart health checks**
- **Home Medicines Review** — referral to an accredited pharmacist, report returned and actioned
- **Health assessments** — see [11-health-assessments.md](11-health-assessments.md)

## Rules and constraints

1. A patient can hold one active GPCCMP at a time.
2. Plan preparation and review items have minimum interval requirements; the software surfaces
   when the next claim is permissible and does not let a claim be raised early without an
   override and a reason.
3. **MyMedicare registration status is shown at the point of planning**, because it affects the
   pathway.
4. The patient must receive a copy of the plan; the system records that this happened.
5. Legacy GPMP/TCA plans remain visible and their allied health allocations remain tracked until
   1 July 2027.
6. Allied health referrals under a plan cannot exceed the patient's annual allocation without an
   explicit override.

## Data touched

`care_plans`, `care_plan_goals`, `care_plan_actions`, `care_plan_team_members`,
`care_plan_reviews`, `care_plan_allied_health_allocations`, `cycle_of_care_schedules`,
`referrals`, `conditions`, `patient_mymedicare_registrations`, `invoices`.

## Offline behaviour

Plans are readable offline. Preparing and reviewing can be drafted offline; the associated MBS
claim queues.

## Standards mapping

GP2.1 Continuous and comprehensive care · GP2.3 Engaging with other services ·
C5.1 Diagnosis and management of health issues · C1.3 Informed patient decisions ·
C4.1 Health promotion and preventive care

## Feature files

`features/clinical/chronic-condition-management-plan.feature`,
`features/clinical/care-plan-review.feature`,
`features/clinical/gpmp-tca-transition.feature`,
`features/clinical/diabetes-cycle-of-care.feature`
