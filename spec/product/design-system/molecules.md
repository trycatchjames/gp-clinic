# Molecule catalogue

## Catalogue rules

Molecules are pure compositions of atoms. They receive data, labels, state, slots, and callbacks
from their caller and own only reusable hierarchy, semantics, density, responsive layout, or
interaction coordination. Global state, responsive, and content rules apply to every entry.

| ID | Molecule | Group | Source |
|---|---|---|---|
| `DS-PAT-001` | Field and Field Group | forms | `apps/web/src/components/patterns/form-field.tsx` |
| `DS-PAT-002` | Filter Bar and Filter Field | search | `apps/web/src/components/patterns/filter-bar.tsx` |
| `DS-PAT-003` | List View and List View Row | lists | `apps/web/src/components/patterns/list-view.tsx` |
| `DS-PAT-004` | Context Banner | context | `apps/web/src/components/patterns/context-banner.tsx` |
| `DS-PAT-005` | State Panel | feedback | `apps/web/src/components/patterns/state-panel.tsx` |
| `DS-PAT-006` | Summary List | data display | `apps/web/src/components/patterns/summary-list.tsx` |
| `DS-PAT-007` | Data Table | data display | `apps/web/src/components/patterns/data-table.tsx` |
| `DS-PAT-008` | Combobox Field | forms | `apps/web/src/components/patterns/combobox-field.tsx` |
| `DS-PAT-009` | Australian Date Field | forms | `apps/web/src/components/patterns/date-field.tsx` |
| `DS-PAT-010` | Australian Date Range Field | forms | `apps/web/src/components/patterns/date-range-field.tsx` |
| `DS-PAT-011` | Local Time Field | forms | `apps/web/src/components/patterns/time-field.tsx` |
| `DS-PAT-012` | File Input Field | forms | `apps/web/src/components/patterns/file-input-field.tsx` |
| `DS-PAT-013` | Consequence Confirmation | operation states | `apps/web/src/components/patterns/consequence-confirmation.tsx` |
| `DS-PAT-014` | Toast Region | feedback | `apps/web/src/components/patterns/toast-region.tsx` |
| `DS-PAT-015` | Save State | operation states | `apps/web/src/components/patterns/save-state.tsx` |
| `DS-PAT-016` | Form Error Summary | forms | `apps/web/src/components/patterns/form-error-summary.tsx` |
| `DS-PAT-017` | Form Section | forms | `apps/web/src/components/patterns/form-section.tsx` |
| `DS-PAT-018` | Collapsible Section | context | `apps/web/src/components/patterns/collapsible-section.tsx` |
| `DS-PAT-019` | Action Bar | operation states | `apps/web/src/components/patterns/action-bar.tsx` |
| `DS-PAT-020` | Bulk Selection | lists | `apps/web/src/components/patterns/bulk-selection.tsx` |
| `DS-PAT-021` | Itemised Outcome | operation states | `apps/web/src/components/patterns/itemised-outcome.tsx` |
| `DS-PAT-022` | Numeric Field | forms | `apps/web/src/components/patterns/numeric-field.tsx` |
| `DS-PAT-023` | Record Timeline | data display | `apps/web/src/components/patterns/record-timeline.tsx` |
| `DS-PAT-024` | Record Comparison | data display | `apps/web/src/components/patterns/record-comparison.tsx` |
| `DS-PAT-025` | Page Header | context | `apps/web/src/components/patterns/page-header.tsx` |
| `DS-PAT-026` | Section Navigation | navigation | `apps/web/src/components/patterns/section-navigation.tsx` |

## Forms

### DS-PAT-001 Field and Field Group

- **Need:** Keep a visible label, supporting hint, required state, validation error, and control
  correctly associated while arranging related fields without ambiguous spacing.
- **Owner:** `apps/web/src/components/patterns/form-field.tsx`.
- **Semantics:** `Field` supplies one label/control relationship and stable description/error IDs.
  `FieldGroup` arranges related fields but does not replace `fieldset`/`legend` when the group itself
  needs a semantic name.
- **Public contract:** `Field` accepts label, hint, error, required state, optional control ID, and a
  child or render function that receives accessible control props. `FieldGroup` accepts one to
  three responsive columns.
- **States:** Normal, required, disabled-through-child, invalid, and long-message states. An error is
  announced and associated without clearing the value; required is conveyed as text as well as a
  symbol.
- **Keyboard and focus:** Follows the contained control. Label activation focuses/toggles the
  control. Error insertion does not steal focus.
- **Responsive/content:** Columns collapse in reading order. Long labels, hints, and errors wrap;
  there is more separation between fields than within each field.
- **Required stories:** `Default`, `WithHint`, `Required`, `Invalid`, `Disabled`, `Grouped`,
  `LongMessages`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `field-states`, `field-group-reflow`, and `field-keyboard`.
