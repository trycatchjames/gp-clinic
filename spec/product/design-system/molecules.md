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
  semantic table; a table is never placed directly inside another table row.
- **Public contract:** Receives rows, stable row keys, column definitions and rendered values.
  Sorting, pagination, page size, and expanded row keys are controlled values with callbacks. A
  sortable column supplies its accessible sort label. Numeric/currency columns request end
  alignment. The caller supplies empty/loading/failure content outside the table body.
- **States:** Sort direction is visible and announced. First/previous/next/last controls reflect
  page boundaries. Expansion uses `aria-expanded`, `aria-controls`, a non-colour chevron cue, and
  a caller-supplied row label. Changing sort or page MUST NOT imply row selection or domain action.
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
  priority, financial calculation, virtualisation, bulk actions, and row-action availability.

## Data and operation states

### DS-PAT-005 State Panel

- **Need:** Give empty, loading, unavailable, offline, restricted, and failure outcomes visibly and
  semantically different presentations with an optional safe recovery action.
- **Owner:** `apps/web/src/components/patterns/state-panel.tsx`.
- **Semantics:** Named section/region; loading carries busy/live semantics and failure carries alert
  semantics when newly inserted. Iconography supplements the state title and description.
- **Public contract:** Requires kind and title; accepts description, details, action, and compact
  density. Capability copy names scope, failed dependency, freshness, or recovery.
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

## Superseded or overlapping foundations

`apps/web/src/components/empty-state.tsx` is not a separate maintained contract while `StatePanel`
owns the reusable empty-state semantics. Its consumers must be assessed during implementation:
either migrate them without behaviour loss or document a distinct reusable need before retaining a
second foundation.
