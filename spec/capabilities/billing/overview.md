# Billing and invoicing

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
