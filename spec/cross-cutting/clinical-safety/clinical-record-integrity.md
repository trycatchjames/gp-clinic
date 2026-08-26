# Clinical-record integrity

## Drafts

- Drafts identify patient, author, encounter and last durable/local save time.
- Autosave never marks a draft completed. Patient switching/close/navigation protects unsaved text.
- If server save conflicts, both versions are preserved and shown for deliberate resolution; no free-text auto-merge.

## Completion and amendments

- Completion fixes an attributable version and timestamp, and produces a content hash/version reference suitable for audit.
- Post-completion changes are new amendments naming the source entry and reason. Timeline/exports show that an amendment exists and let authorised users read both.
- A late entry records event date/time separately from entry date/time and is visibly labelled.
- Entered-in-error suppresses current clinical use only after reasoned authority; the original remains available to authorised reviewers.

## Derived summaries and documents

- Health summaries are derived from current domain status with provenance; they are not independent editable copies.
- Generated documents/prescriptions/referrals retain immutable renditions and template/version references.
- A correction to source data does not silently alter previously issued artefacts; the system identifies potentially affected downstream records for review.

## Migration/import

Imported data retains source system, import batch, source identifier, transformation version and uncertainty. Validation failures go to a visible exception queue. Import cannot forge native authorship or “verified” status.
