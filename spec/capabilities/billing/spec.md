# Billing and invoicing

## Dependencies

- Domains: [appointment](../../domain/appointment.md), [billing](../../domain/billing.md), [claim](../../domain/claim.md), [invoice](../../domain/invoice.md), [patient](../../domain/patient.md), [practitioner](../../domain/practitioner.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Receptionists, billers, managers and permitted practitioners convert rendered services into transparent internal accounts, record payments and track manual payer claims.

## Primary tasks

Review billing handoff; choose payer arrangement/item/fee; apply authorised override; preview/issue invoice; record partial/full payment or reversal; issue receipt; create/mark manual claim; record rejection/acceptance/payment; manage debtors/credits/voids.

## Inputs and outputs

Consumes encounter/service and practitioner/location snapshots, local billing items/dated fee schedules, patient/liable party. Produces BillingEpisode, Invoice, Payment and Claim.

## Constraints

Billing cannot alter clinical record; MBS local snapshot not guaranteed current; bulk billing distinct; itemised account content; patient/claimant distinction; issued lines immutable; no external submission/payment processing.

## Out of scope

Medicare/DVA/insurer connectivity, Tyro/payment gateways, bank reconciliation and accounting integration.

## Rules

Billing follows dated local catalogues and fee schedules with explainable precedence. Historical lines snapshot source. Private, bulk-billing, third-party and no-charge arrangements are explicit. Invoice issue is immutable; corrections use void/credit/reissue. Payment and claim state are independent. Version 1 manual claims/status never imply payer confirmation. A cancellation fee is a local service item, never a rendered Medicare attendance.

## Interactions

Consultation completion can open checkout with patient, practitioner, location and service context prefilled, but does not create an invoice automatically. Billing uses a dated local item/fee snapshot and explicit payer/claimant choice. Payment allocates to invoice balances through a reversible ledger. Version 1 records bulk-billing or claim preparation status only and never represents external submission or acceptance.

## Permissions

Billing view, prepare, fee override, invoice issue/adjust, payment record/reverse, claim manage and financial report/export are separate. A practitioner may propose items without viewing all account history; reception may bill without clinical note access. High-value override/refund thresholds may require secondary approval. All overrides and reversals are audited.

## Screen contracts

### Screen contract: Billing checkout

#### Purpose and actors

Lets authorised staff turn a completed/no-charge service handoff into a transparent invoice/payment/claim record without exposing clinical notes.

#### Entry/layout

From at-billing waiting room or patient account. Regions: patient/liable party and service context; rendering practitioner/location/date; payer arrangement; item/fee lines; totals and expected patient amount; warnings/overrides; issue invoice; record payment; optional manual claim status.

#### Required information

Patient, service date, rendering practitioner/location snapshot, each item code/description/source/effective version, fee/quantity/amount, adjustments, total/paid/owing, payer/claimant and informed-cost variance note where relevant. Bulk billing/private/no-charge are explicit choices.

#### Behaviour

Handoff may contain practitioner-proposed items but biller validates against local policy; no clinical text is exposed. Fee schedule resolution is explainable. Override requires permission/reason. Invoice preview shows exact itemised account. Issue fixes snapshots; payment is a subsequent recordable transaction. Claim action is manual and clearly labelled.

#### States/failure

Draft/unbilled, validation conflict, issued-unpaid/part-paid/paid, void/reissue. Failure issuing leaves draft and appointment at billing. Failure recording payment does not change balance or produce receipt. Idempotent retry avoids duplicate invoice/payment.

#### Permissions/accessibility

View/prepare/override/issue/payment/claim permissions separate. Financial warnings and totals are accessible and not colour-only; keyboard order supports rapid line entry/review.

### Screen contract: Patient account

#### Purpose

Shows financial history and balance for the authorised user without mixing it into the clinical timeline.

#### Required information/layout

Patient/liable-party context; balance summary with as-of time; invoices list; selected invoice line snapshot; payments/allocations/reversals; credits/voids; internal claims/status history; receipts/documents; filters by date/status/payer/location.

#### Actions

Open/print invoice/receipt, record or reverse payment, apply credit/adjustment, void/reissue under rules, create/update manual claim, export authorised account statement.

#### States/failure

Zero balance is distinct from no account history. Totals must reconcile; if projection is stale/mismatched, mutation is disabled and authoritative refresh offered. Partial claim-status failure cannot change invoice balance. Clinical-only users see this only with billing permission.
