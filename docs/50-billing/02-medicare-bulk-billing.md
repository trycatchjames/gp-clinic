# Medicare Bulk Billing and Incentives

**Status:** `modelled`

## Purpose

Bulk billing is how most Australian general practice consultations are paid for, and the incentive
landscape changed materially on **1 November 2025**. Getting this right is the difference between
a viable practice and a struggling one.

## What changed on 1 November 2025

The **Bulk Billing Practice Incentive Program (BBPIP)**:

- Practices may **opt in** (and opt out at any time)
- Participating practices receive an **additional 12.5% incentive payment on every $1 of MBS
  benefit** earned from eligible services
- The payment is **split 50/50 between the practice and the GP**
- To qualify, a practice must **bulk bill 100% of all eligible services**
- The practice must be **registered for MyMedicare** and have added BBPIP as a program in the
  **Organisation Register**
- An accreditation exemption is available for practices whose MyMedicare program registration
  start date is 1 November 2025 or later

Separately, from 1 November 2025 the existing bulk billing incentive was extended to all
Medicare-eligible patients registered with MyMedicare.

## What the software does with this

### At practice level

- Records BBPIP participation with effective dates
- Enforces the MyMedicare precondition
- Tracks the practice's **bulk billing percentage of eligible services** continuously, and shows
  it prominently — a practice at 99.4% needs to know today, not at the end of the quarter
- Lists every private-billed eligible service as an exception with its recorded reason

### At the point of billing

- Warns before a private invoice is raised on an eligible service (see
  [01-billing-at-point-of-care.md](01-billing-at-point-of-care.md#3-the-bbpip-guard))

### At reporting time

- Estimates the incentive earned: 12.5% of MBS benefits on eligible services
- Splits the estimate 50/50 between practice and practitioner for the earnings report

## Bulk billing mechanics

1. The service is provided.
2. The patient **assigns their Medicare benefit** to the practice — captured as a signed
   assignment of benefit (digital in the prototype).
3. The practice claims the benefit from Medicare; the patient pays nothing.
4. Incentive items are added where the patient and service qualify.

## Eligibility factors the system tracks

| Factor | Why |
|---|---|
| Valid Medicare card | Precondition for any MBS claim |
| Concession/pension card holder | Bulk-bill incentive eligibility |
| Under 16 | Bulk-bill incentive eligibility |
| **MyMedicare registration** | Incentive eligibility from 1 Nov 2025; chronic condition items |
| Location (metropolitan / regional / remote) | Incentive tiering varies by location |
| Service type | Not every MBS item is an "eligible service" for BBPIP |

## Rules and constraints

1. Bulk billing requires a valid Medicare entitlement recorded and an assignment of benefit
   captured.
2. BBPIP participation requires MyMedicare registration.
3. The bulk-billing percentage is calculated on **eligible services**, not all services — the
   software distinguishes them.
4. Incentive items are suggested, never auto-added.
5. Assignment of benefit is retained with the invoice permanently.

## Data touched

`invoices`, `invoice_lines`, `assignments_of_benefit`, `practice_registrations`,
`bulk_billing_metrics`, `billing_exceptions`, `mbs_items`.

## Offline behaviour

Bulk-billed invoices can be raised offline; assignment of benefit can be captured offline;
claiming queues.

## Standards mapping

C1.5 Costs associated with care · C3.1 Business operation systems

## Feature files

`features/billing/bulk-billing.feature`, `features/billing/bbpip-participation.feature`,
`features/billing/assignment-of-benefit.feature`
