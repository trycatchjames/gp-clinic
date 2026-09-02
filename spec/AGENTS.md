# Working in the authoritative specification

This file gives agents operating instructions for everything under `spec/`. It explains how to navigate and change the specification; it is not a substitute for the normative product requirements.

Start with [`../SPEC.md`](../SPEC.md). If this file conflicts with `SPEC.md`, an accepted ADR, a domain invariant or a cross-cutting safety requirement, the higher-authority specification governs and the conflict must be resolved before implementation proceeds.

## Purpose and scope

The `spec/` tree is the authoritative Version 1 product and system specification for an Australian general-practice platform. It describes product behaviour and implementation constraints, not the current prototype.

Version 1 specifies the complete internal practice-management and clinical core. External services—including Medicare connectivity, electronic prescribing exchanges, My Health Record, AIR, diagnostic-provider interfaces, secure messaging, online booking, payment processing and accounting integrations—are future boundaries only. Agents must not introduce protocols, vendor SDK assumptions, externally confirmed statuses or simulated-success behaviour into Version 1.

## Layout

| Area | Purpose | Read when |
|---|---|---|
| [`product/`](product/) | Vision, scope, principles, people, terminology, workflows and quality requirements | Beginning any product change or resolving terminology/scope |
| [`research/`](research/) | Australian sources, workflow observations and unresolved questions | Making an Australian-specific claim or encountering uncertainty |
| [`domain/`](domain/) | Concept ownership, attributes, relationships, invariants and lifecycles | Creating or changing stored meaning or state transitions |
| [`capabilities/`](capabilities/) | User outcomes, rules, interactions, permissions, screens, acceptance and review evidence | Changing observable user behaviour |
| [`cross-cutting/`](cross-cutting/) | Safety, privacy, security, authorisation, audit, accessibility and shared behaviour | Every material capability change |
| [`contracts/`](contracts/) | Stable identifiers, resource shapes, enums, events and API principles | Changing an internal interface or exchanged meaning |
| [`architecture/`](architecture/) | Ownership, dependency, data and event boundaries | Assigning responsibilities between domains or components |
| [`decisions/`](decisions/) | Accepted durable decisions and rejected alternatives | Before revisiting identity, lifecycle, audit or architecture choices |

Generated OpenAPI output and prototype code outside this tree may provide evidence, but they are not authoritative and cannot override this specification.

## Authority and language

Use the authority order in [`../SPEC.md`](../SPEC.md). In short: accepted ADRs; domain invariants and cross-cutting requirements; capability and screen rules; contracts and lifecycles; overviews and product documents; then Gherkin examples.

`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT` and `MAY` are normative. Clearly label examples, observations and open questions as non-normative. Do not turn an uncertain workflow into a requirement merely to make implementation possible.

Use canonical terms from [`product/terminology.md`](product/terminology.md). Prefer Australian general-practice language and Australian date, billing, privacy and practitioner concepts. Avoid US healthcare assumptions.

## Reading process before a change

1. Read [`../SPEC.md`](../SPEC.md), [`product/scope.md`](product/scope.md) and the relevant accepted ADRs.
2. Read the affected capability's `spec.md`, `acceptance.feature` and `review.yaml`, then follow
   every dependency linked from `spec.md`.
3. Read every domain that owns data or lifecycle state used by the capability.
4. Read applicable cross-cutting requirements, especially clinical safety, authorisation, audit, privacy, error handling and data integrity.
5. Check contracts and architecture ownership before adding a new identifier, enum, event or relationship.
6. Review [`research/sources.md`](research/sources.md) and [`research/open-questions.md`](research/open-questions.md) before asserting an Australian-specific requirement.

If requirements conflict, stop and repair the specification. Do not choose whichever interpretation is easiest to implement.

## Making a specification change

A change should begin with the user, operational or safety problem, then update every affected layer in one coherent change:

1. **Product:** update scope, terminology, workflow or quality goals when the product promise changes.
2. **Domain:** place each fact under one owner; add or amend invariants, relationships and valid/invalid lifecycle transitions.
3. **Capability:** specify actors, inputs, outputs, rules, interactions, permissions, failures and out-of-scope behaviour.
4. **Screens:** update semantic layout, required information, actions, states, permissions, failure behaviour and keyboard behaviour where relevant. Avoid pixel or framework prescriptions.
5. **Acceptance:** add a small number of high-value Gherkin scenarios for happy paths, invalid transitions, permission boundaries and safety-critical failures. Gherkin illustrates rules; it does not replace them.
6. **Contracts and architecture:** update stable shapes, enums, ownership or dependency rules only where meaning changes.
7. **Decision record:** add or amend an ADR for a durable identity, lifecycle, safety, compatibility, ownership or architecture decision.
8. **Review evidence:** update the capability's `review.yaml` so future changes produce appropriate human and automated evidence.
9. **Research:** cite authoritative Australian sources for Australian-specific rules. Put unresolved matters in `research/open-questions.md` rather than guessing.

Material changes to behaviour, permissions, clinical safety, domain rules, APIs or screen contracts require explicit specification changes. Never weaken a requirement solely because the current implementation cannot satisfy it.

## Domain and safety rules

- Give each concept and state transition one canonical owner. Other capabilities reference that owner rather than redefining it.
- State invariants explicitly. Include actor, preconditions, invalid transitions, side effects, failure behaviour and audit consequences where material.
- Keep appointment, encounter and financial lifecycles separate.
- Keep clinical recalls, preventive/administrative reminders and staff tasks separate.
- Keep result receipt, matching, assignment, review, patient contact, follow-up and closure distinguishable.
- Use additive amendment, cancellation, supersession, quarantine or entered-in-error semantics for consequential records. Do not silently erase history.
- Treat drafts and completed/issued clinical artefacts differently. A successful-looking UI must never imply that a failed clinical or operational save persisted.
- Use granular permissions rather than job-title checks. Administrative access does not imply clinical access.
- Do not invent clinical decision-support rules without a validated knowledge source and clinical-safety review.

## Review and validation process

Before completing a specification change:

- confirm all affected terminology and state names are consistent;
- check local Markdown links and source identifiers;
- parse every changed `review.yaml` as YAML;
- confirm Gherkin files contain valid features and meaningful scenarios;
- check that screen contracts include empty, loading, failure and unavailable states where applicable;
- verify permissions, audit consequences and failed-save behaviour;
- check that no US-centric assumption or external integration leaked into Version 1;
- confirm no domain concept has acquired multiple owners;
- review changes against the evidence categories in each affected `review.yaml`;
- record genuine clinical, operational, legal or integration uncertainty in [`research/open-questions.md`](research/open-questions.md).

The final change summary should identify affected domains and capabilities, material decisions, research basis, validation performed and unresolved questions. Specification work must not modify application code unless the user separately asks for implementation.
