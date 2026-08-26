# Invoice lifecycle

`draft → issued → partially_paid → paid`; `issued|partially_paid → overdue`; `draft → discarded`; `issued → voided`; any issued state may have `credited` adjustments.

- Draft totals may change and are not accounts.
- Issue fixes number and line snapshots.
- Payment allocation moves status deterministically from balance.
- Overdue is derived from due date and positive balance, not manually assigned.
- Void preserves the invoice; if a claim or payment exists the operation requires linked reversal/withdrawal recording first.
- Refund/reversal is a linked transaction, not a negative overwrite.
