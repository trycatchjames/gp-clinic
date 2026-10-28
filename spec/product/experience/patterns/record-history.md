# A record's history

## The problem

A clinician deciding whether to trust an entry needs to know more than what it says. They need to
know when it applied, when it was actually written down if that differs, who wrote it, and whether
it has since been amended or withdrawn. A history that shows only the text, ordered by one
timestamp, quietly answers those questions wrongly.

Two mistakes matter most. An entry recorded days after the event MUST NOT read as though it
happened when it was typed. An entry marked entered in error MUST keep its place, because a gap in
a sequence is a different claim from a withdrawal.

## Rules

- Effective time and recorded time are different facts. Show recorded time whenever it differs
  from effective time and label it; never leave the difference to position.
- An amendment names the entry it amends, and the amended entry says it has been amended. Neither
  half of a chain can be read alone.
- An entry marked entered in error stays in sequence, marked, rather than disappearing.
- Status uses a word and a mark, never a tint alone.
- Opening an entry MUST NOT mark it reviewed or change its status.
- The history presents what the capability supplies. It decides no clinical meaning, no amendment
  authority and no sensitivity rule.

## First reference

None on real data. `RecordTimeline` was specified and demonstrated by DS-028; no capability
consumes it yet. The first record to present its own history becomes this page's first reference.

## Settled by

Specified by DS-028, under the additive-amendment and entered-in-error semantics in
[../../../cross-cutting/clinical-safety/clinical-record-integrity.md](../../../cross-cutting/clinical-safety/clinical-record-integrity.md)
and [ADR-002](../../../decisions/ADR-002-clinical-record-amendments.md).

## Contracts

### DS-PAT-023 Record Timeline

- **Need:** Show a record's entries in time order together with the facts that decide whether an
  entry can be trusted: when it applied, when it was written down if that differs, who wrote it, and
  whether it has since been amended or withdrawn.
- **Owner:** `apps/web/src/components/patterns/record-timeline.tsx`.
- **Semantics:** An ordered list grouped by effective date, each group named by its date so the
  sequence is readable without reading every entry. An entry carries its type, its author or source,
  a concise summary and its status. Recorded time appears only when it differs from effective time
  and is labelled as recorded, never left to position. Status uses a word and a mark as well as a
  tint.
- **Public contract:** Receives the entries with stable keys, each with an effective instant, an
  optional recorded instant, a type, an author or source, a summary, a status of `recorded`,
  `amended`, `amendment` or `entered-in-error`, and an optional reference to the entry it amends.
  The caller supplies the IANA timezone, any action attached to an entry, and every word. Empty,
  loading and failure content is supplied by the caller outside the list.
- **States:** Populated, an entry recorded later than it applied, an amended entry, the amendment
  itself, and an entry marked entered in error. A late entry MUST NOT read as though it happened
  when it was written down. An entry marked entered in error keeps its place in the sequence,
  because a gap is a different claim from a withdrawal. An amendment names the entry it amends, and
  the amended entry says it has been amended, so neither half of a chain can be read alone.
- **Keyboard and focus:** An entry is inert unless the caller attaches an action, and opening one
  MUST NOT mark it reviewed or change its status. Any attached action is a control in reading order
  after the entry's content.
- **Responsive/content:** At a narrow width the metadata stacks beneath the summary without losing
  which time is which or who recorded it. A long summary wraps in full. Dates and times use the
  shared display formatters rather than a local `Intl` instance.
- **Required stories:** `Default`, `LateEntry`, `AmendmentChain`, `EnteredInError`, `WithActions`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `timeline-entries`, `timeline-amendment`, `timeline-narrow`, and `timeline-keyboard`.
- **Used by:** [Patient record workspace](../../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [clinical note editor](../../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  and [observation entry](../../../capabilities/observations/spec.md#observation-entry-and-trend).
- **Excludes:** Which entries exist, ordering authority, filtering, permission and sensitivity
  policy, clinical meaning, amendment authority, pagination and virtualisation.
