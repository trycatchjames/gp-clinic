# Product design system

## Outcome

The interface helps Australian general-practice staff move quickly without losing patient,
practitioner, location, record, responsibility, or save context. It should feel calm and assured
under pressure: professional enough for clinical work, warm enough for a community practice, and
distinctive without becoming decorative.

This directory is the single normative visual and reusable-component contract. Capability screen
contracts remain authoritative for domain meaning, protected information, permissions, and task
outcomes. Application code and component examples are implementation evidence only.

## How to use this contract

Read this file, then the smallest relevant documents:

| Change | Required design-system reading |
|---|---|
| Colour, type, spacing, icon, shape, elevation, or motion | [Principles and foundations](principles-and-foundations.md) |
| Component placement or extraction | [Composition and ownership](composition-and-ownership.md) |
| Loading, empty, save, failure, focus, selection, or destructive behaviour | [States and interaction](states-and-interaction.md) |
| Narrow layouts, density, long content, dates, numbers, or product copy | [Responsive behaviour and content](responsive-and-content.md) |
| Primitive addition or change | [Atom catalogue](atoms.md) |
| Reusable composition addition or change | [Molecule catalogue](molecules.md) |
| Component examples, fixtures, Storybook, screenshots, or QA | [Storybook and evidence](storybook-and-evidence.md) |
| Proposal, approval, adoption, deprecation, or removal | [Contributing](contributing.md) |

Before changing observable capability behaviour, also read that capability's `spec.md`,
`acceptance.feature`, `review.yaml`, and every dependency linked from its specification.

## Scope

The shared design-system library owns:

- semantic visual foundations and constrained token roles;
- accessible primitive mechanics;
- pure reusable compositions driven by props, slots, and callbacks;
- shared async, feedback, density, responsive, and content-stress behaviour; and
- executable component evidence and its traceability to this contract.

It does not own:

- patient, clinical, appointment, billing, result, recall, or other domain meaning;
- permission, purpose-of-use, tenant, or care-relationship decisions;
- API requests, generated SDK types, caching, mutations, or routes;
- capability-specific state transitions, priority, validation, or safety rules; or
- complete organism, template, page, or end-to-end behaviour.

Those facts remain with capability, domain, cross-cutting, contract, and architecture owners. A
shared component may render capability-supplied status or protected content; it MUST NOT infer that
meaning itself.

## Source, evidence, and approval

The following roles remain separate:

1. Markdown in this directory defines the reusable product contract.
2. Component source implements the contract.
3. The component gallery demonstrates meaningful states in isolation.
4. Component, browser, accessibility, and visual checks verify the implementation.
5. GitHub pull-request approval and merge record acceptance.

The gallery MUST NOT become a second source of product rules. Its descriptions may show an exact
excerpt from, or link to, this specification but MUST NOT maintain independent normative prose.
Production components MUST NOT be generated from Markdown without implementation and human review.

A branch gallery is a candidate. The corresponding gallery built from `main` represents the
accepted component set. No separate manually edited approval flag is required.

## Design-system invariants

- Atomic labels describe composition, not source folders.
- Atoms and molecules remain independent of API, authentication, permission, route, and domain
  mutation knowledge.
- Brand colour and semantic state are separate; colour never carries meaning alone.
- Selected context, responsibility, freshness, save state, and failure MUST be explicit where
  relevant.
- Empty, unavailable, restricted, offline, partial, stale, and failure states MUST NOT be made to
  look equivalent.
- Pending or locally recovered work MUST NOT look durably saved.
- Focus movement MUST NOT imply selection or clinical/operational action.
- Required identity, status, safety context, and actions MUST remain available at narrow widths and
  zoom/reflow.
- Component variants represent distinct meaning or interaction, not page-specific styling
  preferences.
- A foundation is adopted only after its contract, implementation, tests, deterministic fixture,
  gallery examples, and named evidence agree.

## Version 1 completion boundary

The Version 1 design system is sufficiently complete for systematic screen construction when every
reusable need in the accepted screen contracts is either covered by an approved atom or molecule,
or explicitly retained as a capability-owned organism, template, or page because it requires
domain, permission, route, or query knowledge.

This boundary does not remove the need for capability review. Organisms, templates, pages,
permissions, tenancy, clinical safety, and end-to-end outcomes require their own screen-contract,
acceptance, and evidence review.
