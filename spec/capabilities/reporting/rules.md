# Reporting rules

- Every report declares purpose, audience, inclusion criteria, exclusions, measures and an `as_of` time.
- Counts reconcile to canonical record owners; drill-through uses the same permission filters as the source capability.
- Small-cell, sensitive cohort and re-identification risks are controlled before display or export.
- Export requires explicit permission, purpose and audit and contains a generated-at timestamp and filter summary.
- Reports do not mutate records, determine diagnoses or silently submit data externally.
