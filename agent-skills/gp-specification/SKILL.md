---
name: gp-specification
description: Audit, consolidate, shape, or revise GP Clinic product behaviour in the authoritative Markdown specification, Gherkin acceptance examples, and review evidence. Use to improve specification signal-to-noise or before implementing a new feature or any material behaviour, permission, safety, domain, contract, or screen change; do not use for application-code-only maintenance.
---

# Shape a product change

Keep the specification authoritative, internally consistent, and useful to a later implementation
agent. Match the requested action: review or plan without editing when asked for analysis; edit the
specification only when the user asks to define or change product behaviour.

Before editing, read `SPEC.md`, `spec/AGENTS.md`, `spec/product/scope.md`, and
[the change map](references/change-map.md). Then read the complete affected capability bundle,
owning domains, applicable cross-cutting requirements, contracts, architecture rules, accepted
ADRs, and research sources identified by that map.

For a structure, cleanup, or autonomy task, first run `pnpm lint:spec` and read
[the lean specification shape](references/lean-specification.md). Reduce retrieval cost without
discarding decisions, safety controls, provenance, or testable behaviour.

## Frame the change

State the following before deciding what files change:

- actor and outcome;
- user, operational, or safety problem;
- behaviour that is explicitly excluded;
- affected domain owners, permissions, safety invariants, and historical-record implications;
- unresolved facts or decisions.

Infer a missing detail only when existing authoritative material makes one interpretation clear.
Ask for a decision when alternatives would materially change product behaviour, safety,
permissions, ownership, or scope.

Stop if authoritative requirements conflict. Identify the conflicting statements and resolve the
specification conflict before continuing. Do not choose an implementation-friendly interpretation.

## Write one coherent specification change

Update every affected authoritative layer in the same change, but only those layers whose meaning
actually changes:

1. Put each fact, lifecycle, and invariant under one domain owner.
2. Specify capability actors, inputs, outputs, rules, interactions, permissions, failures, and
   exclusions.
3. Define screen semantics, information hierarchy, actions, states, keyboard behaviour, and
   failure/privacy behaviour without prescribing pixels or framework code.
4. Update stable contracts or architecture boundaries when exchanged meaning or ownership changes.
5. Add or amend an ADR only for a durable identity, lifecycle, safety, compatibility, ownership,
   or architecture decision.
6. Add a small set of high-value Gherkin examples. Cover the main outcome plus the permission,
   invalid-transition, failed-save, or safety edge that could otherwise be implemented incorrectly.
7. Make `review.yaml` request observable evidence for the changed behaviour and risks.

Gherkin illustrates normative prose; it never replaces it. Use canonical Australian general-
practice terminology. Do not invent clinical knowledge, legal rules, programme details, or current
Australian standards. Reverify time-sensitive claims from an authoritative source or record the
uncertainty in `spec/research/open-questions.md`.

Version 1 must remain integration-free. Represent an external-facing fact only as clearly labelled
manual or simulated internal state when ordinary work requires it.

## Keep signal dense

Every retained statement should change a product decision, implementation constraint, acceptance
test, review obligation, retrieval route, or documented uncertainty. Remove commentary that merely
restates a heading, repeats an owned rule, narrates ordinary UI mechanics, or records activity.

Do not confuse short with clear. A later agent still needs the actor, preconditions, permissions,
inputs and outputs, invariants, lifecycle transitions, failure and recovery behaviour, audit/history
effects, screen states, and high-value examples relevant to the outcome. Consolidate fragments when
those facts are normally read and changed together; split only when a document has a distinct
owner, audience, authority, reuse pattern, or change cadence.

Reference a shared rule at its owner and specify only the capability-specific delta. Do not create
empty or one-paragraph files to satisfy a directory template. Keep research and future-integration
material out of the normal implementation read set unless the task actually depends on it.

## Validate and hand off

Check changed Markdown links, terminology, lifecycle names, YAML syntax, Gherkin structure, and
authority ordering. Confirm that permissions, audit consequences, failed-save behaviour, data
migration, and historical-record treatment are explicit wherever affected. Run the smallest
relevant repository checks while iterating, rerun `pnpm lint:spec`, and run `pnpm gate` before a PR
handoff.

Do not modify application code as part of specification work unless the user separately requests
implementation. Report the actor/outcome, changed authoritative files, validation performed, and
unresolved decisions in under 300 words.
