# Specification change map

Use this map to find obligations. It does not change the authority order in `SPEC.md`.

| Change signal | Inspect and update when affected |
|---|---|
| Product promise, actor, workflow, terminology, or scope | `spec/product/` |
| Stored meaning, relationship, invariant, or lifecycle | Owning `spec/domain/<domain>.md` file |
| Observable task behaviour | Full `spec/capabilities/<capability>/` bundle |
| Screen information, actions, states, or keyboard behaviour | Capability `screens/` contracts |
| Permission or restricted-data behaviour | Capability `permissions.md`; cross-cutting authorisation, privacy, audit, and security |
| Failed save, conflict, destructive action, or consequential history | Cross-cutting clinical safety, data integrity, and error handling; owning domain invariants |
| Identifier, enum, resource shape, or event meaning | `spec/contracts/` and the owning domain |
| Responsibility or dependency boundary | `spec/architecture/`; add/amend an ADR when durable |
| Australian-specific or time-sensitive rule | `spec/research/sources.md`; reverify the primary source or record an open question |
| External service, protocol, or confirmed remote status | `spec/product/future-integrations.md`; keep it outside the Version 1 core |

## Capability bundle

For an affected capability, read all of:

- `spec.md`, including every linked dependency;
- `acceptance.feature`;
- `review.yaml`.

Follow links from those files into owning domains, cross-cutting requirements, contracts, accepted
ADRs, and research. Do not rely on a filename list alone when the documents link to additional
authority.

## Acceptance example quality

Each scenario should demonstrate one consequential behaviour with an identifiable actor or
permission context, a meaningful trigger, and externally observable results. Prefer one to three
scenarios for a delivery-sized outcome. Add examples for these risks when applicable:

- forbidden role or purpose;
- cross-practice identifier;
- invalid or stale lifecycle transition;
- ambiguous patient context;
- failed persistence or conflict;
- destructive or irreversible consequence;
- unavailable or partial dependency;
- information disclosure through restricted, empty, or error states.

Avoid scenarios that assert implementation details, repeat prose line by line, or prove only that a
page renders.

## Review evidence

Select evidence that lets a reviewer observe the changed contract. Screenshots demonstrate named
states; flows demonstrate interactions and recovery; fixtures make the state deterministic. Add
specialist review lanes only when the change creates that review obligation. Never claim evidence
that was not generated from the reviewed head with synthetic data.
