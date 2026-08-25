# Medicare, DVA and Concession Entitlements

**Status:** `modelled`

## Purpose

Know, before the service happens, what the patient is entitled to — because it determines what
can be billed, whether a bulk-bill incentive applies, and whether the patient is about to get an
unexpected bill.

## Who does it

Receptionist at booking and at arrival; the biller at the point of billing.

## The workflow

### At registration

Record Medicare card number, IRN, expiry; DVA file number and card colour; concession card type,
number and expiry; private health fund details; and any safety net registration.

### At arrival

The arrival screen shows entitlement status with three states:

| State | Meaning | Action |
|---|---|---|
| `verified` | Checked and current | Proceed |
| `unverified` | Recorded but never checked, or check is stale | Prompt to sight the card |
| `expired` / `invalid` | Card expired or check failed | Must resolve before bulk billing |

In the prototype, verification is a **manual "card sighted" action** with a timestamp and the
staff member's identity. The Medicare online eligibility check is an integration and is out of
scope, but the data model and the UI states are built to accept it — `verification_method` is
already an enum with `online_check` as a value.

### Expiry monitoring

Cards approaching expiry are surfaced:
- On the appointment book, as a small badge on the appointment
- On the arrival screen
- As a bulk report for the practice manager ("47 Medicare cards expiring in the next 30 days")

### What entitlement drives

| Entitlement | Effect |
|---|---|
| Valid Medicare card | MBS billing possible at all |
| Concession/pension card | Bulk-bill incentive eligibility; mixed-billing cohort rules |
| Under 16 | Bulk-bill incentive eligibility; mixed-billing cohort rules |
| **MyMedicare registration** | Chronic condition management items; longer telehealth items; from 1 Nov 2025, bulk billing incentive eligibility |
| DVA Gold card | Full DVA billing, no patient contribution |
| DVA White card | DVA billing for accepted conditions only |
| No Medicare (visitor, some visa classes) | Private billing only; reciprocal health care agreement noted if applicable |

The billing screen resolves all of this into a **suggested payer** and shows *why* it suggested
that, so the biller can disagree with a reason rather than guess.

## Rules and constraints

1. Bulk billing an eligible service requires a valid Medicare or DVA entitlement recorded.
2. Entitlement checks have a staleness window (default 90 days) after which the status reverts to
   `unverified`.
3. A patient with no Medicare entitlement must be given a written estimate before the service —
   this is the sharpest case of C1.5.
4. Entitlement numbers are treated as sensitive: masked in list views, full value only on the
   detail view, and every reveal is audit-logged.

## Data touched

`patient_entitlements`, `entitlement_verifications`, `audit_log_entries`.

## Offline behaviour

Cached read. Manual "card sighted" can be queued. Online verification, when it exists, cannot.

## Standards mapping

C1.5 Costs associated with care initiated by the practice · C3.1 Business operation systems ·
C6.4 Information security

## Feature files

`features/patient-management/entitlement-verification.feature`,
`features/patient-management/entitlement-expiry.feature`
