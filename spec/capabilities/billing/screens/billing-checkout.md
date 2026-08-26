# Screen contract: Billing checkout

## Purpose and actors

Lets authorised staff turn a completed/no-charge service handoff into a transparent invoice/payment/claim record without exposing clinical notes.

## Entry/layout

From at-billing waiting room or patient account. Regions: patient/liable party and service context; rendering practitioner/location/date; payer arrangement; item/fee lines; totals and expected patient amount; warnings/overrides; issue invoice; record payment; optional manual claim status.

## Required information

Patient, service date, rendering practitioner/location snapshot, each item code/description/source/effective version, fee/quantity/amount, adjustments, total/paid/owing, payer/claimant and informed-cost variance note where relevant. Bulk billing/private/no-charge are explicit choices.

## Behaviour

Handoff may contain practitioner-proposed items but biller validates against local policy; no clinical text is exposed. Fee schedule resolution is explainable. Override requires permission/reason. Invoice preview shows exact itemised account. Issue fixes snapshots; payment is a subsequent recordable transaction. Claim action is manual and clearly labelled.

## States/failure

Draft/unbilled, validation conflict, issued-unpaid/part-paid/paid, void/reissue. Failure issuing leaves draft and appointment at billing. Failure recording payment does not change balance or produce receipt. Idempotent retry avoids duplicate invoice/payment.

## Permissions/accessibility

View/prepare/override/issue/payment/claim permissions separate. Financial warnings and totals are accessible and not colour-only; keyboard order supports rapid line entry/review.
