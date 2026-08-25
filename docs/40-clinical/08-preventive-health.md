# Preventive Health and Screening

**Status:** `specified`

## Purpose

General practice is responsible for a **population**, not just for whoever walks in — that is
Domain 3 of the RACGP curriculum. RACGP **C4.1** requires the practice to have a system for health
promotion and preventive care. The reference is the **RACGP Red Book** (Guidelines for preventive
activities in general practice, 10th edition), which includes an age-based lifecycle chart.

## Who does it

Practice Nurse typically drives it; every clinician acts on prompts opportunistically.

## The two modes

### 1. Opportunistic (at the point of care)

When a patient is in front of a clinician for any reason, the system shows what is **due** based
on age, sex, coded conditions and risk factors. It appears on the arrival screen (so reception can
offer it), and in the consultation header.

The prompt list is short and ranked. A screen full of amber flags gets ignored; three ranked
prompts get acted on.

### 2. Systematic (population registers and recall)

Registers of patients due for an activity, worked through by the nurse, generating reminders.
The Red Book explicitly identifies systematic register-and-recall as appropriate for childhood
immunisation and for cervical, breast and colorectal cancer screening, and for diabetes.

## The activities the software tracks

| Activity | Population | Notes |
|---|---|---|
| **Childhood immunisation** | Per the National Immunisation Program schedule | Reported to AIR; separate ATSI schedule |
| **Cervical screening** | National Cervical Screening Program | Includes **self-collection** as an option — the software must offer it, since it is the reason many under-screened patients participate |
| **Bowel cancer screening** | National Bowel Cancer Screening Program | Kit-based; track sent, returned, result |
| **Breast screening** | BreastScreen | Women can self-refer for biennial mammography from age 40 |
| **Cardiovascular risk assessment** | Per Red Book age thresholds | Absolute risk calculation, not single risk factors |
| **Diabetes risk (AUSDRISK)** and screening | Per Red Book | |
| **Smoking status and cessation** | All patients | Status must be current; brief intervention recorded |
| **Alcohol** (AUDIT-C) | All adults | |
| **Immunisation — adult** | Influenza, COVID-19, pneumococcal, shingles, dTpa | Age and risk-group driven |
| **Osteoporosis / falls risk** | Older adults | |
| **Developmental and health checks in children** | Per schedule | |
| **75+ health assessment** | Age 75+ | MBS 701–707 |
| **Aboriginal and Torres Strait Islander health assessment** | All ages, ATSI patients | MBS 715, annually |

### The governing principle

The Red Book is explicit that **screening is only recommended where evidence shows benefit
outweighs harm.** The software prompts against guidelines; it does not invent prompts, and it lets
a practice turn off activities it has a clinical reason not to pursue — with that reason recorded.

## Declines and exclusions

A patient who declines an activity, or for whom it is not applicable (hysterectomy and cervical
screening; a patient in palliative care and bowel screening), is recorded as `declined` or
`not_applicable` with a reason and a review date. They stop appearing on the due register.

This matters enormously in practice: a register that keeps nagging about something the patient has
declined three times destroys trust in every other prompt.

## Rules and constraints

1. Prompts are guideline-driven and each carries its source, visible on hover.
2. Declines and exclusions are recorded, respected, and reviewable.
3. Screening results feed back into the register — a returned bowel screening kit closes the
   activity and sets the next due date.
4. Reminders honour consent and quiet hours, like all patient communication.
5. Preventive activity completion rates are reported for QI purposes (QI1.3).

## Data touched

`preventive_activities`, `preventive_activity_status`, `reminders`, `risk_factors`,
`observations`, `immunisations`, `screening_results`, `conditions`.

## Offline behaviour

Due-activity prompts are computed from cached data and shown offline. Recording completion queues.

## Standards mapping

C4.1 Health promotion and preventive care · QI1.3 Improving clinical care ·
QI2.1 Health summaries · GP2.1 Continuous and comprehensive care

## Feature files

`features/clinical/preventive-health-prompts.feature`,
`features/clinical/cervical-screening.feature`, `features/clinical/bowel-screening.feature`,
`features/clinical/preventive-declines.feature`
