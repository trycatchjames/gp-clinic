# Billing

## Purpose

Billing determines the internal financial disposition of services: item selection, fee resolution, payer arrangement and transfer into invoices/claims. It consumes completed-care facts but does not own or alter clinical records.

## Concepts

- **billing item:** local stable item with description, type (`MBS_snapshot`, `practice_service`, `product`, `adjustment`), effective dates and tax treatment;
- **fee schedule:** dated prices scoped to practice/location/practitioner/payer policy with explicit precedence;
- **payer arrangement:** private patient/other liable person, bulk-billing arrangement, no charge or other configured payer;
- **billing episode:** the proposed/confirmed items and payer for an encounter;
- **payment:** recorded money allocation and reversal; no external processing in Version 1;
- **claim:** internal payer-submission tracking, manual only.

## Rules

- Fees and likely out-of-pocket cost are presented before care where practicable; post-care changes remain transparent. [RACGP-FINANCIAL-CONSENT]
- A rendering practitioner and place-of-service snapshot are retained. Provider number, where relevant, resolves for the service location/date. [SA-MBS-BILLING]
- Bulk billing is a distinct arrangement where the expected Medicare benefit is accepted as full payment; it is not represented as a private invoice silently discounted to zero. [DOH-BULKBILL]
- MBS codes/descriptions/fees are dated local reference snapshots. The product MUST NOT claim current eligibility, compliance or benefit calculation without verified maintained rules.
- Clinical completion may hand off proposed billing but reception cannot infer or edit clinical note content.
- Fee overrides, write-offs and adjustments require permission, reason and audit.
- The payer/claimant may differ from the patient; representative/payment authority is checked separately.

## Invariants

1. Historical invoices retain the item description, code, fee and reference version used at issue.
2. Financial totals equal line amounts, adjustments, payments and reversals under a documented rounding policy.
3. A cancelled/DNA appointment cannot be billed as a rendered Medicare service; any practice cancellation fee is a distinct local item. [SA-MBS-BILLING]
4. No claim or payment state rewrites the clinical encounter.
5. Every override/change has actor, reason, time and before/after values.
6. External acceptance/payment is never implied in Version 1.
