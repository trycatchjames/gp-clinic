# DVA, WorkCover, CTP and Third-Party Billing

**Status:** `specified`

## Purpose

The payers that are not Medicare and not the patient. Each has its own fee schedule, its own
paperwork, and its own way of rejecting claims.

## DVA (Department of Veterans' Affairs)

### Card types

| Card | Coverage |
|---|---|
| **Gold** | All clinically necessary health care |
| **White** | Only accepted conditions — the software records which conditions are accepted |
| **Orange** | Pharmaceuticals only |

### The workflow

1. Record the DVA file number and card colour on the patient record.
2. Billing resolves automatically to DVA for Gold card holders.
3. For **White** card holders, the service must relate to an **accepted condition** — the biller
   selects which, from the recorded list. If the service is unrelated, it bills normally under
   Medicare.
4. DVA fee schedule applies; **there is no patient co-payment**. This is absolute — a veteran must
   never be asked for a gap on a DVA-billable service.
5. DVA has its own arrangements for some services (allied health referrals, transport, aids and
   appliances) which are recorded as documents and tracked.

## WorkCover / workers' compensation

Jurisdiction-specific (each state and territory runs its own scheme).

### The workflow

1. **Open a claim context** on the patient: scheme/jurisdiction, insurer, claim number, employer,
   date of injury, injury description, and whether the claim is accepted, pending or rejected.
2. **All work-related consultations bill to the claim**, not to Medicare — mixing them is a common
   and consequential error, and the software keeps them visibly separate.
3. **Certificates of Capacity** are the core clinical artefact: the jurisdiction's form, capacity
   for work (fit / fit with restrictions / unfit), the period, restrictions, treatment plan and
   the review date. They are issued serially and the sequence is tracked so gaps are visible.
4. Invoices go to the insurer with the claim number, and are tracked as receivables against the
   insurer, not the patient.
5. Where a claim is **rejected**, previously billed services need to be re-billed — to Medicare or
   to the patient. The system produces the list rather than leaving it to be discovered.

## CTP (compulsory third party — motor vehicle)

Same shape as WorkCover: insurer, claim number, date of accident, accepted status, insurer-billed
invoices, and jurisdiction-specific forms.

## Other third parties

| Payer | Typical services |
|---|---|
| Insurers | Medical reports, examinations |
| Employers | Pre-employment medicals, fitness for work |
| Government departments | Assessments |
| Legal firms | Reports, with patient authority |
| Aged care / disability providers | Assessments, care coordination |

All are billed from the practice's non-Medicare fee schedule, tracked as receivables, and require
recorded patient consent before any clinical information is released.

## Rules and constraints

1. DVA services carry **no patient co-payment**.
2. White card services must relate to a recorded accepted condition.
3. Work-related services bill to the workers' compensation claim, never to Medicare, while the
   claim is open and accepted.
4. Claim numbers are mandatory on WorkCover and CTP invoices.
5. Certificate of Capacity sequences are tracked and gaps flagged.
6. Claim rejection produces a re-billing worklist.
7. No third-party disclosure without recorded, scoped consent.

## Data touched

`patient_entitlements`, `compensation_claims`, `accepted_conditions`, `certificates`,
`invoices`, `invoice_lines`, `payers`, `receivables`, `consents`, `documents`.

## Offline behaviour

Invoices can be raised offline. Certificates can be created and printed offline. Claim
verification and insurer submission are online-only.

## Standards mapping

C1.5 Costs associated with care · C6.3 Confidentiality and privacy · C3.1 Business operation
systems

## Feature files

`features/billing/dva-billing.feature`, `features/billing/workcover-billing.feature`,
`features/billing/certificate-of-capacity.feature`, `features/billing/third-party-billing.feature`
