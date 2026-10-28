# Reading a record

## The problem

Most clinical and administrative screens spend more of their life being read than edited. A reader
is checking whether a fact is current, where it came from, and whether it can be acted on. A
layout that makes every fact look equally important, or that renders a missing value the same way
as a recorded absence, slows that reading down and can change what the reader concludes.

This page covers presenting a record's saved facts for reading. History is
[its own pattern](record-history.md); comparing two records is
[another](comparing-records.md).

## Rules

- Lead with the facts that decide the current task. Identifiers and provenance stay available but
  quieter.
- Missing, unknown, not asked, not applicable, declined, none-known and zero are distinct and MUST
  read as distinct. A component renders the capability's value and invents no fallback.
- Give each bounded section a named edit action, shown only when the session grants the permission
  it needs, and open it on the surface [choosing a surface](choosing-a-surface.md) selects.
- A read-only fact is shown as a fact, not as a disabled input.
- Keep labels explicit wherever a reader scans by field name or similar values could be confused —
  identity, billing, identifiers and audit regions in particular.

## First reference

None on real data. `SummaryList` is demonstrated in the gallery only; patient search shows result
rows rather than a record's facts. The first capability to present a saved record becomes this
page's first reference.

## Settled by

Specified by DS-004. The missing-value rules come from the content requirements in
[../rules.md](../rules.md).

## Contracts

### DS-PAT-006 Summary List

- **Need:** Present compact labelled facts with clear grouping and comparable numeric values.
- **Owner:** `apps/web/src/components/patterns/summary-list.tsx`.
- **Semantics:** Description list containing label/value pairs and optional supporting text.
- **Public contract:** Receives items, one to three columns, comfortable/compact density, and
  per-value tabular treatment. Labels remain unique within the list.
- **States:** Missing, unknown, zero, and unavailable values are capability-supplied explicitly;
  the pattern does not invent fallbacks. Supporting text remains subordinate but readable.
- **Keyboard and focus:** Static list is not focusable. Interactive content within a value requires
  its own complete semantics and task order.
- **Responsive/content:** Columns collapse without changing reading order. Labels and values wrap;
  long identifiers and numbers preserve interpretable content.
- **Required stories:** `Default`, `OneColumn`, `ThreeColumns`, `Compact`, `MissingAndUnknown`,
  `NumericValues`, `ContentStress`, and `Narrow`.
- **Evidence:** `summary-list-density` and `summary-list-content-stress`.
- **Used by:** [Patient account](../../../capabilities/billing/spec.md#screen-contract-patient-account),
  [practitioner profile](../../../capabilities/practitioner-management/spec.md#screen-contract-practitioner-profile-and-offboarding),
  and [care-plan workspace](../../../capabilities/chronic-disease-care/spec.md#screen-contract-care-plan-workspace).
- **Excludes:** Data formatting authority, masking, permission, calculation, and record history.
