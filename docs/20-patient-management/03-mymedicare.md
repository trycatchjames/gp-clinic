# MyMedicare Registration

**Status:** `modelled`

## Purpose

MyMedicare is voluntary patient registration with a single practice, and since 1 July 2025 it is
load-bearing: it gates the GP Chronic Condition Management Plan items, longer MBS-funded
telehealth, the General Practice in Aged Care Incentive, and — from 1 November 2025 — bulk billing
incentive eligibility for registered patients.

For the software this means MyMedicare status is not a checkbox in a settings page. It is an
attribute the billing engine, the care planning workflow and the telehealth workflow all read.

## Who does it

Receptionist or Practice Manager initiates; the patient consents; the registration is confirmed
through Medicare (an integration, out of scope for the prototype — recorded manually here).

## The workflow

1. **Identify candidates.** The system flags patients who have had **two or more face-to-face
   visits** with the practice in the previous 24 months and are not yet registered. This is the
   eligibility signal the practice can act on.
2. **Explain and obtain consent.** The patient is told what registration means: continuity with
   this practice, access to the chronic condition management items here, longer telehealth,
   and that it is voluntary and reversible.
3. **Nominate a preferred GP** within the practice.
4. **Record the registration**: status (`not_offered`, `offered`, `pending_patient_action`,
   `registered`, `declined`, `withdrawn`, `moved_to_other_practice`), effective date, preferred
   practitioner, and the consent record.
5. **Maintain it.** Registration is surfaced on the patient banner and in the billing screen. If
   a patient's registration lapses or moves, dependent workflows (care plans, telehealth item
   eligibility) update their prompts.

## What it unlocks in the software

| Feature | Behaviour when registered | Behaviour when not |
|---|---|---|
| GPCCMP (MBS 965/967) | Offered as the primary care planning path, linked to the registered practice | Still available from the usual GP, but the UI states the difference |
| Longer telehealth items | Offered | Restricted item set |
| GP in Aged Care Incentive | Eligible where the patient is in an RACF | Not eligible |
| Bulk billing incentive (from 1 Nov 2025) | Eligible | Standard rules |
| Continuity reporting | Patient counted against their registered GP | Counted against usual GP if recorded |

## Rules and constraints

1. A patient can be registered with **one practice only**.
2. Registration requires patient consent, recorded with a timestamp and the staff member who
   obtained it.
3. Withdrawal is immediate and does not require a reason.
4. BBPIP participation at practice level requires MyMedicare registration at practice level — the
   two are checked together.
5. The prototype records registration state manually; the field `source` distinguishes
   `manual_entry` from a future `medicare_sync`.

## Data touched

`patient_mymedicare_registrations`, `consents`, `practice_registrations`.

## Offline behaviour

Cached read (billing needs it). Registration changes are online-only.

## Standards mapping

GP2.1 Continuous and comprehensive care · GP2.4 Transfer of care and the patient–practitioner
relationship · C1.3 Informed patient decisions

## Feature files

`features/patient-management/mymedicare-registration.feature`
