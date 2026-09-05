# Composition and ownership

## Atomic model

Atomic design is a composition vocabulary, not a second source hierarchy.

| Atomic level | Repository owner | Contract |
|---|---|---|
| Foundation | global tokens and styles | semantic colour, type, spacing, shape, elevation, motion, and icon rules |
| Atom | `apps/web/src/components/ui` | one accessible semantic or interaction primitive with token-based variants |
| Molecule | `apps/web/src/components/patterns` | a pure composition driven entirely by props, slots, and callbacks |
| Organism | `apps/web/src/features/<capability>/components` | permission-, query-, and domain-aware composition for a capability task |
| Template | capability route/layout | responsive placement of organisms and persistent task context |
| Page | capability route plus data | one real actor, permission set, state, and user outcome |

Do not add `atoms/`, `molecules/`, or `organisms/` directories alongside these ownership layers.
Storybook may use atomic names in its navigation without changing source ownership.

## Clinical workspace composition

The default desktop shell has three possible regions:

1. a quiet, compact left navigation;
2. a dominant main clinical workspace; and
3. an optional narrow contextual sidebar.

The third region exists only for context or actions that genuinely benefit from remaining visible,
such as current appointment context, critical alerts, patient demographics, or frequent
consultation actions. It MUST NOT become another dashboard column of equally weighted cards. At
narrow widths, the capability screen contract decides whether this context moves inline or into an
accessible disclosure.

Within the main workspace, prefer semantic page sections, grouped headings, aligned rows, compact
tables, whitespace, and subtle dividers. Use `Card` only when a contained surface has real semantic
purpose, such as independent selection, elevation, or a distinct interaction boundary. A section
does not require a card merely because it needs grouping. Avoid grids of interchangeable widgets
when the staff task has a clear sequence or information hierarchy.

Patient-record screens follow this visual order without moving clinical meaning into a shared
component: patient identity, clinical safety summary, primary navigation, current clinical
information, and supporting history. The capability remains responsible for patient identity,
allergy meaning, permissions, freshness, and clinical state.

## Dependency rules

Atoms and molecules MUST remain independent of:

- generated SDK or domain resource types;
- authenticated user or practice context;
- permission, purpose-of-use, or care-relationship decisions;
- route state, query clients, network requests, or persistence;
- domain lifecycle transitions or clinical calculations; and
- capability-specific mutation or audit orchestration.

A molecule receives data, labels, state, and callbacks from its caller. It may own stable semantic
structure, interaction coordination, selection mechanics, sorting/filtering controls, density,
responsive behaviour, or state presentation. It MUST NOT decide which records exist, which content
is protected, which actor may act, what priority means, or whether a domain transition is valid.

Organisms map capability data, permissions, and domain rules into atom and molecule contracts.
Routes assemble organisms into templates and pages. An organism MUST reuse shared mechanics rather
than forking their appearance or accessibility, but it remains capability-owned when it needs
higher-layer knowledge.

## Choosing the owner

Use the lowest layer that can own the behaviour without learning application data or rules:

1. Keep native markup and existing atoms when they already express the need.
2. Add or change an atom for a stable primitive semantic, interaction, or visual variant.
3. Add or change a molecule for a stable composition, responsive, density, or coordination contract.
4. Keep the component in a capability when its API would otherwise expose permission, domain,
   query, route, or mutation knowledge.

Markup repetition alone is not evidence for extraction. A repeated fragment becomes a foundation
only when it owns a stable reusable contract and at least one accepted screen requires it. A
component does not become generic merely because domain data is renamed to abstract props.

## Promotion and adoption

Before promotion into the shared library:

- name the staff task or safety need;
- link the originating capability screen contract;
- show why native markup or an existing foundation is insufficient;
- define controlled inputs, callbacks, slots, semantics, states, keyboard behaviour, responsive
  behaviour, evidence, and exclusions; and
- identify existing consumers and migration when changing a de facto shared fragment.

The foundation MUST be specified and demonstrated in the component gallery before another
capability makes it the standard. A capability may adopt a new foundation in the same delivery
slice only when the foundation is a lower layer, the combined change remains independently
reviewable, and the foundation evidence is complete. Otherwise the foundation lands first.

## Capability-owned examples

Patient banners, allergy meaning, billing totals, appointment transitions, result priority,
clinical warnings, record amendments, and restricted-data decisions are organisms even when their
layout uses `ContextBanner`, `SummaryList`, `Badge`, `Alert`, or another foundation. Calendar grids,
clinical editors, document viewers, and charts normally begin as capability-owned components;
extract only domain-neutral mechanics after an accepted contract proves reuse.

## Public API discipline

- Prefer controlled values and callbacks when state affects a wider task.
- Accept slots or render functions for capability content instead of importing capability modules.
- Add a variant only for a stable semantic or interaction distinction.
- Do not expose raw colour, spacing, radius, or shadow selection as public props.
- Preserve native attributes and ref/focus behaviour needed for composition.
- Use concise names based on meaning rather than the first screen that consumes the component.
- Breaking changes require a consumer inventory, migration, updated evidence, and deprecation before
  removal where safe.
