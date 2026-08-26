# Data ownership and consistency

## Authoritative and derived data

- Authoritative: domain aggregates, immutable issued versions, responsibility assignments, financial transactions and audit.
- Derived: health summary, calendar layout, waiting-room view, inbox counts, search index, reports and notification badges.
- External/manual references: provenance-bearing facts that never replace the internal identifier/state.

Derived data may be eventually consistent only when the UI shows freshness and no safety decision depends on stale projection. Patient banner/allergies during prescribing, current appointment conflicts, result responsibility, invoice balance and permission decisions require current authoritative reads or validated versions.

## Tenancy and location

Practice is the tenant. All tenant-owned identifiers are checked with practice context at access. Location scopes scheduling, timezone and place of service but is not a tenant. Cross-practice transfer creates an export/import or future sharing workflow; it does not reassign tenant IDs.

## History and retention

Current state and history are both required. Soft-delete alone is not sufficient semantics: each domain uses cancel, inactive, entered-in-error, superseded, voided or merged. Retention/legal hold is policy data. Physical destruction, if ever lawful, is an exceptional governance operation outside ordinary APIs.

## Consistency levels

- strong/transactional: identity merge, appointment conflict reservation, encounter completion, prescription issue, result disposition/action creation, recall closure, invoice/payment balance, permission changes, required audit;
- eventual/rebuildable: full-text search, reporting aggregates, notification fan-out, non-critical dashboard counts;
- manual reconciliation in Version 1: payer claim outcome, dispatch/delivery, external result receipt and external immunisation/prescription status.

## Backups and exports

Backups protect the whole consistency set at a common point. Exports include contract version, practice/patient scope, generated time/timezone, provenance and hashes/manifests for files. Export does not transfer legal ownership automatically.
