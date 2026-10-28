# Comparing and reconciling records

## The problem

Someone merging two patient records, or reviewing a changed version against the one before it, is
deciding one fact at a time which version survives. The comparison has to make a difference
visible without proposing an answer, because choosing the survivor is a clinical and identity
decision the reviewer owns.

The dangerous failure is a blank. A fact missing from one side, left empty, reads as agreement.

## Rules

- Name a fact missing from one side as not recorded. Never leave it blank.
- Every value keeps the name of the side it came from at every width. A narrow layout takes the
  columns away; it MUST NOT take the attribution away.
- State a difference as a word and a mark, not only as a tint.
- Preselect nothing and propose no survivor. The caller owns which facts are high-risk.
- An unresolved conflict is visible without expanding anything.
- Choosing a value MUST NOT move focus or resolve any other fact.
- Long values wrap in full. A value that loses its ending is worse than no comparison.

## First reference

None on real data. `RecordComparison` was specified and demonstrated by DS-029. Duplicate review
and merge in patient registration is its intended first consumer; it becomes this page's first
reference when it ships.

## Settled by

Specified by DS-029, under the patient-identity decisions in
[ADR-003](../../../decisions/ADR-003-patient-identity.md).

## Contracts

### DS-PAT-024 Record Comparison

- **Need:** Put two records or two versions beside each other so a reviewer sees which facts agree,
  which differ, and which differences are dangerous, and can resolve them one fact at a time.
- **Owner:** `apps/web/src/components/patterns/record-comparison.tsx`.
- **Semantics:** A labelled list of facts. Each fact names itself, states its difference as a word
  and a mark rather than only as a tint, and carries the two sides as separately labelled values.
  Every value keeps the name of the side it came from at every width, so it is never inferred from a
  column position that a narrow layout will take away. A fact missing from one side is named as not
  recorded rather than left blank, because a blank reads as agreement.
- **Public contract:** Receives the two side labels and the rows, each with a stable key, a label,
  the two rendered values and a status of `same`, `differs` or `conflict`. A row may carry a
  controlled choice whose options are the left side, the right side, or keeping both where the
  caller permits it. No option is preselected and the pattern proposes no survivor: choosing one is
  the reviewer's decision, and the caller owns which facts are high-risk.
- **States:** Agreeing, differing, conflicting, missing on one side, and resolved. An unresolved
  conflict is visible without expanding anything. A resolved row shows what was chosen and stays
  changeable. The summary of how many facts differ MUST NOT be stated where the rows do not account
  for it.
- **Keyboard and focus:** Each fact's choice is a named radio group reached in the order the facts
  are shown, so a reviewer moves through them as they read. Choosing a value MUST NOT move focus or
  resolve any other fact.
- **Responsive/content:** The two sides sit beside each other where there is room and stack in
  reading order where there is not, and the resolution stays with its fact in both. Long values wrap
  in full rather than truncating, because a value that loses its side or its ending is worse than no
  comparison at all.
- **Required stories:** `Default`, `Conflicts`, `MissingOnOneSide`, `Resolving`, `ContentStress`,
  `Narrow`, and `KeyboardFlow`.
- **Evidence:** `comparison-differences`, `comparison-resolving`, `comparison-narrow`, and
  `comparison-keyboard`.
- **Used by:** [Duplicate review and merge](../../../capabilities/patient-registration/spec.md#screen-contract-duplicate-review-and-merge),
  [clinical note editor](../../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  and [result viewer](../../../capabilities/results/spec.md#screen-contract-result-viewer-and-action).
- **Excludes:** Deciding which record survives, which facts are high-risk, whether a reviewer may see
  a data class, merging free text, the merge and its atomicity, lineage, reauthentication and the
  second-person confirmation.
