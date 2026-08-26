# Audit record

## Purpose

Audit records accountable evidence of access, change and high-risk decisions. It supports patient confidentiality, clinical governance, incident investigation and security oversight; it is not a substitute for domain history.

## Core attributes

Immutable event identifier, practice, actor/user and acting practitioner if relevant, action, target type/identifier, patient identifier when applicable, timestamp, session/request correlation, location/device/network security metadata, outcome, reason/override, permission basis, before/after summary or field names, sensitivity and chained/tamper-evidence metadata.

## Invariants

1. Audit events are append-only and ordinary application roles cannot edit/delete them.
2. A required audit write for a high-risk mutation commits atomically with the mutation; if it cannot, the mutation fails closed.
3. Audit never stores passwords, authentication secrets, full prescription tokens or unnecessary clinical free text.
4. Patient-record view events identify user, patient, time and purpose/context where required.
5. Break-glass, export, merge, clinical amendment, result disposition, prescription issue, permission change and financial override always create high-detail events.
6. Audit access is itself audited and scoped; administrators do not gain clinical content through logs.
7. Times are server-authoritative instants with preserved location/session context.
8. Domain history and audit are cross-referenceable but independently retained.