- **Used by:** [Patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [appointment editor](../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
- **Excludes:** Validation authority, data conversion, form submission, permission, save state, and
  cross-field business rules.

### DS-PAT-008 Combobox Field

- **Need:** Let staff refine and deliberately choose one option from a long or asynchronously
  supplied set without confusing keyboard focus, a search match, or the active option with the
  selected value.
- **Owner:** `apps/web/src/components/patterns/combobox-field.tsx`.
- **Semantics:** A visible `Field` label and description/error relationship contain an editable
  combobox whose popup is a named single-select listbox. The input retains DOM focus while
  `aria-activedescendant` identifies the active option; the selected option uses `aria-selected`.
- **Public contract:** Receives controlled query, selected value, open state, options, and their
  callbacks. Each option supplies a stable value, primary label, optional distinguishing detail,
  and disabled state. The caller supplies ready, loading, empty, or failure state and concise state
  text. Changing text clears a mismatched selected value; only explicit option activation selects.
- **States:** Closed, open, selected, disabled, invalid, loading, empty, and failure remain
  distinct. Active and selected options have different programmatic and non-colour cues. Newly
  loaded or reordered options never become selected automatically. Failure is announced and MUST
  NOT look or sound like an empty successful result.
- **Keyboard and focus:** Arrow Down/Up opens and moves the active option without selecting;
  Home/End reach the first/last enabled option; Enter selects the active enabled option; Escape
  closes without selecting or clearing the query; Tab closes and continues normal focus order.
  Disabled options are skipped. Pointer selection preserves the same deliberate selection
  callback and focus returns to the input.
- **Responsive/content:** The control and popup fit their available width at 360 pixels and 200%
  reflow. Long labels and distinguishing details wrap without clipping; the popup scrolls when its
  bounded height is exceeded.
- **Required stories:** `Default`, `Selected`, `Loading`, `Empty`, `Failure`, `Disabled`, `Invalid`,
  `LongOptions`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `storybook-combobox-field`, `storybook-combobox-field-states`,
  `storybook-combobox-field-narrow`, and `storybook-combobox-field-keyboard`.
- **Used by:** [Referral editor](../../capabilities/referrals/spec.md#screen-contract-referral-editor).
- **Excludes:** Fetching, debounce, query syntax, filtering, ranking, result permissions, directory
  ownership, recipient snapshotting, free-text values, multiple selection, and persistence.

### DS-PAT-009 Australian Date Field

- **Need:** Let staff enter or choose an exact calendar date in unmistakable Australian order
  without converting a date-only fact into an instant or discarding incomplete text during entry.
- **Owner:** `apps/web/src/components/patterns/date-field.tsx`.
- **Semantics:** A visible `Field` label names a text input whose hint identifies `DD/MM/YYYY`; an
  adjacent named button opens a dialog-like calendar region with month navigation, weekday
  headers, gridcell selection, and one roving focus target. The selected day is programmatic and
  visibly distinct from keyboard focus.
- **Public contract:** Receives controlled raw text, selected ISO date-only value, open state,
  visible `YYYY-MM` month, deterministic today value, optional minimum/maximum dates, and callbacks.
  Text edits are preserved and clear a mismatched calendar selection. Calendar selection returns
  the ISO date-only value and writes its `DD/MM/YYYY` display form. The caller supplies validation
  and invalid copy.
- **States:** Empty, incomplete text, selected, open, invalid, disabled, and read-only are distinct.
  The component never fabricates a missing component, accepts a two-digit year as complete, or
  implies that syntactically entered text is valid. Today, focused day, selected day, unavailable
  day, and adjacent-month blank cells remain distinguishable without colour alone.
- **Keyboard and focus:** Tab reaches the text input then calendar button. Alt+Arrow Down or the
  button opens the calendar and focuses the selected day, today when visible, or first available
  day. Arrow keys move by day/week; Home/End move within the week; Page Up/Down changes month;
  Enter/Space selects; Escape closes and returns focus to the text input. Month buttons retain
  focus. Unavailable dates are skipped and cannot be selected.
- **Responsive/content:** Text input and calendar action wrap without separating their label,
  format hint, or error. The calendar fits 360 pixels and 200% reflow without horizontal page
  overflow; weekday and day targets remain legible and focus-visible.
- **Required stories:** `Default`, `Selected`, `Incomplete`, `Invalid`, `Disabled`, `ReadOnly`,
  `LongLabel`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `storybook-australian-date-field`, `storybook-australian-date-field-states`,
  `storybook-australian-date-field-narrow`, and `storybook-australian-date-field-keyboard`.
- **Used by:** [Appointment editor](../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
- **Excludes:** Calendar-validity authority, partial/estimated date precision, two-digit-year
  interpretation, timezone/instant conversion, recurrence, availability, parsed-date confirmation,
  and persistence.

### DS-PAT-010 Australian Date Range Field

- **Need:** Let staff enter or choose an inclusive start and end date as one named filter or
  scheduling range without losing incomplete text or obscuring which boundary is invalid.
- **Owner:** `apps/web/src/components/patterns/date-range-field.tsx`.
- **Semantics:** A `fieldset` and visible `legend` name the range. It composes two
  `DS-PAT-009` date fields labelled “Start date” and “End date”, with group guidance and errors
  programmatically associated with the fieldset. Each boundary keeps its own field error.
- **Public contract:** Receives controlled start/end date-field state and callbacks, deterministic
  today, optional shared minimum/maximum bounds, disabled/read-only state, group hint/error, and
  boundary errors. A calendar selection changes only that boundary. The caller owns range meaning,
  inclusivity, ordering validation, maximum span, query execution, and persistence.
- **States:** Empty, one boundary entered, complete, invalid boundary, invalid ordering, disabled,
  and read-only remain distinct. A group error does not clear either boundary or replace a precise
  boundary error.
- **Keyboard and focus:** Native task order reaches start text/calendar before end text/calendar.
  Opening, navigating, selecting, or escaping one calendar does not move focus into or mutate the
  other boundary. Group feedback never steals focus.
- **Responsive/content:** Boundaries align in two columns when space permits and stack in start/end
  order at 360 pixels and 200% reflow. Long legend, guidance, values, and errors wrap without page
  overflow or calendar clipping.
- **Required stories:** `Default`, `Complete`, `StartOnly`, `InvalidBoundary`, `InvalidOrder`,
  `Disabled`, `ReadOnly`, `LongLegend`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `storybook-australian-date-range`, `storybook-australian-date-range-states`,
  `storybook-australian-date-range-narrow`, and `storybook-australian-date-range-keyboard`.
- **Used by:** [Find next available](../../capabilities/calendar/spec.md#screen-contract-find-next-available).
- **Excludes:** Parsing or validation authority, open/closed interval policy, partial dates,
  timezone conversion, presets, query execution, appointment availability, and persistence.

### DS-PAT-011 Local Time Field

- **Need:** Let staff type or deliberately choose a local appointment time while keeping the
  configured clock convention and location timezone visible.
- **Owner:** `apps/web/src/components/patterns/time-field.tsx`.
- **Semantics:** An editable `DS-PAT-008` combobox is labelled for the time fact. Supporting text
  visibly and programmatically identifies 12-hour or 24-hour entry and the caller-supplied location
  timezone label. Results are time choices, not evidence of availability or a saved booking.
- **Public contract:** Receives controlled raw query, selected canonical local-time value, open
  state, configured hour cycle, timezone label, and caller-supplied options already labelled for
  that cycle. It emits changes and explicit selection through the combobox contract. The caller
  owns parsing, option construction, timezone authority, daylight-saving resolution, validation,
  availability, and persistence.
- **States:** Empty, incomplete text, selected, open, unavailable option, invalid, disabled,
  loading, empty results, and failure remain distinct. Editing selected text clears the canonical
  selection without discarding the authored query.
- **Keyboard and focus:** Arrow keys move active focus and skip unavailable choices without
  selecting; Enter selects explicitly; Escape closes; Tab follows task order. Selection returns
  focus to the input. Result arrival never chooses a time.
- **Responsive/content:** The complete label, typed value, result details, clock convention,
  timezone, hint, and error fit at 360 pixels and 200% reflow without horizontal page overflow.
- **Required stories:** `Default`, `Selected12Hour`, `Selected24Hour`, `Incomplete`, `Loading`,
  `Empty`, `Failure`, `Invalid`, `Disabled`, `LongTimezone`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `storybook-local-time-field`, `storybook-local-time-field-states`,
  `storybook-local-time-field-narrow`, and `storybook-local-time-field-keyboard`.
- **Used by:** [Appointment editor](../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
- **Excludes:** Time parsing, clock-label formatting, timezone inference/conversion, DST resolution,
  availability, duration/end calculation, appointment validation, and persistence.

### DS-PAT-012 File Input Field

- **Need:** Let staff choose or drop one or more files, review exactly what was accepted or
  rejected, and recover from item-specific failure without treating local selection as upload,
  scanning, filing, or review.
- **Owner:** `apps/web/src/components/patterns/file-input-field.tsx`.
- **Semantics:** A visible `Field` label names a native file input and its keyboard-operable
  “Choose file(s)” button. A drop target is a pointer convenience for the same action, never the
  only path. A named list exposes caller-supplied file items, sizes, states, and item actions.
- **Public contract:** Receives native accept/multiple/capture attributes, controlled item
  descriptors, disabled state, and callbacks for selected browser `File` objects, removal, and
  optional retry. Each descriptor supplies stable ID, safe display name, size label, state
  (`selected`, `uploading`, `failed`, `complete`, or `rejected`), status text, and whether removal
  or retry is currently allowed. The caller owns validation, deduplication, limits, upload,
  cancellation, malware scanning, quarantine, persistence, and safe naming.
- **States:** Empty, drag-over, selected locally, uploading, failed, complete, rejected, and
  disabled are distinct. Complete is rendered only from caller-confirmed state and never implies
  scanning, filing, matching, legibility, or clinical review. Failed/rejected items remain visible
  with their reason and available recovery.
- **Keyboard and focus:** Tab reaches the choose button and then available per-item actions. Enter
  or Space opens the native picker. Removing or retrying one item does not move focus
  unpredictably. Dropping files invokes the same selection callback and does not bypass caller
  validation.
- **Responsive/content:** Long safe filenames, type/size/status copy, constraints, and actions wrap
  inside 360 pixels and 200% reflow. Filename extensions and failure reasons are not truncated when
  needed to distinguish the file.
- **Required stories:** `Empty`, `Selected`, `Uploading`, `Failed`, `Complete`, `Rejected`,
  `Disabled`, `LongFilename`, `Multiple`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `storybook-file-input-field`, `storybook-file-input-field-states`,
  `storybook-file-input-field-narrow`, and `storybook-file-input-field-keyboard`.
- **Used by:** [Document inbox](../../capabilities/documents/spec.md#screen-contract-document-inbox).
- **Excludes:** File acceptance/size authority, deduplication, uploading/cancellation, malware or
  quality checks, quarantine, safe rendering, patient matching, classification, filing, review,
  persistence, and permissions.

### DS-PAT-022 Numeric Field

- **Need:** Let staff enter a fee, an adjustment, a quantity or a measurement without the control
  silently changing, rounding or discarding the number they typed.
- **Owner:** `apps/web/src/components/patterns/numeric-field.tsx`.
- **Semantics:** A visible `Field` label names a text input carrying `inputmode="decimal"` rather
  than `type="number"`, whose spinner, scroll-wheel mutation and silent character rejection are all
  unsafe beside money and clinical measurements. A unit is shown as an adornment inside the control
  and is also stated to assistive technology, never left to the placeholder. Figures are tabular and
  end-aligned so amounts in a column compare.
- **Public contract:** Receives the raw text, the accepted value and a callback for each. The
  accepted value is a whole number of the smallest unit the field allows — cents at two decimal
  places, tenths at one, whole units at none — because money and measurements must not pass through
  binary floating point. It is `null` whenever the text does not describe such a value. A visible
  unit requires its spoken form. Accepts whether a negative value is permitted, and the usual hint,
  error, required, disabled and read-only state. Canonical text is written only when the operator
  leaves a field that already parses, never while they are typing. The caller owns every limit, all
  arithmetic, and what any value means.
- **States:** Empty, in progress, accepted, unparseable, and more precise than the unit allows. Text
  that does not describe a value yields no value and is preserved exactly as typed, so a mistyped fee
  is never quietly read as a different amount and an original entry survives for the record. A
  negative value yields no value unless the caller permits one, because a credit and a charge are
  different facts. Read-only and disabled stay distinct.
- **Keyboard and focus:** Native text-input behaviour. Arrow keys and the scroll wheel MUST NOT
  change the value, so an amount cannot be altered by a pointer passing over it or by a keystroke
  meant to move the caret. Leaving a parseable field rewrites the text to its canonical form without
  moving focus; leaving an unparseable one changes nothing.
- **Responsive/content:** The unit stays visible beside the entry at every width and at 200% reflow.
  Grouped input is accepted and canonical text is written ungrouped, because a separator inserted
  mid-edit moves the caret under the operator. Long labels, hints and errors wrap.
- **Required stories:** `Currency`, `Quantity`, `Measurement`, `Negative`, `Invalid`,
  `OverPrecision`, `Disabled`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `numeric-field-states`, `numeric-field-narrow`, and `numeric-field-keyboard`.
- **Used by:** [Billing checkout](../../capabilities/billing/spec.md#screen-contract-billing-checkout),
  [patient account](../../capabilities/billing/spec.md#screen-contract-patient-account), and
  [observation entry](../../capabilities/observations/spec.md#observation-entry-and-trend).
- **Excludes:** Fee schedule resolution and precedence, every calculation including totals, tax,
  adjustments and balances, the meaning of a negative value, permission for an override, plausibility
  and threshold rules, unit conversion, and any currency other than Australian dollars.

## Search and lists

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
- **Used by:** [Patient search](../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox).
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
- **Used by:** [Patient search](../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [recall worklist](../../capabilities/recalls-and-reminders/spec.md#screen-contract-recall-worklist).
- **Excludes:** Result order/rank, record disclosure, domain selection consequence, pagination,
  virtualisation, and API refresh.

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
- **Used by:** [Results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox),
  [task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [document inbox](../../capabilities/documents/spec.md#screen-contract-document-inbox).
- **Excludes:** Which records exist or may be selected, whether an action is permitted in bulk, the
  preview of what an action would do and the itemised result of having done it, which are
  `DS-PAT-021`, the mutation and its atomicity, and any bulk clinical disposition, which the results
  contract forbids outright.

## Context and data display

### DS-PAT-004 Context Banner

- **Need:** Keep the active record or workflow identity and key metadata visible while staff act.
- **Owner:** `apps/web/src/components/patterns/context-banner.tsx`.
- **Semantics:** Named section with context label, heading, optional description/status, labelled
  facts, actions, and notice region.
- **Public contract:** Accepts text/content slots and an array of labelled facts with optional
  tabular treatment. It does not know whether the context is a patient, practitioner, appointment,
  location, invoice, or other record.
- **States:** Long/missing facts, status, notice, and actions remain structurally distinct. The
  caller supplies unavailable/restricted/freshness meaning rather than omitting it ambiguously.
- **Keyboard and focus:** Actions follow the context in task order. Updating facts or status does not
  steal focus.
- **Responsive/content:** Actions wrap below context at narrow widths. Facts wrap deliberately and
  required identity/status remains visible; the banner does not become hover-only or horizontally
  clipped.
- **Required stories:** `Default`, `WithStatus`, `WithNotice`, `WithActions`, `MissingOptionalFacts`,
  `ContentStress`, and `Narrow`.
- **Evidence:** `context-banner-states` and `context-banner-narrow`.
- **Used by:** [Patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace),
  and [calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day).
- **Excludes:** Identity verification, patient/allergy semantics, permission filtering, freshness
  calculation, and action availability.

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
- **Used by:** [Patient account](../../capabilities/billing/spec.md#screen-contract-patient-account),
  [practitioner profile](../../capabilities/practitioner-management/spec.md#screen-contract-practitioner-profile-and-offboarding),
  and [care-plan workspace](../../capabilities/chronic-disease-care/spec.md#screen-contract-care-plan-workspace).
- **Excludes:** Data formatting authority, masking, permission, calculation, and record history.

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
- **Used by:** [Patient account](../../capabilities/billing/spec.md#screen-contract-patient-account),
  [task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist), and
  [waiting room](../../capabilities/calendar/spec.md#screen-contract-waiting-room).
- **Excludes:** Fetching, query construction, permission filtering, domain ordering, clinical
  priority, financial calculation, virtualisation, which records may be selected, what a selection
  may then be used for, and row-action availability.

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
- **Used by:** [Patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [clinical note editor](../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  and [observation entry](../../capabilities/observations/spec.md#observation-entry-and-trend).
- **Excludes:** Which entries exist, ordering authority, filtering, permission and sensitivity
  policy, clinical meaning, amendment authority, pagination and virtualisation.

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
- **Used by:** [Duplicate review and merge](../../capabilities/patient-registration/spec.md#screen-contract-duplicate-review-and-merge),
  [clinical note editor](../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  and [result viewer](../../capabilities/results/spec.md#screen-contract-result-viewer-and-action).
- **Excludes:** Deciding which record survives, which facts are high-risk, whether a reviewer may see
  a data class, merging free text, the merge and its atomicity, lineage, reauthentication and the
  second-person confirmation.

### DS-PAT-025 Page Header

- **Need:** Name the screen, say exactly which scope it is showing, and say how fresh that is, so no
  one acts on a stale queue or on the wrong location or date without noticing.
- **Owner:** `apps/web/src/components/patterns/page-header.tsx`.
- **Semantics:** A `banner`-free header region holding the screen's heading, its scope as named
  facts, a freshness statement and the screen-level actions. Scope is a definition list so a missing
  fact is visible rather than silently absent. The freshness sentence is announced politely and
  moves no focus.
- **Public contract:** Requires the title. Accepts the heading level, a short description, the scope
  facts as label and value pairs, a freshness state carrying an as-of instant, the IANA timezone,
  whether the view is refreshing or known to be stale, a refresh action, and the screen-level
  actions. The caller owns routing, fetching, every word and the judgement that something is stale.
- **States:** Current, refreshing, stale, and freshness not known. A refreshing header keeps the
  previous scope and as-of visible rather than blanking them, because a screen that forgets what it
  was showing while it reloads invites acting on the wrong one. Freshness that is not known says so
  rather than showing nothing, and MUST NOT be rendered as current. A repeated refresh that changes
  nothing MUST NOT announce again.
- **Keyboard and focus:** The refresh control follows the freshness it refreshes in reading order.
  Refreshing MUST NOT move focus or reorder the actions. The heading is not focusable and the header
  never takes focus on arrival.
- **Responsive/content:** The title wraps rather than truncating. Scope facts wrap as a group and
  keep their labels. Actions wrap beneath at a narrow width and every one stays reachable.
- **Required stories:** `Default`, `WithScope`, `Refreshing`, `Stale`, `UnknownFreshness`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `page-header-states`, `page-header-stale`, `page-header-narrow`, and
  `page-header-keyboard`.
- **Used by:** [Calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day),
  [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist).
- **Excludes:** Routing, fetching and refresh scheduling, deciding that a view is stale, permission
  for any action, breadcrumbs, and the record identity that `DS-PAT-004` carries.

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
- **Used by:** [Patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist).
- **Excludes:** Routing, permission filtering, deriving any count, freshness, section order, and
  whether a section may be reached at all.

## Data and operation states

### DS-PAT-005 State Panel

- **Need:** Give empty, loading, unavailable, offline, restricted, and failure outcomes visibly and
  semantically different presentations with an optional safe recovery action.
- **Owner:** `apps/web/src/components/patterns/state-panel.tsx`.
- **Semantics:** Named section/region; loading carries busy/live semantics and failure carries alert
  semantics when newly inserted. Iconography supplements the state title and description.
- **Public contract:** Requires kind and title; accepts description, details, action, and compact
  density. Capability copy names scope, failed dependency, freshness, or recovery. `details` carries
  evidence the reader needs, such as what was searched for; a caller MUST NOT pass decoration that
  competes with the mark the state already supplies.
- **States:** Each supported kind has distinct structure, icon, and semantic-token treatment. Empty
  never substitutes for failure/unavailable; restricted never leaks protected content; offline
  labels cached content and unsafe writes separately.
- **Keyboard and focus:** The panel itself does not take focus unless a screen deliberately targets
  its heading/summary after a failed action. Recovery action is fully named and follows the message.
- **Responsive/content:** Copy and action stack without truncation. Compact changes spacing, not
  meaning or target size.
- **Required stories:** `Empty`, `Loading`, `Unavailable`, `Offline`, `Restricted`, `Failure`,
  `WithRecovery`, `Compact`, `ContentStress`, and `Narrow`.
- **Evidence:** `state-panel-kinds`, `state-panel-recovery`, and `state-panel-narrow`.
- **Used by:** [Patient search](../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day), and
  [patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Detecting the state, retry safety, cached-data policy, permission escalation, and
  capability-specific copy.

### DS-PAT-013 Consequence Confirmation

- **Need:** Make a destructive or corrective action explain its exact target, consequence, retained
  history, downstream effects, and safer alternative in one reviewed structure, so no capability has
  to re-derive the shape of a safe confirmation.
- **Owner:** `apps/web/src/components/patterns/consequence-confirmation.tsx`.
- **Semantics:** Composes the Dialog atom. The title names the action, the description carries the
  consequence, and the disclosures are a definition list so an omitted disclosure is visible rather
  than silently absent. A required reason uses the Field contract; a required acknowledgement uses
  the Checkbox contract. Failure carries alert semantics inside the retained dialog.
- **Public contract:** Requires open state, an action title, an exact target, a consequence
  statement, a confirm label, and a confirm callback. Accepts the operating context, retained
  history, downstream effects, a safer alternative, a controlled required reason, a controlled
  required acknowledgement, submitting and failure state, and a corrective or destructive severity.
  The caller owns the mutation, the permission decision, and every word of consequence copy.
- **States:** Ready, blocked by an unmet precondition, submitting, and failed. Submitting disables
  the consequential action without hiding the disclosures. Failure keeps the dialog, the entered
  reason, and the acknowledgement recoverable, and never reports partial success. Dismissal by
  Escape, overlay, close, or cancel MUST NOT confirm. A blocked confirm names the unmet precondition
  at the point of need rather than presenting an unexplained disabled control.
- **Keyboard and focus:** Opening moves focus to the reason field when one is required and otherwise
  into the disclosure body; it MUST NOT open with focus on the consequential action. Cancel precedes
  confirm in the tab order. Escape closes only while not submitting. Focus returns to the invoking
  control on dismissal, and moves to the failure message when a submission fails.
- **Responsive/content:** Disclosures stack and wrap without truncation; a long target, reason, or
  downstream list scrolls inside the dialog while the title, consequence, and final actions stay
  visible, clear of the scrollbar. Narrow layout stacks the two actions with visible separation and
  the consequential action furthest from the thumb-resting position, while the tab order still
  reaches cancel first. Severity is carried by wording and structure as well as colour.
- **Required stories:** `Default`, `Corrective`, `WithReason`, `WithAcknowledgement`, `Blocked`,
  `Submitting`, `FailedSubmit`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `confirmation-disclosures`, `confirmation-blocked`, `confirmation-failure`,
  `confirmation-narrow`, and `confirmation-keyboard`.
- **Used by:** [Patient search](../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [complete consultation](../../capabilities/consultations/spec.md#dialog-contract-complete-consultation),
  and [calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day).
- **Excludes:** Deciding that an action is destructive, consequence and recovery wording, permission
  and elevation checks, reauthentication, proving that a second authorised person acknowledged,
  mutation, idempotency, retry safety, and audit.

### DS-PAT-014 Toast Region

- **Need:** Report the outcome of a completed or failed operation where the operator is looking,
  and announce it to assistive technology, without moving focus away from the task in hand.
- **Owner:** `apps/web/src/components/patterns/toast-region.tsx`.
- **Semantics:** A labelled landmark holding an ordered list of outcome messages, paired with two
  live regions that exist for the life of the component. Routine confirmation and status use the
  polite region; a failed operation uses the assertive one. The visible stack is NOT itself a live
  region, so a message is announced once and its controls are not read as part of it.
- **Public contract:** Requires the controlled list of messages and a dismissal callback. Each
  message requires a stable identity, a tone, and a title naming the object and the action, and
  accepts a description, a single recovery or undo action, and an explicit announcement string. The
  caller owns every word, the operation, and when a message is removed.
- **States:** Success, routine status, and failure. Success wording is only correct after a durable
  commit. A failure states what did not happen and what remains unchanged, and offers the safe next
  step as a control. Re-supplying an unchanged message under its existing identity MUST NOT announce
  it again, so a background refresh cannot repeat itself.
- **Keyboard and focus:** Arrival never moves focus. Every message exposes a dismissal control named
  with its title, and any recovery action is reachable in reading order before it. The region owns
  no timer: a message stays until the caller removes it or the operator dismisses it, so an outcome
  cannot expire before it has been read.
- **Responsive/content:** Messages stack from the bottom edge on narrow screens and from the bottom
  right otherwise, and are bounded in width. A long partial-failure description wraps in full rather
  than truncating, because a hidden clause can turn a partial result into an apparent success. Tone
  is carried by an icon and a leading word as well as by colour.
- **Required stories:** `Default`, `Tones`, `FailureWithRecovery`, `WithUndo`, `ContentStress`,
  `Narrow`, `Announcement`, and `KeyboardFlow`.
- **Evidence:** `toast-tones`, `toast-failure`, `toast-content-stress`, `toast-narrow`,
  `toast-announcement`, and `toast-keyboard`.
- **Used by:** [Calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day) and
  [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Deciding that an operation succeeded, retry and idempotency, wording, how long a
  message should remain, persistent or reviewable notification history, and any message that carries
  required instructions or a decision the operator must not miss.

### DS-PAT-015 Save State

- **Need:** Say whether the operator's work is durably on the record, beside the editor that
  produced it, so pending, locally held, failed and overtaken work are never mistaken for saved.
- **Owner:** `apps/web/src/components/patterns/save-state.tsx`.
- **Semantics:** A compact status line composing an icon, its own wording and an optional recovery
  action. The visible text may be abbreviated for a dense header; the announced form is a separate
  hidden line and is not abbreviated.
- **Public contract:** Requires the state and the IANA timezone any instant is shown in, and accepts
  a subject label and the recovery or reconciliation action the state offers. The caller owns the
  save, the autosave cadence, the draft's binding to patient, encounter and author, and the conflict
  resolution itself.
- **States:** Unsaved, saving, saved, held locally, failed and changed elsewhere. These MUST remain
  visibly distinct. Only a durable commit may use the word saved; locally recovered work states in
  its visible text that it is not on the record. A failure states what happened and never implies
  the entered text was lost. A newer version by another author is reported rather than merged.
- **Keyboard and focus:** The line never moves focus, because autosave that pulls the cursor out of
  a clinical note costs more than the message is worth. It announces politely. Any recovery action
  is a normal control in reading order after the state.
- **Responsive/content:** The state wraps rather than truncating, and stays legible beside a long
  subject label. Motion on the saving state is supplemental and honours reduced motion.
- **Required stories:** `Default`, `Saving`, `Saved`, `LocalOnly`, `FailedSave`, `Conflict`,
  `AllStates`, `Narrow`, and `InEditor`.
- **Evidence:** `save-state-kinds`, `save-state-local`, `save-state-failure`, `save-state-narrow`,
  and `save-state-editor`.
- **Used by:** [Clinical note editor](../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace),
  and [patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration).
- **Excludes:** Performing or scheduling the save, autosave cadence, draft storage and its binding to
  patient, encounter and author, conflict comparison and merge, completion rules, and permission.

### DS-PAT-016 Form Error Summary

- **Need:** Gather every field that needs correcting into one list the operator can act from, once
  more than one field or region is affected and an error can sit in a section that is scrolled out
  of view.
- **Owner:** `apps/web/src/components/patterns/form-error-summary.tsx`.
- **Semantics:** A labelled group listing one entry per affected field. Each entry names its section
  and field label, carries the same message the field carries, and links to that control. It
  supplements the per-field error required by the Field contract and never replaces it.
- **Public contract:** Requires the ordered errors, each with the target control's id, its label and
  its message, and accepts a section name per error, a title and the submit attempt being reported.
  The caller owns validation, the wording and which attempt failed.
- **States:** Absent when there is nothing to correct. Present with one or many entries. A repeated
  failing submit under a new attempt is reported again rather than silently ignored.
- **Keyboard and focus:** Announced exactly once: a caller that supplies the attempt has focus moved
  to the summary, which reads it; a caller that does not gets a live region instead. Focus lands on
  the summary rather than the first field, so the operator sees the whole list before being dropped
  into one control. Activating an entry moves focus to its control and brings it into view.
- **Responsive/content:** Long section, label and message text wraps in full. The list stays in the
  form's own order so the operator can work down it.
- **Required stories:** `Default`, `SingleError`, `Grouped`, `ContentStress`, `Narrow`, and
  `KeyboardFlow`.
- **Evidence:** `error-summary-list`, `error-summary-single`, `error-summary-narrow`, and
  `error-summary-keyboard`.
- **Used by:** [Patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Validation rules and authority, message wording, deciding when a form may be
  submitted, clearing or preserving other sections, and permission.

### DS-PAT-017 Form Section

- **Need:** Make one labelled region of a long form a real, navigable group rather than a visual gap,
  so an operator can tell which part of a registration or consultation they are in.
- **Owner:** `apps/web/src/components/patterns/form-section.tsx`.
- **Semantics:** A labelled group whose heading names the region and whose description is associated
  with the group rather than floating beside it. It carries no fields of its own; the Field contract
  still owns every label, hint and error inside it.
- **Public contract:** Requires the title and the section's content, and accepts a description, the
  heading level, an outstanding problem count, an optional marker and an id. The caller owns
  validation, which fields belong to the region, and which roles may see it.
- **States:** Ordinary, optional and carrying outstanding problems. An optional section MUST read as
  one a role may fill in later rather than one they failed to complete. A problem count appears only
  when it is above zero, and one problem is counted in the singular.
- **Keyboard and focus:** The group is not focusable and takes no focus of its own. Its heading level
  is supplied rather than assumed, because a form that jumps a level cannot be navigated by heading.
- **Responsive/content:** A long title, description and optional marker wrap without truncation, and
  the marker stays beside the title rather than below it while there is room.
- **Required stories:** `Default`, `Optional`, `WithProblems`, `Nested`, `ContentStress`, and
  `Narrow`.
- **Evidence:** `form-section-states` and `form-section-narrow`.
- **Used by:** [Patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Validation and its authority, which fields belong to a region, permission and
  role-dependent visibility, save behaviour, and progressive-disclosure policy.

### DS-PAT-018 Collapsible Section

- **Need:** Let a dense summary be closed to make room for the task without closing away the facts
  the operator must not miss.
- **Owner:** `apps/web/src/components/patterns/collapsible-section.tsx`.
- **Semantics:** A labelled section whose heading contains the disclosure control, with an indicator
  region that renders outside the collapsible body and therefore stays visible in both states.
- **Public contract:** Requires the title, the controlled open state, its change callback and the
  body, and accepts the safety indicators, a short summary of what is inside, the heading level and
  an id. The caller decides which facts are indicators.
- **States:** Open and closed. A closed section MUST continue to expose its safety indicators, and
  the summary keeps the size of what is inside visible so closing does not hide that there is
  anything there. The body is unmounted while closed rather than hidden, so nothing inside it stays
  in the tab order or is read while it is not visible.
- **Keyboard and focus:** The disclosure is a native button inside the heading, carries
  `aria-expanded`, and points at the body with `aria-controls` while that body exists. Toggling
  never moves focus off the control. Rotation of the chevron is supplemental and honours reduced
  motion.
- **Responsive/content:** Indicators wrap below the title when the row runs out of room and are
  never truncated, because a shortened allergy is a clinical risk. A long title wraps.
- **Required stories:** `Default`, `Closed`, `WithIndicators`, `ContentStress`, `Narrow`, and
  `KeyboardFlow`.
- **Evidence:** `collapsible-open`, `collapsible-closed`, `collapsible-narrow`, and
  `collapsible-keyboard`.
- **Used by:** [Consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace)
  and [patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Deciding which facts are safety indicators, allergy and warning meaning, what the
  summary counts, remembering the open state across visits, and permission.

### DS-PAT-019 Action Bar

- **Need:** End a form, a checkout or a completion area with one unmistakable primary action, its
  supporting choices still discoverable, and a plain reason when it cannot be taken.
- **Owner:** `apps/web/src/components/patterns/action-bar.tsx`.
- **Semantics:** A named region holding an optional status, visible secondary actions, an optional
  overflow menu composing the Dropdown Menu atom, and exactly one primary action. The primary is a
  single value rather than a list, so a region cannot acquire two filled actions by accident.
- **Public contract:** Requires the primary action and its callback, and accepts secondary actions,
  overflow actions, a blocking reason, a status slot and a region label. The caller owns
  availability, permission, whether an action is destructive, and every word.
- **States:** Ready, busy and blocked. A busy primary is disabled, keeps its accessible name and
  does not hide the other actions. A blocked primary names the failed precondition beside it and is
  described by that reason, rather than presenting an unexplained disabled control. Presence in the
  bar never implies the action is permitted.
- **Keyboard and focus:** Actions follow task order, with the primary last so a supporting choice is
  reached before the consequential one. The overflow trigger is a named control that returns focus
  to itself. Changing status does not move focus.
- **Responsive/content:** The actions wrap as one group so the primary is never stranded on a line
  away from the choice that avoids it, and the primary stays visible at narrow widths. A long status
  wraps above the actions rather than compressing them. The blocking reason is placed before the row
  so it is read before the control it explains.
- **Required stories:** `Default`, `WithStatus`, `Busy`, `Blocked`, `Destructive`, `WithOverflow`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `action-bar-states`, `action-bar-blocked`, `action-bar-narrow`, and
  `action-bar-keyboard`.
- **Used by:** [Billing checkout](../../capabilities/billing/spec.md#screen-contract-billing-checkout),
  [patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration),
  and [consultation workspace](../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Deciding availability, permission and elevation, whether an action is destructive,
  the consequence and its confirmation, the mutation and its retry safety, and keeping a frequent or
  safety-critical action out of the overflow, which remains the caller's duty.

### DS-PAT-021 Itemised Outcome

- **Need:** Show what an operation across many records would do, and then what it actually did, so a
  partial result cannot read as complete success and every record that did not change keeps its
  identity and its reason.
- **Owner:** `apps/web/src/components/patterns/itemised-outcome.tsx`.
- **Semantics:** A labelled region whose summary counts each outcome, followed by the records
  grouped by outcome with the ones needing attention first. The same structure serves the preview
  before commit and the result afterwards, so an operator reads the record list in one shape twice.
  A result containing a failure carries alert semantics; a preview never does, because nothing has
  happened yet.
- **Public contract:** Requires the phase, a heading, the singular and plural noun for what is
  counted, and the items, each with a stable key, the record's name, and an outcome. The phase
  constrains the permitted outcomes by type: a preview may only say `ready` or `blocked`, and a
  result may only say `applied`, `failed`, or `skipped`. Each item accepts a reason and a single
  recovery action. The caller owns the operation, whether a retry is safe, and every word.
- **States:** Preview with every record ready; preview with blocked records; complete success;
  partial success; nothing applied; and an operation still running, which claims no outcome for a
  record it has not reached. Records that succeeded MAY be collapsed through `DS-PAT-018` because
  they need no further work; records that failed, were skipped, or are blocked MUST remain visible.
  A summary MUST NOT state a total that its items do not account for.
- **Keyboard and focus:** Arrival does not move focus. Every recovery action is a control in
  reading order beside the record it belongs to. Expanding the applied records does not move focus
  into them, and the records needing attention stay above the disclosure.
- **Responsive/content:** A long record name or reason wraps in full rather than truncating, because
  a hidden clause can turn a partial result into an apparent success. Counts use tabular figures.
  Outcome is carried by an icon and a word as well as by colour, and the region stacks without
  overflow at a narrow width.
- **Required stories:** `Preview`, `PreviewBlocked`, `Applied`, `PartialFailure`, `NothingApplied`,
  `InProgress`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `itemised-preview`, `itemised-partial-failure`, `itemised-narrow`, and
  `itemised-keyboard`.
- **Used by:** [Task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist),
  [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [practitioner offboarding](../../capabilities/practitioner-management/spec.md#screen-contract-practitioner-profile-and-offboarding).
- **Excludes:** Performing the operation, deciding that a record is blocked or that a retry is safe,
  the wording of any reason, atomicity and idempotency, audit, and reporting a single-record outcome,
  which stays with `DS-PAT-014`.

## Superseded or overlapping foundations

`apps/web/src/components/empty-state.tsx` was assessed and removed. It forwarded to `StatePanel` and
passed a second decorative icon into the `details` slot, so an empty outcome rendered two icons: the
one the state chose and the one the caller supplied. No consumer needed anything `StatePanel`
did not already own, so there was no distinct reusable need to document. Its two consumers — patient
search and location settings — now render `DS-PAT-005 State Panel` with `kind="empty"` directly,
keeping their title, description and density. An empty outcome carries exactly one icon, and it is
the one the state means.

A caller MUST NOT reintroduce a second empty-state foundation. `details` carries evidence a reader
needs, such as what was searched for; it is not a slot for decoration that competes with the state's
own mark.
