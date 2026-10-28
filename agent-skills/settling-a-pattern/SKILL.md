---
name: settling-a-pattern
description: Settle or revise a GP Clinic UX pattern — the reusable answer to one product problem a screen has to solve — and the components that implement it, with gallery states and deterministic evidence. Use when a capability needs a shared answer before connected feature work, or when a second screen exposes a better shape; do not use for API-connected screens or one-off styling.
compatibility: Requires the GP Clinic web app, React, Tailwind CSS, shadcn-derived primitives, Vitest, and Playwright.
---

# Settle a pattern

A pattern is the reusable answer to one product problem a screen has to solve: where a task
happens, how a record's history reads, what saving says, what an empty result means. Patterns live
in `spec/product/experience/patterns/`, one page per problem. This skill settles a new one or
revises an existing one, together with the components that implement it.

Design serves a dense, high-throughput Australian general-practice workflow. Visual work must
improve hierarchy, clarity and state recognition rather than compete with the task.

Before editing, read `SPEC.md`, `AGENTS.md`, `apps/web/AGENTS.md`,
`spec/product/experience/README.md`, `spec/product/experience/rules.md`, the pattern page that
owns the problem, the capability screen contract and `review.yaml` that need it, and
[the layer contract](references/foundation-contract.md).

## Find the owning page first

Most work revises an existing pattern rather than adding one.

- **The problem has a page.** Read it, including its **First reference** and **Settled by**. You
  are changing a settled answer, so say what new evidence justifies the change.
- **A second screen needs the same thing and wants a different shape.** This is the moment the
  pattern hardens. Change the page rather than building a variant, and record the second screen.
- **No page owns the problem.** Add one, named for the problem in the user's terms, not for the
  component. Add it to the table in `spec/product/experience/README.md`.

Do not add a page for a component. `Button` is not a product problem.

## Choose the owning layer

Use the lowest layer that can own the behaviour without learning application data or rules:

- `apps/web/src/components/ui` — accessible interaction mechanics, DOM semantics, visual variants;
- `apps/web/src/components/patterns` — reusable compositions controlled entirely by props and
  callbacks;
- capability feature code — API and query state, permissions, domain orchestration. Outside this
  skill.

Markup repeating once is not a reason to extract. A pattern must own a stable interaction,
semantic, density, responsive or state-display contract that an accepted screen contract needs
now. Keep API calls, generated SDK types, authenticated context, permissions, route state and
domain mutation out of both shared layers.

## Define the contract before styling

Identify:

- the staff task and the information that leads the hierarchy;
- controlled inputs, callbacks, slots and semantic labels;
- the relevant normal, loading, empty, dense, disabled, invalid, failure, offline, unavailable,
  selected and restricted states;
- keyboard order, focus movement, activation, escape and recovery, and announcements;
- narrow viewport and zoom/reflow behaviour;
- the synthetic fixture and named evidence that prove it;
- **what it excludes** — the decisions it refuses to make.

The exclusions matter most. A pattern that does not say what it refuses to decide will be handed
those decisions by its first caller.

Focus movement must not imply selection. Colour, hover, drag, truncation or iconography must never
be the only carrier of meaning. A failure must not look like a successful empty result, and a
pending save must not look durable.

## Implement and demonstrate

1. Inspect existing primitives, patterns, tokens and gallery states before adding an API or
   variant.
2. Implement the minimal public interface on accessible native semantics or the existing
   shadcn-derived primitive.
3. Add focused component tests for semantics, controlled behaviour and keyboard interaction.
4. Add a deterministic synthetic fixture covering the meaningful states. No real patient, staff,
   practice or credential data.
5. Demonstrate it in the gallery before capability code adopts it.
6. Extend the relevant Playwright flow to exercise the main keyboard path, focus visibility,
   selection distinction and reflow. Capture named screenshots at a fixed viewport with animations
   and service workers disabled.
7. Inspect the rendered result at desktop and narrow widths using
   [the visual-quality pass](references/visual-quality.md) and the review questions in
   `spec/product/experience/README.md`. Fix the implementation and recapture when a defect is
   visible.

## Record how it was settled

A pattern page that does not say where it came from will be quietly undone later. Before handing
back, make sure the page carries:

- **First reference** — the shipped screen that establishes it. If none ships yet, say so and name
  the capability expected to be first. Do not claim a reference that only the gallery uses.
- **Settled by** — the slice, review or person whose decision produced it, with a date. A decision
  the user made in review is recorded here in the same pull request that applies it.

Register each new or changed contract in
`apps/web/src/design-system/storybook/foundation-contracts.json` with its stable ID, layer,
`specRef` anchor on the owning pattern page, source, story and evidence IDs, and list it in
`spec/product/experience/components.md`. An ID is never reused after removal.

## Validate and hand off

Run the affected component tests and Playwright project while iterating, then `pnpm gate` before a
PR handoff. `pnpm lint:design-system` checks that every contract resolves to exactly one pattern
page, that its anchor and source match, and that its declared evidence and registered evidence are
identical.

Report the owning pattern page, the layer, the public contract, the gallery fixture, the
screenshot and flow paths, the commands actually run, and any unresolved accessibility or product
question. Do not claim the API-connected capability works; this skill proves only the reusable
answer.
