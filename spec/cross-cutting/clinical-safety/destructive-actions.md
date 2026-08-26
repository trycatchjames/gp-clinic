# Destructive and corrective actions

## General contract

Before a destructive/corrective action, the system shows the exact target, patient/context, consequence, retained history, downstream effects and safer alternative. High-risk actions require a reason; merge, bulk action, clinical entered-in-error and certain financial reversals require elevated permission or second-person confirmation.

## Prohibited ordinary actions

- hard-delete completed clinical entries, issued prescriptions/referrals/investigations, received results, recalls, issued invoices, payments or audit;
- rewrite authorship/time/provenance;
- silently cascade-delete linked responsibilities;
- bulk change clinical status without per-record outcome evidence;
- overwrite concurrent changes.

## Allowed semantics

- administrative drafts: discard with recovery/audit policy;
- appointments: cancel, DNA, reschedule or entered-in-error;
- clinical content: amend or mark entered-in-error while retaining original;
- documents/results: quarantine/archive/entered-in-error, never erase while retention applies;
- financial: void, credit, reverse or reissue with links;
- patient: inactive, deceased or merged with lineage.

Failure leaves all targets unchanged and reports which operation failed. A bulk operation is atomic where partial success would be unsafe; otherwise it returns itemised success/failure and never implies total success.
