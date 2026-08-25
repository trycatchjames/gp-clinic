# Practitioner Earnings and Remuneration

**Status:** `specified`

## Purpose

Australian GPs are usually contractors paid a percentage of their billings, not employees on a
salary. Getting the pay run right — and being able to show the practitioner exactly how it was
calculated — is a recurring source of friction that good software eliminates.

## Who does it

Practice Manager runs it; each practitioner sees their own.

## Remuneration models

| Model | Calculation |
|---|---|
| `percentage_of_billings` | A percentage of receipts, either of gross billings or net of a service fee |
| `salary` | Fixed, with billings tracked for reporting only |
| `sessional` | A rate per session worked |
| `hybrid` | A base plus a percentage above a threshold |

## The workflow

1. **Define the arrangement** per practitioner: model, percentage, whether it applies to gross or
   net, the service fee percentage, GST treatment, and effective dates. Arrangements are versioned
   so a mid-year change doesn't rewrite history.
2. **Accrue** — earnings accrue on **payment received**, not on invoice raised. A claim rejected
   three weeks later must not have already been paid out.
3. **Include the BBPIP split** — where the practice participates, the 12.5% incentive is split
   50/50 between the practice and the GP, and the practitioner's half appears as its own line.
4. **Run the period** (fortnightly or monthly): total receipts attributable to the practitioner,
   less any deductions (service fee, medical indemnity if the practice pays it, equipment, leave
   arrangements), plus incentive splits.
5. **Produce a statement** the practitioner can actually check: every invoice, every payment,
   every deduction, with the arithmetic shown. This is what stops the monthly argument.
6. **Recognise adjustments**: rejected claims previously paid out, refunds, write-offs, and
   corrections, each shown as a line rather than silently netted off.

## Reporting

Per practitioner: billings by payer, by item, by session; average billing per consultation;
bulk-billing percentage; consultations per session; DNA rate; and the earnings statement.

Per practice: revenue by practitioner, by location, by payer, by item; the practice's
bulk-billing percentage against the BBPIP threshold; the unbilled-appointment exception list.

## Rules and constraints

1. Earnings accrue on payments received, never on invoices raised.
2. Remuneration arrangements are versioned by effective date.
3. Every statement line traces back to a specific invoice and payment.
4. Adjustments appear as explicit lines, never as silent netting.
5. A practitioner sees their own earnings and no one else's.
6. Statements are immutable once issued; corrections are new statements referencing the original.

## Data touched

`practitioner_remuneration`, `earnings_periods`, `earnings_statements`,
`earnings_statement_lines`, `payments`, `invoices`, `deductions`, `incentive_allocations`.

## Offline behaviour

Online-only.

## Standards mapping

C3.1 Business operation systems · C3.2 Accountability and responsibility

## Feature files

`features/billing/practitioner-earnings.feature`, `features/billing/earnings-adjustments.feature`
