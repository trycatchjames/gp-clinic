# Claim

## Purpose

Claim is the internal record that invoice lines are intended for a payer benefit/reimbursement and tracks manual preparation/submission/outcome. It is not an integration and does not calculate legal eligibility.

## Core attributes

Payer type; patient/claimant; invoice and line snapshots; rendering practitioner/location/provider identifier snapshot; service details; status; prepared/submitted/outcome times and actors; external/manual reference; rejection/review reason; resubmission lineage; expected/received benefit where manually recorded.

## Rules and invariants

- “Ready” means locally complete, not eligible or accepted by the payer.
- Manual submission requires user confirmation of method/date/reference; the system labels it user-recorded.
- Accepted and paid are distinct. Payment allocation to invoice remains a separate financial transaction.
- A rejection never deletes or mutates the invoice; correction uses a new claim version and, if needed, a governed invoice adjustment.
- Each claim line maps to exactly one issued invoice line snapshot and cannot be included in two concurrently active claims for the same payer purpose.
- Provider/practice location facts are preserved from service time.
- Version 1 offers no transmit, eligibility, status polling or automatic reconciliation.
