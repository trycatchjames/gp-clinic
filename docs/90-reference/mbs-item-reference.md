# MBS Item Reference (Prototype Catalogue)

**Status:** `built` — this set is seeded into the database

This is a **working subset** of the Medicare Benefits Schedule sufficient to demonstrate the
billing workflows. It is not a complete or authoritative MBS. Fees shown are indicative; the
authoritative source is [MBS Online](https://www.mbsonline.gov.au). Real deployment would ingest
the published MBS XML and update it on each schedule release.

Every item in the catalogue carries: item number, description, category, group, schedule fee,
benefit percentage, time tier (where applicable), the telehealth equivalent, flags for
`requires_mental_health_skills_training`, `requires_mymedicare`, `bulk_bill_incentive_eligible`,
and effective dates.

## GP attendances — consulting rooms

| Item | Level | Duration |
|---|---|---|
| 3 | Level A — brief | Short, obvious problem |
| 23 | Level B — standard | Less than 20 minutes |
| 36 | Level C — long | At least 20 minutes, less than 40 |
| 44 | Level D — prolonged | At least 40 minutes |

Telehealth (video and phone) equivalents exist for each level, with eligibility generally
requiring an existing relationship or MyMedicare registration.

## Out of consulting rooms

Home visits, residential aged care facility attendances and other institution attendances have
their own item structure, with fees varying by the number of patients seen at one visit.

## After hours

Separate item sets for in-hours, after-hours (unsociable) and urgent after-hours attendances.

## Chronic condition management — from 1 July 2025

| Item | Purpose |
|---|---|
| **965** | Prepare a GP Chronic Condition Management Plan |
| **967** | Review a GP Chronic Condition Management Plan |

**Replaced:** GP Management Plan items 229, 721, 92024, 92055 and Team Care Arrangement items
230, 723, 92025, 92056; review item 732.

**Transition:** patients with a GPMP and/or TCA in place before 1 July 2025 can continue to access
allied health and other services consistent with those plans until **1 July 2027**.

Linked to MyMedicare registration where the patient is registered; available from the usual GP
otherwise.

## Health assessments

| Item | Assessment |
|---|---|
| 701 | Brief — under 30 minutes |
| 703 | Standard — 30 to under 45 minutes |
| 705 | Long — 45 to under 60 minutes |
| 707 | Prolonged — 60 minutes or more |
| **715** | Aboriginal and Torres Strait Islander health assessment, any age, annually |

## Mental health — Better Access

| Item | Purpose | Gate |
|---|---|---|
| 2700 | Prepare a GP Mental Health Treatment Plan (shorter) | Any GP |
| 2701 | Prepare a GP Mental Health Treatment Plan (longer) | Any GP |
| **2715** | Prepare a GP Mental Health Treatment Plan (shorter) | **Requires GPMHSC-accredited Mental Health Skills Training** |
| **2717** | Prepare a GP Mental Health Treatment Plan (longer) | **Requires GPMHSC-accredited Mental Health Skills Training** |

Review and mental health consultation items also exist. **Items 2715 and 2717 attract a higher
schedule fee than 2700/2701 and are only accessible to GPs who have completed Mental Health Skills
Training** — the prototype gates them on the practitioner's `mental_health_skills_training` flag.

## Bulk billing incentives

Incentive items apply to eligible services for eligible patients, tiered by practice location
(metropolitan / regional / rural / remote). From 1 November 2025 the incentive was extended to all
Medicare-eligible patients registered with MyMedicare, and the **Bulk Billing Practice Incentive
Program** added a **12.5% loading** on MBS benefits for practices that bulk bill 100% of eligible
services — see [50-billing/02](../50-billing/02-medicare-bulk-billing.md).

## Other item groups modelled

- Practice nurse and Aboriginal health practitioner items
- Immunisation-associated items
- Procedural items (excisions, suturing, cryotherapy, ECG, spirometry, wound care)
- Antenatal and postnatal items
- Case conferencing
- Medication management review referral
- Non-MBS practice items: commercial drivers' medicals, pre-employment medicals, insurance
  reports, travel vaccination consultations, non-rebatable procedures

## How the catalogue is used

1. **Item suggestion** at the point of billing, from encounter duration, type and what was done
2. **Fee schedule generation** — the Bulk Bill schedule is locked to the MBS benefit; the Private
   schedule is derived by multiplier
3. **Eligibility gating** — MHST items, MyMedicare-linked items, frequency limits
4. **Co-claiming validation** — which items may be claimed together
5. **Repricing safety** — items are versioned by effective date so historical invoices don't
   reprice
