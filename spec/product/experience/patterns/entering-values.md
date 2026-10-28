# Entering a value

## The problem

Clinical and administrative data is mostly typed by someone who already knows the answer and wants
the control out of the way. A field that reformats as they type, guesses a missing month, or
quietly rounds a dose is worse than a slow one: it changes the value without the person noticing.

This page covers single values — text, dates, times, numbers, files and controlled choices. How
they are grouped into a form is [another pattern](organising-a-form.md).

## Rules

- A control MUST NOT change the value the person entered. No reformatting mid-typing, no silent
  rounding, no inferred precision.
- Preserve partial and estimated date precision. Never manufacture a missing day or month.
- A date-only value is never converted through a timezone that could change its calendar day.
  Taking the calendar date of an instant requires the caller to name the timezone.
- Visible labels are the default. A placeholder is an example, not a label.
- Use the shared formatters in `apps/web/src/lib/formatters.ts` rather than a local `Intl`
  instance. They format accepted values for display; they do not parse input or validate it.
- An invalid value keeps what the person typed, names the problem next to the control, and implies
  nothing about having saved.
- Every control reachable and operable by keyboard, with a complete accessible name.

## First reference

The onboarding steps, `apps/web/src/routes/onboarding/`, plus register, login and accept
invitation. All consume `Field`; none yet uses the date, time, numeric, combobox or file controls
on real data.

## Settled by

Field and field group by DS-017; the Australian date, date range and local time controls by
DS-011, DS-012 and DS-013; file input by DS-014; numeric by DS-027; combobox by DS-010. Display
formatting was standardised by DS-006. The no-change-under-the-user rule is DS-027's title and
applies to every control here.

## Contracts

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
- **Used by:** [Patient registration](../../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [appointment editor](../../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
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
- **Used by:** [Referral editor](../../../capabilities/referrals/spec.md#screen-contract-referral-editor).
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
- **Used by:** [Appointment editor](../../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
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
- **Used by:** [Find next available](../../../capabilities/calendar/spec.md#screen-contract-find-next-available).
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
- **Used by:** [Appointment editor](../../../capabilities/calendar/spec.md#screen-contract-appointment-editor).
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
- **Used by:** [Document inbox](../../../capabilities/documents/spec.md#screen-contract-document-inbox).
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
- **Used by:** [Billing checkout](../../../capabilities/billing/spec.md#screen-contract-billing-checkout),
  [patient account](../../../capabilities/billing/spec.md#screen-contract-patient-account), and
  [observation entry](../../../capabilities/observations/spec.md#observation-entry-and-trend).
- **Excludes:** Fee schedule resolution and precedence, every calculation including totals, tax,
  adjustments and balances, the meaning of a negative value, permission for an override, plausibility
  and threshold rules, unit conversion, and any currency other than Australian dollars.

## Search and lists

