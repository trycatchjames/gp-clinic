---
name: gp-ui-foundations
description: Create or evolve accessible reusable GP Clinic UI primitives and pure patterns, demonstrate their meaningful states in /foundations, and capture deterministic visual and keyboard evidence. Use when a capability needs a shared design-system component before connected feature work; do not use for API-connected screens or one-off styling.
compatibility: Requires the GP Clinic web app, React, Tailwind CSS, shadcn-derived primitives, Vitest, and Playwright.
---

# Evolve the UI foundation

Build the smallest reusable UI capability required by an approved screen contract. Design serves a
dense, high-throughput Australian general-practice workflow; visual polish must improve hierarchy,
clarity, and state recognition rather than compete with the task.

Before editing, read `SPEC.md`, `AGENTS.md`, `apps/web/AGENTS.md`,
`spec/product/design-system.md`, the relevant capability screen contract and `review.yaml`, and
[the foundation contract](references/foundation-contract.md).

## Choose the owning layer

Use the lowest layer that can own the behaviour without learning application data or rules:

- `apps/web/src/components/ui`: accessible interaction mechanics, DOM semantics, and visual
  variants;
- `apps/web/src/components/patterns`: reusable compositions controlled entirely by props and
  callbacks;
- capability feature code: API/query state, permissions, and domain orchestration. This layer is
  outside this skill.

Do not extract a component merely because markup repeats once. A foundation addition must own a
stable interaction, semantic, density, responsive, or state-display contract needed by the current
approved behaviour. Keep API calls, generated SDK types, authenticated context, permissions, route
state, and domain mutation out of primitives and patterns.

Use atomic design as a composition vocabulary, not another directory tree: primitives are atoms,
pure patterns are molecules, capability-connected components are organisms, and routes supply
templates/pages. Keep the authoritative inventory and visual decisions in
`spec/product/design-system.md`; do not create per-component Markdown unless a complex public
contract genuinely cannot be expressed there and in the component API.

## Define the contract before styling

Identify:

- the staff task and information that leads the hierarchy;
- controlled inputs, callbacks, slots, and semantic labels;
- normal, loading, empty, dense, disabled, invalid, failure, offline, unavailable, selected, and
  restricted states that are relevant;
- keyboard order, focus movement, activation, escape/recovery, and announcements;
- narrow viewport and zoom/reflow behaviour;
- the synthetic fixture and named evidence that prove the contract.

Focus movement must not imply selection. Colour, hover, drag, truncation, or iconography must never
be the only carrier of meaning or action. A failure must not look like a successful empty result,
and a pending save must not look durable.

## Implement and demonstrate

1. Inspect existing primitives, patterns, tokens, and gallery examples before adding an API or
   variant.
2. Implement the minimal public interface with accessible native semantics or the existing
   shadcn-derived primitive.
3. Add focused component tests for semantics, controlled behaviour, and keyboard interaction.
4. Add a deterministic synthetic fixture that covers the meaningful states without real patient,
   staff, practice, or credential data.
5. Demonstrate the component or pattern on `/foundations` before capability code adopts it.
6. Extend the relevant Playwright flow to exercise the main keyboard path, focus visibility,
   selection distinction, and reflow. Capture the named current-head screenshots at a fixed
   viewport with animations and service workers disabled.
7. Inspect the rendered result at desktop and narrow widths using
   [the visual-quality pass](references/visual-quality.md), then fix the implementation and
   recapture evidence when a defect is visible.
8. Update the authoritative foundation inventory when adding, renaming, or removing a public atom
   or molecule.

Keep product copy short and task-specific. Reuse design tokens and established spacing, type, and
colour decisions. Do not introduce a parallel component library, token vocabulary, or page-specific
variant to avoid fixing a shared contract.

## Validate and hand off

Run the affected component tests and Playwright project while iterating, then `pnpm gate` before a
PR handoff. Report the owning layer, public contract, gallery fixture, screenshot/flow paths,
commands actually run, and any unresolved accessibility or product question. Do not claim the
API-connected capability works; this skill proves only the reusable foundation.
