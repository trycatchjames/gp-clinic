# Lean specification shape

Optimise for decision completeness per read, not minimum word count. Fragmented signal is still
noise when an agent must discover and open many files to reconstruct one behaviour.

## Default shape

Use these as defaults for a future consolidation, not as permission to perform a repository-wide
move during an unrelated feature:

- `SPEC.md`: one short authority, scope, and navigation entrypoint;
- `spec/product/`: only product-wide purpose, actors, vocabulary, scope, and quality bars;
- `spec/domain/<domain>.md`: owner, concepts, relationships, invariants, lifecycle, history, and
  published facts normally read together;
- `spec/capabilities/<capability>/spec.md`: actor/outcome, inputs/outputs, rules, interactions,
  permissions, screen semantics, failures, exclusions, and explicit dependencies;
- `spec/capabilities/<capability>/acceptance.feature`: a few consequential examples;
- `spec/capabilities/<capability>/review.yaml`: capability-owned, machine-readable human,
  automated, fixture, flow, and screenshot evidence; delivery slices select or reference these
  obligations rather than redefining them;
- `spec/cross-cutting/<concern>.md`: reusable rules that genuinely apply across capabilities;
- `spec/decisions/`: accepted durable decisions only;
- `spec/research/`: source register and genuine open questions, loaded only for research or
  time-sensitive/Australian-specific changes.

Keep a separate screen contract only when it is substantial, independently reused, or changes on a
different cadence from the rest of the capability. Keep a separate domain lifecycle only when the
state model is large enough to be safer as a standalone transition reference.

## Capability autonomy packet

A capability's normal read set should answer these without repository-wide search:

1. Who is acting, for what outcome, and what is excluded?
2. Which domains own the data and transitions?
3. Which permissions and contextual checks allow or deny each operation?
4. What inputs, outputs, preconditions, invariants, and side effects apply?
5. What are the valid states and transitions, including stale and invalid attempts?
6. What must the user see and do in normal, loading, empty, dense, restricted, unavailable, and
   failed states?
7. What persists, what is audited, and what happens to history after correction or failure?
8. Which Gherkin examples and review evidence prove the risky behaviour?

Record explicit dependency paths next to the capability contract so an agent does not have to infer
which domain, cross-cutting, contract, or ADR documents are applicable. Prefer a small
machine-readable frontmatter block when the repository validator can check it.

## Audit evidence

For a structure or autonomy audit, distinguish observed facts from inferred retrieval cost and
include enough evidence to compare alternatives:

- count direct capability files and words, then separately estimate the dependency packet;
- compare every authoritative navigation instruction and flag inconsistent required read sets;
- measure whether capability files declare links or dependencies to their actual owners;
- identify bare declarative constraints whose normative status is unclear despite the repository's
  defined `MUST`/`SHOULD` language;
- identify the producer and consumer of structured IDs before moving or removing a manifest;
- map each source heading, rule, permission token, state, scenario, and review evidence ID to its
  proposed destination.

Do not improve compactness by moving capability-wide review obligations into a transient delivery
slice, flattening away a useful ownership boundary, or turning navigation metadata into a new
normative source.

## Keep, consolidate, or remove

Keep content when it changes a decision, constraint, test, review, source assessment, or safe
failure. Consolidate content when fragments share the same owner and are normally retrieved or
changed together. Remove content when it is duplicated, obsolete, template filler, an activity log,
or implementation narration with no stable product meaning.

Move rather than delete useful facts during consolidation. Before removing a file, inspect inbound
Markdown links, code comments, scripts, pipeline configuration, and review artifacts. Update those
references in the same migration and verify the resulting read set.

## Migration strategy

Consolidate one bounded area at a time:

1. Measure the current area with `pnpm lint:spec`.
2. Choose one capability and its directly owned domain material.
3. Create the compact contract without changing behaviour.
4. Update links, code comments, validators, delivery manifests, and agent instructions atomically.
5. Prove no normative statement, acceptance scenario, source reference, or evidence requirement was
   lost.
6. Run `pnpm lint:spec` and the repository gate before removing superseded files.

Do not maintain old and new normative copies in parallel. A compatibility redirect may contain only
a clear pointer and should be removed once callers migrate.
