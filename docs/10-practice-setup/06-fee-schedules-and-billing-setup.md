# Fee Schedules and Billing Setup

**Status:** `built`

## Purpose

Establish what the practice charges, to whom, and under which arrangement — before anyone tries
to bill anything. In Australian general practice this is genuinely complicated, and getting it
wrong is either a revenue leak or a compliance problem.

## Who does it

Practice Owner or Practice Manager.

## The workflow

### 1. Choose a billing policy

| Policy | Meaning |
|---|---|
| `bulk_bill_all` | Every eligible service is bulk billed. Required if participating in BBPIP. |
| `mixed` | Bulk bill for concession/children/nominated cohorts, private otherwise |
| `private` | Private billing with a gap; patient claims from Medicare |

If **BBPIP** participation was recorded during onboarding, `bulk_bill_all` is enforced and the
UI restates the obligation: the practice must bulk bill **100% of eligible services** to receive
the additional **12.5%** incentive on MBS benefits for eligible services, split 50/50 between the
practice and the practitioner. A single private bill on an eligible service puts that at risk, so
the billing screen will warn at the point it happens.

### 2. Seed fee schedules

Four are created automatically from the MBS reference catalogue:

| Schedule | Basis | Editable |
|---|---|---|
| **Bulk Bill (MBS)** | 100% of the MBS benefit; no patient contribution | No — locked to MBS |
| **Private** | MBS schedule fee × a practice multiplier, rounded | Yes, per item |
| **DVA** | DVA fee schedule | No |
| **WorkCover** | State WorkCover schedule | Yes, per item |

A fifth, **Non-Medicare**, is created empty for the practice's own items: travel vaccination
consult, commercial drivers' medical, pre-employment medical, insurance report, iron infusion
consumables, dressings, non-rebatable cosmetic work.

### 3. Set the practice multiplier and rounding

The Private schedule is generated as `schedule_fee × multiplier`, rounded to the nearest $5 by
default. Individual items can be overridden. The system shows the resulting **gap** (fee minus
Medicare benefit) next to each item, because the gap is what the patient actually experiences and
what has to be disclosed under **C1.5**.

### 4. Concession and cohort rules (mixed billing)

Define which patients are bulk billed under a `mixed` policy:

- Commonwealth concession card holders
- Pension concession card holders
- Children under 16
- DVA card holders
- Aboriginal and Torres Strait Islander patients
- Patients over 65
- Named patients (a per-patient billing override)

These rules resolve at billing time into a suggested payer, which the biller can override with a
reason.

### 5. Bulk billing incentives

Configure whether incentive items are auto-suggested when the patient and service qualify. The
incentive landscape changed on **1 November 2025** with BBPIP; the practice's participation state
and MyMedicare registration both feed the suggestion.

### 6. Practitioner remuneration

Per practitioner: `percentage_of_billings` (with the percentage and whether it is of gross or net
of service fee), `salary`, or `sessional`. Used by the practitioner earnings report and to split
the BBPIP loading 50/50.

### 7. Payment methods and banking

Which payment methods the practice accepts (EFTPOS, card-not-present, cash, direct deposit,
account), the Medicare Minor ID used for claiming per location, and the bank account for
settlement. Banking is modelled but not integrated in the prototype.

## Rules and constraints

1. The Bulk Bill schedule cannot be edited — it *is* the MBS benefit.
2. Fee schedule items are versioned by effective date. Repricing an item does not reprice an
   invoice already raised.
3. Every fee schedule item must resolve to either an MBS item or a practice-defined item.
4. Under `bulk_bill_all`, raising a private invoice for an eligible service requires an explicit
   reason and is reported.
5. Informed financial consent (C1.5) must be obtainable before the service: the booking screen
   can show the expected cost for the appointment type.

## Data touched

`fee_schedules`, `fee_schedule_items`, `mbs_items`, `practice_billing_settings`,
`billing_cohort_rules`, `practitioner_remuneration`, `payment_methods`, `bank_accounts`.

## Offline behaviour

Fee schedules and the MBS catalogue are cached for offline billing. Edits are online-only.

## Standards mapping

C1.1 Information about your practice · C1.5 Costs associated with care initiated by the practice ·
C3.1 Business operation systems

## Feature files

`features/practice-setup/fee-schedules.feature`, `features/practice-setup/billing-policy.feature`,
`features/billing/bulk-billing-incentive-setup.feature`
