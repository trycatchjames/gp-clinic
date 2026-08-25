# Health Assessments

**Status:** `specified`

## Purpose

Structured, MBS-funded assessments for defined populations. They are substantial pieces of
nurse-and-GP work with specific content requirements, and they are frequently the entry point to
chronic condition management.

## Who does it

Practice Nurse or Aboriginal Health Practitioner does most of the information gathering; the GP
does the assessment, the plan and the discussion with the patient.

## The MBS items

| Items | Assessment | Duration tier |
|---|---|---|
| **701** | Brief health assessment | Under 30 minutes |
| **703** | Standard health assessment | 30 to under 45 minutes |
| **705** | Long health assessment | 45 to under 60 minutes |
| **707** | Prolonged health assessment | 60 minutes or more |
| **715** | **Aboriginal and Torres Strait Islander health assessment** | Any age, annually |

The 701–707 tiers cover the defined health assessment types, including the **75 years and older**
health assessment, the 45–49 year type 2 diabetes risk assessment, assessments for people with an
intellectual disability, refugee and humanitarian entrant assessments, and former ADF members.

Item **715** is separate, applies to Aboriginal and Torres Strait Islander patients of any age,
and is claimable annually. It is one of the highest-value preventive activities in Australian
general practice and the software should make it easy to identify who is eligible — which requires
ATSI status to be recorded for every patient, which is why registration insists on asking.

## The workflow

1. **Identify eligibility.** The system flags eligible patients by age, ATSI status and last
   assessment date, both on the register and opportunistically at arrival.
2. **Book appropriately** — a health assessment appointment type with a nurse pre-appointment
   where the practice works that way.
3. **Gather information** (nurse): observations, measurements, medication review, immunisation
   status, screening status, functional assessment, home safety (75+), continence, falls risk,
   cognition, mood, social supports, carer arrangements, advance care planning status.
4. **Assess** (GP): review the gathered information, examine as indicated, form an overall
   assessment.
5. **Produce the outcome**: a written summary for the patient with identified issues,
   recommendations and agreed actions.
6. **Act**: referrals, a chronic condition management plan where indicated, immunisations,
   screening, recalls.
7. **Record and bill** the correct item for the actual duration and type.

## Rules and constraints

1. Minimum time requirements apply per item tier; the software records actual duration and
   suggests the tier, and warns if the claimed item exceeds the recorded time.
2. Frequency limits apply per assessment type (e.g. 715 annually); the software shows the next
   eligible date and blocks early claiming without an override.
3. A health assessment requires a written outcome given to the patient — recorded as done.
4. Eligibility for 715 depends on recorded ATSI status, so "not stated" patients are surfaced for
   the practice to ask again respectfully.
5. The assessment content requirements per type are presented as a structured template so nothing
   required is missed.

## Data touched

`health_assessments`, `health_assessment_items`, `observations`, `risk_factors`,
`immunisations`, `care_plans`, `referrals`, `invoices`, `patients`.

## Offline behaviour

Assessments can be drafted offline; the billing claim queues.

## Standards mapping

C4.1 Health promotion and preventive care · C2.1 Respectful and culturally appropriate care ·
GP2.1 Continuous and comprehensive care · QI1.3 Improving clinical care

## Feature files

`features/clinical/health-assessment.feature`,
`features/clinical/atsi-health-assessment.feature`
