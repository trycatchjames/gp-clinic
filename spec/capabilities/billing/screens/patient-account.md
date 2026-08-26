# Screen contract: Patient account

## Purpose

Shows financial history and balance for the authorised user without mixing it into the clinical timeline.

## Required information/layout

Patient/liable-party context; balance summary with as-of time; invoices list; selected invoice line snapshot; payments/allocations/reversals; credits/voids; internal claims/status history; receipts/documents; filters by date/status/payer/location.

## Actions

Open/print invoice/receipt, record or reverse payment, apply credit/adjustment, void/reissue under rules, create/update manual claim, export authorised account statement.

## States/failure

Zero balance is distinct from no account history. Totals must reconcile; if projection is stale/mismatched, mutation is disabled and authoritative refresh offered. Partial claim-status failure cannot change invoice balance. Clinical-only users see this only with billing permission.
