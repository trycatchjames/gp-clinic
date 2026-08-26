# Invoice

## Purpose and attributes

Invoice is the immutable-at-issue itemised account for a patient/service and payer. It includes invoice number, patient, liable party/payer, rendering practitioner/place/date, issue date, line snapshots, subtotal/tax/total, payment allocations, balance, status, notes safe for the account, and adjustment/credit links.

An itemised Medicare-relevant account includes patient name, service date, charge, amount paid/owing, and item number and/or service description. [SA-MBS-BILLING]

## Invariants

1. Invoice number is unique within a practice and never reused.
2. Issued line description, code, service date, rendering practitioner/location, unit price, quantity and amount are immutable.
3. Corrections after issue use void/reissue, credit or adjustment according to policy; they never rewrite the original.
4. Balance equals total less valid applied payments/credits plus valid debits, using the specified currency/rounding policy.
5. Payment reversal preserves original payment and creates a linked reversal.
6. A zero-balance invoice is not necessarily bulk billed; payer arrangement is explicit.
7. Void requires permission/reason and is blocked or reconciled when payments/claims exist.
8. Clinical content beyond what is required for the item/account is not exposed on invoices.
