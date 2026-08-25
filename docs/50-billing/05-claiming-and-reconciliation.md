# Claiming, Reconciliation and Banking

**Status:** `specified`

## Purpose

Get the money in, know when it hasn't arrived, and know why. This is the workflow that quietly
determines whether a practice is profitable, and it is where most practice management software is
weakest.

## Who does it

Practice Manager, daily.

## The claim lifecycle

```
 draft ──► submitted ──► processing ──► accepted ──► paid
   │                          │             │
   │                          ▼             ▼
   │                      rejected      part_paid
   │                          │             │
   └──────── corrected ◄──────┴─────────────┘
                │
                └──► resubmitted ──► ...
```

Every state change is timestamped. The **age of the oldest unpaid claim** is a headline number on
the practice dashboard.

## The workflow

### Submission

- Bulk-billed and DVA claims are batched and submitted (in the prototype, batches are generated
  and marked as submitted manually — the Medicare Web Services integration is out of scope).
- Each batch has an ID, a submission timestamp, a service date range and a claim count.
- Patient claims lodged on the patient's behalf are submitted individually.

### Processing rejections

Rejections arrive with a reason code. The system groups them by reason, because rejections cluster
— one wrong provider number produces forty rejections, and fixing the root cause fixes all forty.

Common causes the software actively prevents:

| Rejection cause | Prevention |
|---|---|
| Wrong provider number for the location | Provider numbers are per practitioner **per location**, selected automatically |
| Patient Medicare details invalid or expired | Entitlement currency checked at arrival and at billing |
| Item not claimable by that practitioner | MHST gating; practitioner kind restrictions |
| Invalid item combination | Co-claiming rules checked before the invoice is issued |
| Duplicate service | Duplicate detection on same patient + item + date |
| Frequency limit exceeded | Next-eligible-date shown for frequency-limited items |

### Reconciliation

1. A payment advice arrives (a remittance from Medicare, DVA or an insurer).
2. Payments are matched to claims: automatically where the reference matches, manually otherwise.
3. **Underpayments and unmatched payments are surfaced, not absorbed.** A claim paid at less than
   the expected benefit is an exception requiring a decision.
4. Reconciled claims close; unreconciled ones age and escalate.

### End of day

The daily close covers:

- Cash count against recorded cash payments, with a variance explanation if they differ
- EFTPOS settlement against recorded card payments
- Total billings by practitioner, by payer and by item
- Unbilled completed appointments — **the single most valuable report in the product**, because it
  is pure recovered revenue
- Claims ready to submit
- Banking summary

### Banking

Deposits recorded against the practice's bank accounts per location, with a reconciliation state.
Bank feed integration is out of scope for the prototype; the model supports it.

## Rules and constraints

1. Every claim references the invoice lines it covers; nothing is claimed twice.
2. Payments are matched to claims and never left unallocated without a reason.
3. Rejections are grouped by cause, and a rejection that recurs generates a systemic-issue alert.
4. Cash variance requires an explanation and an authoriser.
5. Unbilled completed appointments are reported daily and cannot be dismissed without action.
6. Claim and payment history is immutable.

## Data touched

`claims`, `claim_batches`, `claim_items`, `claim_rejections`, `payments`, `remittances`,
`reconciliations`, `banking_deposits`, `daily_close_records`, `invoices`.

## Offline behaviour

Reconciliation and claiming are **online-only**. Offline, invoices accumulate and the sync
indicator shows how many are awaiting submission.

## Standards mapping

C3.1 Business operation systems · C3.2 Accountability and responsibility

## Feature files

`features/billing/claim-submission.feature`, `features/billing/claim-rejections.feature`,
`features/billing/payment-reconciliation.feature`, `features/billing/end-of-day.feature`,
`features/billing/unbilled-appointments.feature`
