# Moving between sections

## The problem

A patient record or a long workspace is read in sections, and someone moving between them is
navigating, not reviewing. If arriving at a section marks it seen, or if the navigation implies
progress through a checklist that nobody completed, the screen has recorded a clinical claim the
user never made.

## Rules

- Moving to a section MUST NOT imply it was reviewed, acknowledged or completed.
- The current section is identifiable by more than colour, and its name is programmatically
  available.
- Navigation order follows the reading order of the task.
- A section that cannot be entered says why, at the point of the control.
- Keep every section reachable at narrow widths; navigation does not become hover-only or
  horizontally clipped.

## First reference

None on real data. `SectionNavigation` was specified and demonstrated by DS-031. The patient
record workspace is its intended first consumer.

## Settled by

Specified by DS-031 ("move between the sections of a workspace without implying anything was
reviewed").

## Contracts

### DS-PAT-026 Section Navigation

- **Need:** Move between the peer sections of a workspace, showing which one is current and how much
  work each holds, without the control implying that moving completes or reviews anything.
- **Owner:** `apps/web/src/components/patterns/section-navigation.tsx`.
- **Semantics:** A named `nav` landmark holding a list of links. The current section carries
  `aria-current="page"` and a non-colour cue. These are links rather than tabs because moving
  between them changes location; `DS-NAV-001` covers switching a panel within one task and says so.
  A count belongs to its section's accessible name, not to a separate element beside it.
- **Public contract:** Receives the landmark's label, the sections with a stable key, a label, a
  destination and an optional count and attention flag, and the current section's key. A navigation
  event is reported to the caller so a router can take it. A section the caller does not supply is
  absent rather than disabled, and hiding one is never the access control — the server decides that.
- **States:** Current, other, counted, zero-counted, and needing attention. A zero count is shown as
  zero rather than omitted, because "nothing there" and "not counted" are different claims. An
  attention flag uses a mark and the accessible name as well as a tint.
- **Keyboard and focus:** Tab reaches each section and Enter follows it. Arrow keys MUST NOT move
  between sections: these are links, not a composite widget, and the tab model would promise a panel
  switch that does not happen. Arriving at a section MUST NOT mark anything read or reviewed.
- **Responsive/content:** At a narrow width the list scrolls within its own container without
  clipping, and the current section is brought into view, so the operator's location is never off
  screen. Long labels wrap or scroll rather than truncating the section's name.
- **Required stories:** `Default`, `WithCounts`, `Attention`, `ZeroCounts`, `ContentStress`,
  `Narrow`, and `KeyboardFlow`.
- **Evidence:** `section-nav-states`, `section-nav-narrow`, and `section-nav-keyboard`.
- **Used by:** [Patient record workspace](../../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist).
- **Excludes:** Routing, permission filtering, deriving any count, freshness, section order, and
  whether a section may be reached at all.

## Data and operation states
