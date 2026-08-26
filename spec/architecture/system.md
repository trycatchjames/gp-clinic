# System architecture constraints

## Purpose

Architecture serves the product/domain and may be implemented as a modular monolith, services or another topology. This specification does not select language, framework, database, message broker, cloud or deployment model.

## Logical layers

```text
User capabilities and screen contracts
        ↓ commands / queries
Application orchestration and authorisation
        ↓ invokes
Domain owners and invariants
        ↓ persist/publish through
Infrastructure ports (storage, files, audit, notifications, future adapters)
```

UI never owns a clinical or financial rule. Infrastructure never decides a lifecycle. Domain operations receive an authenticated practice/user context and return explicit outcome/errors.

## Core system properties

- practice tenant isolation;
- server-side authorisation and invariant enforcement;
- explicit transaction/idempotency/concurrency boundaries;
- append-only audit and completed clinical history;
- stable identifiers and versioned contracts;
- read models may compose domains but cannot become alternative write owners;
- future external integrations enter through adapters and reconciliation queues, never direct writes to domain storage;
- no external system is required for Version 1 core correctness.

## Reliability boundary

The system of record comprises committed domain state, domain history, immutable document versions and required audit. Cache, search index, report projection and notification are rebuildable. A mutation is successful only when its system-of-record transaction and required audit are durable.

## Trust boundaries

Browser/client, application boundary, file processing, administrative tooling, reporting/export, backup and future external adapters are separate trust zones. Patient/clinical data is minimised across each. Technical operators do not obtain clinical authority from infrastructure access.
