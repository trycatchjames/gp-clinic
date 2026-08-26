# Dependency rules

## Allowed

- Capability/UI depends on application commands/queries and published contracts.
- Application orchestration depends on domain interfaces and cross-cutting policy services.
- Domain logic depends on its own entities/value objects and small shared primitives.
- Infrastructure implements ports defined inward and translates storage/external failures to canonical errors.
- Reporting/search consume published read contracts/events and may query authorised projections.

## Forbidden

- UI or controllers enforcing the only copy of a domain invariant;
- one domain writing another domain's tables/objects directly;
- clinical domains depending on billing/claim state to determine clinical truth;
- appointment status completing a recall/result/consultation by inference;
- reporting/search indexes acting as authoritative mutation stores;
- future adapter identifiers as primary internal identifiers;
- templates or generated documents as the only stored clinical data;
- role-name string checks instead of permission decisions;
- current master-data lookup changing historical issued artefacts;
- silent last-write-wins on patient, clinical, responsibility or money state.

## Change discipline

A new cross-domain dependency documents owner, direction, failure behaviour, transaction consistency and privacy surface. A dependency that changes ownership or creates a cycle requires an ADR.

## Integration seam

Future adapters may translate incoming messages into an ingestion envelope, but matching and domain acceptance occur inside the core. Outgoing adapters receive immutable issue snapshots and report delivery/outcome facts back; they never edit the authored record.
