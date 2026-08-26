# Data-integrity requirements

## Identifiers and references

- Every aggregate has an opaque, stable globally unique internal identifier. User-facing local numbers are separately unique within practice and not security credentials.
- Relationships reference stable identifiers, never mutable names, item descriptions or provider numbers.
- Historical snapshots are used where later master-data edits must not change meaning: invoices, issued referrals/prescriptions/investigations, correspondence recipients and provider-at-location.

## Concurrency and atomicity

- Mutable aggregates use optimistic concurrency/preconditions. A stale update returns a conflict and preserves user work.
- Cross-domain operations define transaction boundaries: result disposition plus required recall/task; encounter completion plus appointment handoff; invoice issue plus numbering/audit; merge plus redirect/lineage.
- Idempotency protects retried creates/issues/transitions.
- Referential integrity prevents orphaned responsibility and clinical/financial records.

## State and history

- State transitions use canonical enums and validate from/to, actor, preconditions and side effects.
- Domain history records before/after fields or transition facts independently from security audit.
- Empty, unknown, not asked, not applicable, declined and none-known are distinct where clinically or operationally meaningful.
- Derived/cached summaries identify source version and can be rebuilt; they are never sole authoritative storage.

## Import/export and migration

- Imports are staged, validated, reconciled and exception-reported before becoming authoritative. Source identifiers, batches and transformation versions are retained.
- Migrations changing meaning are versioned and reversible or have a tested forward-repair plan. Counts, relationships and high-risk sample records are reconciled.
- Exports are stable, versioned and include provenance/precision/status needed to interpret data without the UI.

## Failure detection

Integrity jobs detect orphaned owners, invalid transitions, duplicate active identifiers, impossible totals, unlinked corrections and audit gaps. Detection creates governed incidents/work; it never silently repairs clinical content.
