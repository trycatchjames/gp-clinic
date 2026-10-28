# Finding records

## The problem

Staff find a record before they can do anything with it, usually under time pressure and often
while someone is waiting at a desk or on the phone. A list that is slow to scan, or that makes a
failed search look like an empty one, costs more than a slow page: it can send a receptionist on
to create a duplicate patient, or let a result sit unclaimed.

This page covers searching, filtering, scanning and selecting records. What the list contains, who
may see it, and what may be done to a row remain the owning capability's decisions.

## Rules

- Put search first and keep it visible. Scope it to the current view and name what it searches.
- A failed or partial search MUST NOT be described as no matches. See
  [empty and failed outcomes](empty-and-failed-outcomes.md).
- Lead each row with what identifies it, then the facts that decide the current task. Internal
  references stay secondary.
- Make a column sortable only when its order means something to the person scanning it.
- Add the selection column only when at least one bulk action is available on those rows.
- Focus movement never selects, and selection is never carried by colour alone.
- Return to the first page on any change of search, filter or sort, and keep the query reachable.
- Offer an action only when the session grants its permission. The service checks every request
  regardless, and the list explains a refusal in words.

## Search, lists, and selection

Search and list mechanics follow the user's decision order. The name or task object leads each row;
distinguishing facts follow; internal or external references remain secondary. Focus movement does
not select. Selection uses semantic state and a non-colour cue, and the query remains easy to reach
and revise.

Loading preserves the active query and scope. An empty result names the searched scope. Partial or
full search failure cannot be described as no matches. Background refresh preserves query, focus,
and deliberate selection unless the capability requires an explicit invalidation decision.

Persistent left navigation uses simple monochrome icons and short labels with approximately
36-40px rows. The active item uses a quiet tint, teal text and icon, and a non-colour cue such as a
2px leading rule or equivalent selected structure. Focus, hover, and selected states remain
distinct.

## First reference

Patient search, `apps/web/src/routes/patients/search.tsx`, shipped by PATSEARCH-001 and
PATSEARCH-002. It is the only screen using this pattern on real data, and it establishes the
search, filter, result and restricted-result behaviour. Revise this page when a second list
exposes a better pattern.

## Settled by

Filter bar, list view and bulk selection were specified by DS-004, DS-008 and DS-025. The
restricted and failed-search behaviour was settled by PATSEARCH-002 (merged 28 October 2026) under
the privacy and error-handling requirements.

## Contracts

### DS-PAT-002 Filter Bar and Filter Field

- **Need:** Keep the primary query, secondary filters, active scope, and live result summary in one
  compact named region without displacing the worklist.
- **Owner:** `apps/web/src/components/patterns/filter-bar.tsx`.
- **Semantics:** A named search region containing individually labelled controls and an optional
  polite result summary. `FilterField` connects label/hint to its control.
- **Public contract:** Accepts a region label, controls, optional result summary, visible or safely
  hidden field labels, and flexible growth for the primary query. The caller owns values and change
  callbacks.
- **States:** Initial, searching, filters applied, no matches, partial results, and failure are
  capability-supplied and MUST remain distinct. Changing a filter does not imply a mutation.
- **Keyboard and focus:** Controls follow task order. Updating results does not move focus or
  repeatedly announce unchanged counts. Clear/remove controls are fully named.
- **Responsive/content:** Filters wrap in a predictable order; the primary query stays reachable;
  active scope and result summary remain visible. A hidden label is allowed only when context and
  accessible name remain unambiguous.
- **Required stories:** `Default`, `ActiveFilters`, `Searching`, `NoMatches`, `PartialFailure`,
  `LongLabels`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `filter-bar-states`, `filter-bar-narrow`, and `filter-bar-keyboard`.
- **Used by:** [Patient search](../../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox).
- **Excludes:** Query execution, debounce, result ranking, protected scope, permissions, and URL state.

### DS-PAT-003 List View and List View Row

- **Need:** Present a dense, keyboard-navigable set of candidate records where focus never selects
  and decision-relevant facts lead.
- **Owner:** `apps/web/src/components/patterns/list-view.tsx`.
- **Semantics:** Named list of action rows. A row uses button semantics and `aria-pressed` for the
  deliberate current selection rather than pretending to be a form listbox.
- **Public contract:** Receives items, stable keys, render function, label, controlled selected key,
  selection callback, and comfortable/compact density. `ListViewRow` accepts a leading title,
  badges, distinguishing facts, optional trailing fact, and relevant footnote.
- **States:** Focus, hover, and selection are distinct. Selection uses pressed state, a marker, and a
  non-colour cue. Empty/loading/failure are rendered through `StatePanel`, not fake rows.
- **Keyboard and focus:** Tab reaches rows; Arrow Up/Down and Home/End move focus; Enter/Space
  explicitly selects. Refresh preserves focus and selection when the item remains valid.
- **Responsive/content:** The name or task object leads. Distinguishing facts follow; references are
  secondary. Ordinary rows target two concise lines; a footnote is reserved for relevant match or
  safety context. Required meaning must wrap or expose a non-hover full-content path rather than
  unsafe truncation.
