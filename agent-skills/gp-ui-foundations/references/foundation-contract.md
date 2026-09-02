# UI foundation contract

## Primitive

A primitive may own:

- semantic element choice and ARIA wiring;
- focus, keyboard, pointer, open/close, and disabled mechanics;
- visual variants expressed through the existing token system;
- composable labels, descriptions, errors, and status announcements.

It must not import application routes, feature modules, generated SDK code, permissions, queries,
or domain types.

## Pure pattern

A pattern may own:

- composition and hierarchy of primitives;
- reusable density, responsive layout, and keyboard coordination;
- controlled selection, sorting, filtering, pagination, and disclosure mechanics;
- render props or slots for capability-supplied content.

It must receive data, state, labels, and callbacks from its caller. It must not decide who may see a
record, fetch data, translate a score into a domain conclusion, or mutate a domain.

## Capability-connected component

Feature code owns query and mutation state, permission-aware presentation, domain-specific rules,
and mapping generated SDK data into primitive or pattern props. A route assembles feature code into
a screen. If a proposed foundation API needs this knowledge, keep it in the feature layer instead.

## Gallery proof

The `/foundations` example should expose a stable `data-evidence` target and a named synthetic
fixture. Demonstrate enough adjacent context for a reviewer to understand the actor, task, inputs,
and outcome. Include state controls only when they help test the reusable contract; the gallery is
not a second application.

## Test split

- Component tests: semantics, accessible names/descriptions, controlled callbacks, invalid and
  disabled behaviour, and focused keyboard rules.
- Playwright: real browser focus order, keyboard completion, responsive/reflow behaviour, and
  deterministic screenshots.
- Capability tests: permission, API, tenancy, domain, and end-to-end outcomes. Those belong to the
  later capability slice.