- **Required stories:** `Default`, `Selected`, `FocusWithoutSelection`, `Comfortable`, `Compact`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `list-view-selection`, `list-view-density`, and `list-view-keyboard`.
- **Used by:** [Patient search](../../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [recall worklist](../../../capabilities/recalls-and-reminders/spec.md#screen-contract-recall-worklist).
- **Excludes:** Result order/rank, record disclosure, domain selection consequence, pagination,
  virtualisation, and API refresh.

### DS-PAT-007 Data Table

- **Need:** Let staff scan, compare, sort, page through, and progressively disclose structured
  records without turning each row into a card or losing row/column relationships.
- **Owner:** `apps/web/src/components/patterns/data-table.tsx`.
- **Semantics:** Composes the native Table atom with a required caption, scoped column headers,
  `aria-sort` on the active sortable header, a named pagination region, and optional disclosure
  buttons. An expanded detail is a full-width row whose cell may contain a separately captioned
  semantic table; a table is never placed directly inside another table row. When the caller
  supplies a selection, the table hosts the `DS-PAT-020` selection control as a leading column whose
  header control covers only the rows currently rendered.
- **Public contract:** Receives rows, stable row keys, column definitions and rendered values.
  Sorting, pagination, page size, expanded row keys, and any selection are controlled values with
  callbacks. A sortable column supplies its accessible sort label. Numeric/currency columns request
  end alignment. The caller supplies empty/loading/failure content outside the table body.
- **States:** Sort direction is visible and announced. First/previous/next/last controls reflect
  page boundaries. Expansion uses `aria-expanded`, `aria-controls`, a non-colour chevron cue, and
  a caller-supplied row label. Changing sort or page MUST NOT imply row selection or domain action,
  and MUST NOT add to, remove from, or clear an existing selection.
- **Keyboard and focus:** Sort, pagination, and disclosure controls use native button behaviour.
  Activation retains a useful focus target and does not move focus into newly disclosed content.
  Interactive cell content remains in logical row order.
- **Responsive/content:** The table remains compact and horizontally contained. Pagination wraps
  below it without causing page overflow. A capability supplies an equivalent list or grouped-row
  strategy when its narrow screen cannot preserve required meaning through horizontal scrolling.
  Expanded content remains visually subordinate to its parent row and exposes its own caption and
  headers when it is another table.
- **Required stories:** `SortablePaginated`, `Hierarchy`, `Empty`, `ContentStress`, `Narrow`, and
  `KeyboardFlow`.
- **Evidence:** `storybook-data-table`, `storybook-data-table-hierarchy`,
  `storybook-data-table-narrow`, and `storybook-data-table-controls`.
- **Used by:** [Patient account](../../../capabilities/billing/spec.md#screen-contract-patient-account),
  [task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [waiting room](../../../capabilities/calendar/spec.md#screen-contract-waiting-room).
- **Excludes:** Fetching, query construction, permission filtering, domain ordering, clinical
  priority, financial calculation, virtualisation, which records may be selected, what a selection
  may then be used for, and row-action availability.

### DS-PAT-020 Bulk Selection

- **Need:** Let staff choose many records in a queue and act on them once, while keeping what is
  selected, what is not, and what cannot be included visible before anything is committed.
- **Owner:** `apps/web/src/components/patterns/bulk-selection.tsx`.
- **Semantics:** A selection control names the record it selects rather than relying on its position
  in a row. The control for a group reports that group as checked, unchecked, or `mixed`, and a
  mixed control is visually distinct from a checked one rather than sharing its tick. The bar is a
  labelled region holding the count, the scope of the selection, and the available actions; the
  count is announced politely and its arrival moves no focus.
- **Public contract:** Selection is a controlled set of stable record keys owned by the caller. A
  selection control requires a name identifying its record or group and a change callback, and
  accepts a blocked reason that both disables it and describes it. The bar requires the selected
  count, the singular and plural noun for what is counted, and a clear callback; it accepts the
  number of selected records that are not on the current page, an escalation to the whole matching
  set, and actions that each may carry their own blocked reason.
- **States:** Nothing selected, part of the page selected, every selectable row on the page selected,
  and a selection reaching beyond the current page. A row that cannot take the pending action is
  disabled, carries a non-colour mark, and takes its reason as its accessible description; the bar
  counts those rows and states the reason once, so an excluded row is never silently absent or
  silently unchecked. With nothing selected the bar keeps its shape and offers no action over the
  records, so the first selection does not shift the rows beneath it and nothing offers to act on an
  empty set. Clearing remains present throughout, because a control that unmounts with the last
  selection takes the operator's focus with it.
  Changing sort, page, or page size MUST NOT add, remove, or clear a selection, and a selection
  extending past the visible page MUST say so rather than appearing to be only what is on screen.
- **Keyboard and focus:** Space toggles a selection control. Focus movement, opening a record, and
  scrolling MUST NOT select. The bar precedes the records it acts on in reading order, and its
  arrival moves no focus. Focus survives clearing, so a keyboard operator is not returned to the top
  of the document by the act of changing their mind.
- **Responsive/content:** The bar stays in normal flow rather than floating over the records, so no
  row is hidden beneath it at a narrow width. The count, the scope sentence, and the actions wrap
  without page overflow. The selection target stays at least 24 pixels at every density.
- **Required stories:** `Default`, `PartialPage`, `PageSelected`, `BeyondPage`, `BlockedRows`,
  `InTable`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `bulk-selection-states`, `bulk-selection-beyond-page`, `bulk-selection-blocked`,
  `bulk-selection-narrow`, and `bulk-selection-keyboard`.
- **Used by:** [Results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox),
  [task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [document inbox](../../../capabilities/documents/spec.md#screen-contract-document-inbox).
- **Excludes:** Which records exist or may be selected, whether an action is permitted in bulk, the
  preview of what an action would do and the itemised result of having done it, which are
  `DS-PAT-021`, the mutation and its atomicity, and any bulk clinical disposition, which the results
  contract forbids outright.

## Context and data display

