# Atom catalogue

## Catalogue rules

Atoms own accessible primitive semantics, interaction mechanics, and token-based variants. Global
state, responsive, and content rules apply in addition to each entry below. Source APIs may expose
native attributes required for composition but MUST NOT expose raw visual-token selection.

| ID | Atom | Group | Source |
|---|---|---|---|
| `DS-ACT-001` | Button | action | `apps/web/src/components/ui/button.tsx` |
| `DS-DSP-001` | Badge | display | `apps/web/src/components/ui/badge.tsx` |
| `DS-FBK-001` | Alert | feedback | `apps/web/src/components/ui/alert.tsx` |
| `DS-DSP-002` | Card | display | `apps/web/src/components/ui/card.tsx` |
| `DS-DSP-003` | Avatar | display | `apps/web/src/components/ui/avatar.tsx` |
| `DS-FRM-001` | Input | form | `apps/web/src/components/ui/input.tsx` |
| `DS-FRM-002` | Textarea | form | `apps/web/src/components/ui/textarea.tsx` |
| `DS-FRM-003` | Label | form | `apps/web/src/components/ui/label.tsx` |
| `DS-FRM-004` | Checkbox | form | `apps/web/src/components/ui/checkbox.tsx` |
| `DS-FRM-005` | Radio Group | form | `apps/web/src/components/ui/radio-group.tsx` |
| `DS-FRM-006` | Switch | form | `apps/web/src/components/ui/switch.tsx` |
| `DS-FRM-007` | Select | form | `apps/web/src/components/ui/select.tsx` |
| `DS-NAV-001` | Tabs | navigation | `apps/web/src/components/ui/tabs.tsx` |
| `DS-DSP-004` | Table | display | `apps/web/src/components/ui/table.tsx` |
| `DS-OVR-001` | Dialog | overlay | `apps/web/src/components/ui/dialog.tsx` |
| `DS-OVR-002` | Dropdown Menu | overlay | `apps/web/src/components/ui/dropdown-menu.tsx` |
| `DS-FBK-002` | Progress | feedback | `apps/web/src/components/ui/progress.tsx` |
| `DS-DSP-005` | Separator | display | `apps/web/src/components/ui/separator.tsx` |
| `DS-FBK-003` | Skeleton | feedback | `apps/web/src/components/ui/skeleton.tsx` |
| `DS-OVR-003` | Tooltip | overlay | `apps/web/src/components/ui/tooltip.tsx` |

## Actions

### DS-ACT-001 Button

- **Need:** Let staff invoke a clearly prioritised action with predictable keyboard, pointer, and
  disabled behaviour.
- **Owner:** `apps/web/src/components/ui/button.tsx`.
- **Semantics:** Renders a native button by default or transfers the same contract to a compatible
  child. Icon-only buttons require an accessible name.
- **Public contract:** Semantic variants are primary/default, secondary, outline, ghost, link, and
  destructive. Sizes are default, small, large, and icon. Variants express hierarchy or
  consequence; size does not change meaning.
- **States:** Hover, focus, active, disabled, and loading presentation are distinct where relevant.
  A loading button remains named and prevents duplicate activation without claiming success.
- **Keyboard and focus:** Space and Enter activate native button behaviour. Focus remains visible.
  Disabled controls do not activate; a material disabled reason is supplied by the composition.
- **Responsive/content:** Text wraps or the action region reflows rather than clipping a required
  label. Icon-only presentation is not used when the icon would be unfamiliar.
- **Required stories:** `Default`, `Hierarchy`, `Destructive`, `Disabled`, `Loading`,
  `IconAccessibleName`, `KeyboardFlow`, and `ContentStress`.
- **Evidence:** `button-hierarchy`, `button-states`, and `button-keyboard`.
- **Used by:** [Appointment editor](../../capabilities/calendar/spec.md#screen-contract-appointment-editor)
  and [consultation completion](../../capabilities/consultations/spec.md#dialog-contract-complete-consultation).
- **Excludes:** Permission, transition validity, idempotency, confirmation requirements, and save
  outcomes remain capability-owned.

## Feedback and status

### DS-FBK-001 Alert

- **Need:** Present a concise notice, warning, or failure next to the affected task.
- **Owner:** `apps/web/src/components/ui/alert.tsx`.
- **Semantics:** Groups a title, description, and optional familiar icon. Announcement urgency
  matches the event: static information is not asserted as a new emergency; failed consequential
  actions are announced when inserted.
- **Public contract:** Default, information, warning, and destructive appearances use semantic
  tokens. The caller supplies task-specific text and any recovery action.
- **States:** Information, warning, and failure remain distinguishable without colour. Long or
  multiline content remains readable and is not truncated where meaning matters.
- **Keyboard and focus:** The alert does not steal focus. Interactive recovery controls follow the
  message in task order.
- **Responsive/content:** Text and actions stack without hiding the affected object, consequence,
  or recovery.
- **Required stories:** `Default`, `Information`, `Warning`, `Failure`, `WithRecovery`,
  `DynamicAnnouncement`, and `ContentStress`.
- **Evidence:** `alert-semantics` and `alert-announcement`.
- **Used by:** [Prescription editor](../../capabilities/prescribing/spec.md#screen-contract-prescription-editor)
  and [result viewer](../../capabilities/results/spec.md#screen-contract-result-viewer-and-action).
- **Excludes:** Determining clinical severity, validation outcome, permission, or whether retry is safe.

### DS-FBK-002 Progress

- **Need:** Show the completion of a bounded operation without making animation the only status.
- **Owner:** `apps/web/src/components/ui/progress.tsx`.
- **Semantics:** Uses progressbar semantics with an accessible name and value. A visible or
  programmatic textual status supplies context.
- **Public contract:** Supports determinate progress from 0-100. Indeterminate activity requires a
  separately specified presentation rather than a fabricated percentage.
- **States:** Zero, partial, complete, and unavailable values are distinct. Complete presentation
  does not imply a domain save or workflow outcome unless the capability confirms it.
- **Keyboard and focus:** Non-interactive and excluded from the tab order.
- **Responsive/content:** The bar may resize but its label/value remains available and reduced
  motion loses no information.
- **Required stories:** `Zero`, `Partial`, `Complete`, `Labelled`, and `ReducedMotion`.
- **Evidence:** `progress-values`.
- **Used by:** Retained from the delivered UI foundation; no capability may assign domain meaning
  until its accepted screen contract establishes the need.
- **Excludes:** Workflow stage, clinical progress, elapsed time, and save-state inference.

### DS-FBK-003 Skeleton

- **Need:** Preserve useful layout geometry while content is loading.
- **Owner:** `apps/web/src/components/ui/skeleton.tsx`.
- **Semantics:** Decorative placeholder inside a container that carries the accessible loading name
  and busy state. It does not represent unavailable or empty content.
- **Public contract:** Shape follows the expected content closely enough to reduce avoidable layout
  shift. Animation uses the muted token and honours reduced motion.
- **States:** Loading only; a skeleton MUST be replaced by explicit empty, unavailable, partial,
  restricted, or failure presentation when that state becomes known.
- **Keyboard and focus:** Never focusable and never substitutes for a disabled interactive control.
- **Responsive/content:** Geometry follows the responsive layout rather than preserving a desktop
  shape at narrow widths.
- **Required stories:** `Text`, `Card`, `TableGeometry`, `Narrow`, and `ReducedMotion`.
- **Evidence:** `skeleton-geometry`.
- **Used by:** [Calendar day](../../capabilities/calendar/spec.md#screen-contract-calendar-day)
  and [patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Fetching, delay thresholds, stale-data decisions, and retry behaviour.

### DS-DSP-001 Badge

- **Need:** Add a compact textual status or category without overpowering the task object.
- **Owner:** `apps/web/src/components/ui/badge.tsx`.
- **Semantics:** Supplemental inline text; not an interactive control unless composed with a
  compatible interactive element whose semantics remain clear.
- **Public contract:** Default, secondary, outline, destructive, success, warning, and information
  variants. Semantic variants are used only for the matching meaning.
- **States:** Status text or a familiar icon accompanies colour. A badge is not used to disguise
  unknown, unavailable, or restricted information as a normal value.
- **Keyboard and focus:** Static badges are not focusable.
- **Responsive/content:** Labels remain concise but may wrap where truncation would change meaning.
- **Required stories:** `Variants`, `WithIcon`, `LongLabel`, and `OnColouredSurface`.
- **Evidence:** `badge-semantic-variants`.
- **Used by:** [Patient search](../../capabilities/patient-search/spec.md#screen-contract-patient-search)
  and [results inbox](../../capabilities/results/spec.md#screen-contract-results-inbox).
- **Excludes:** Computing lifecycle, urgency, permission, verification, or priority.

## Form controls

### DS-FRM-001 Input

- **Need:** Capture one line of text, numeric, date, time, search, or other native input with
  predictable browser behaviour.
- **Owner:** `apps/web/src/components/ui/input.tsx`.
- **Semantics:** Preserves native input type and attributes. It is used with `Field` unless an
  equally complete visible-label and description/error relationship is supplied.
- **Public contract:** Normal, placeholder, focus, disabled, read-only, and invalid mechanics.
  Input type, autocomplete, input mode, masking, and value ownership come from the caller.
- **States:** Invalid styling follows `aria-invalid`; error text remains associated and values are
  preserved. Disabled and read-only are not interchangeable.
- **Keyboard and focus:** Native editing and focus semantics remain intact.
- **Responsive/content:** Minimum width may shrink inside a composition without clipping input,
  label, error, or required affordance.
- **Required stories:** `Default`, `TypedValues`, `Disabled`, `ReadOnly`, `Invalid`, `LongValue`, and
  `KeyboardFlow`.
- **Evidence:** `input-states` and `input-keyboard`.
- **Used by:** [Patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration).
- **Excludes:** Australian date parsing, masking policy, validation authority, duplicate checking,
  and persistence.

### DS-FRM-002 Textarea

- **Need:** Capture multiline text while preserving legibility and recoverable content.
- **Owner:** `apps/web/src/components/ui/textarea.tsx`.
- **Semantics:** Native textarea used with `Field` or an equivalent complete label/error contract.
- **Public contract:** Normal, focus, disabled, read-only, invalid, and content-growth mechanics.
  The caller owns value, limits, save/recovery, and paste policy.
- **States:** Invalid and failed-save presentation does not clear or replace entered text.
- **Keyboard and focus:** Native multiline editing, selection, undo, redo, and paste remain available.
- **Responsive/content:** Long text wraps and the control grows or scrolls without obscuring the
  label, error, or adjacent save state.
- **Required stories:** `Default`, `Disabled`, `ReadOnly`, `Invalid`, `LongContent`, and `KeyboardFlow`.
- **Evidence:** `textarea-states` and `textarea-content-stress`.
- **Used by:** [Clinical note editor](../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor).
- **Excludes:** Clinical templates, rich-text behaviour, draft recovery, conflict merging, and
  completion rules.

### DS-FRM-003 Label

- **Need:** Give a form control a visible, programmatically associated name.
- **Owner:** `apps/web/src/components/ui/label.tsx`.
- **Semantics:** Uses native/Radix label behaviour and targets one form control.
- **Public contract:** Supports concise text plus required or supporting indicators supplied by a
  composition. Placeholder text does not replace it.
- **States:** Disabled styling follows the associated control without removing the accessible name.
- **Keyboard and focus:** Activating a label focuses or toggles its associated control as expected.
- **Responsive/content:** Long labels wrap without becoming detached from their controls.
- **Required stories:** `Default`, `LongLabel`, `DisabledControl`, and `KeyboardFlow`.
- **Evidence:** `label-association`.
- **Used by:** [Patient registration](../../capabilities/patient-registration/spec.md#screen-contract-patient-registration).
- **Excludes:** Hint, error, required-state, and group layout; `Field` owns that composition.

### DS-FRM-004 Checkbox

- **Need:** Let staff include or acknowledge independent choices.
- **Owner:** `apps/web/src/components/ui/checkbox.tsx`.
- **Semantics:** Checkbox with an associated visible label. It is not used for mutually exclusive
  choices or an immediate on/off system setting.
- **Public contract:** Unchecked, checked, indeterminate when supported by the caller, focus, and
  disabled mechanics.
- **States:** Selection uses native/Radix state plus a tick, not colour alone. Required validation
  is supplied by the form composition.
- **Keyboard and focus:** Space toggles; focus is visible; label activation works.
- **Responsive/content:** Multi-line labels keep the target aligned and remain fully clickable.
- **Required stories:** `Unchecked`, `Checked`, `Indeterminate`, `Disabled`, `LongLabel`, and
  `KeyboardFlow`.
- **Evidence:** `checkbox-states` and `checkbox-keyboard`.
- **Used by:** [Referral editor](../../capabilities/referrals/spec.md#screen-contract-referral-editor).
- **Excludes:** Consent authority, clinical-content inclusion rules, and form persistence.

### DS-FRM-005 Radio Group

- **Need:** Choose exactly one option from a small, visible set.
- **Owner:** `apps/web/src/components/ui/radio-group.tsx`.
- **Semantics:** A named group of radio items with visible labels. Use Select or a future combobox
  when the option set is too large for direct comparison.
- **Public contract:** Unselected, selected, focus, and disabled item/group mechanics.
- **States:** Selection is explicit and non-colour. Unknown/no selection is not silently converted
  to the first option unless the capability defines a safe default.
- **Keyboard and focus:** Arrow keys move/select according to the radio-group model; Space selects
  the focused option.
- **Responsive/content:** Options stack when horizontal layout would crowd labels or targets.
- **Required stories:** `Default`, `WithSelection`, `DisabledOption`, `NoDefault`, `LongLabels`, and
  `KeyboardFlow`.
- **Evidence:** `radio-group-states` and `radio-group-keyboard`.
- **Used by:** [Billing checkout](../../capabilities/billing/spec.md#screen-contract-billing-checkout).
- **Excludes:** Safe defaults, billing arrangements, clinical choices, and save outcomes.

### DS-FRM-006 Switch

- **Need:** Change a binary setting whose effect is immediate and clearly reversible.
- **Owner:** `apps/web/src/components/ui/switch.tsx`.
- **Semantics:** Switch with an associated visible label and current checked state. Use Checkbox
  when the value is submitted with a form or represents inclusion/acknowledgement.
- **Public contract:** On, off, focus, and disabled mechanics.
- **States:** On/off is communicated semantically and visually beyond colour. Pending persistence
  MUST NOT appear settled; the capability may disable or roll back with explicit failure.
- **Keyboard and focus:** Space toggles and focus remains visible.
- **Responsive/content:** Label and control remain associated when stacked.
- **Required stories:** `Off`, `On`, `Disabled`, `Pending`, `FailedChange`, and `KeyboardFlow`.
- **Evidence:** `switch-states` and `switch-keyboard`.
- **Used by:** [Practice settings](../../capabilities/practice-management/spec.md#screen-contract-practice-settings).
- **Excludes:** Permission, persistence, optimistic-update policy, and the meaning of the setting.

### DS-FRM-007 Select

- **Need:** Choose one value from a finite, known option set without displaying all options at once.
- **Owner:** `apps/web/src/components/ui/select.tsx`.
- **Semantics:** A labelled select trigger and listbox-style popup with grouped/disabled options as
  needed. It is not a searchable directory or patient lookup.
- **Public contract:** Default/small trigger sizes; placeholder, selected value, grouped options,
  disabled options, focus, invalid, open, and closed mechanics.
- **States:** Placeholder is distinct from a selected empty/unknown value. Invalid state retains the
  attempted selection and associated error.
- **Keyboard and focus:** Established select navigation, type-ahead, activation, Escape, and focus
  return apply.
- **Responsive/content:** Trigger and popup expose full meaningful option text; long labels do not
  hide distinguishing information.
- **Required stories:** `Placeholder`, `Selected`, `Grouped`, `DisabledOption`, `Invalid`,
  `LongOptions`, and `KeyboardFlow`.
- **Evidence:** `select-states` and `select-keyboard`.
- **Used by:** [Task worklist](../../capabilities/tasks/spec.md#screen-contract-task-worklist).
- **Excludes:** Remote search, permission filtering, clinical ranking, and option validity.

## Surfaces and data display

### DS-DSP-002 Card

- **Need:** Group one coherent work surface or summary without making every region compete equally.
- **Owner:** `apps/web/src/components/ui/card.tsx`.
- **Semantics:** Neutral container with header, title, description, content, and footer slots. The
  caller chooses the correct heading level or region semantics.
- **Public contract:** One surface treatment; page-specific colour/elevation variants are not public
  API. Nested cards require a distinct hierarchy that spacing or a section cannot express.
- **States:** Interactive state belongs to the contained control, not the card, unless a future
  selectable-card contract is approved.
- **Keyboard and focus:** Static cards are not focusable.
- **Responsive/content:** Padding may adapt through a composition; headings, actions, and content
  wrap without clipping.
- **Required stories:** `Default`, `WithActions`, `DenseContent`, and `Narrow`.
- **Evidence:** `card-hierarchy`.
- **Used by:** [Operations dashboard](../../capabilities/reporting/spec.md#screen-contract-operations-and-safety-dashboard).
- **Excludes:** Metric meaning, navigation, selection, permission, and capability state.

### DS-DSP-003 Avatar

- **Need:** Provide a supplemental visual cue for a known person while retaining textual identity.
- **Owner:** `apps/web/src/components/ui/avatar.tsx`.
- **Semantics:** Image with meaningful alternative text when the image adds identity information,
  or decorative treatment when adjacent text already supplies it; deterministic fallback remains.
- **Public contract:** Image and fallback composition. Shape and size use the shared scale.
- **States:** Loading/broken images resolve to fallback without layout shift. A missing image does
  not imply missing or unverified identity.
- **Keyboard and focus:** Not focusable unless wrapped by a separately named interactive control.
- **Responsive/content:** Never replaces the person's full text name or required identifiers.
- **Required stories:** `Image`, `Fallback`, `BrokenImage`, and `WithLongName`.
- **Evidence:** `avatar-fallback`.
- **Used by:** [Practitioner profile](../../capabilities/practitioner-management/spec.md#screen-contract-practitioner-profile-and-offboarding).
- **Excludes:** Patient verification, practitioner credential state, upload/crop, and permission.

### DS-DSP-004 Table

- **Need:** Present data whose row and column relationships support comparison.
- **Owner:** `apps/web/src/components/ui/table.tsx`.
- **Semantics:** Native table, caption, header, body, row, and cell elements. Headers and scope are
  explicit; layout-only tables are prohibited.
- **Public contract:** Neutral responsive container, compact header/body/footer primitives,
  token-based row hover and selected hooks, and start/centre/end cell alignment. End-aligned cells
  use tabular figures. Sorting, pagination, selection, and responsive list alternatives belong to
  a molecule.
- **States:** Hover and selected state do not rely on colour. Empty, loading, partial, and failure
  presentation is composed outside the table body rather than represented as ordinary data.
- **Keyboard and focus:** Static cells are not tab stops. Interactive cell content follows logical
  row order and retains accessible row/header context.
- **Responsive/content:** Numeric columns use tabular figures/right alignment. Horizontal overflow
  is acceptable only when the screen contract preserves all actions and offers the required narrow
  strategy.
- **Required stories:** `Default`, `NumericComparison`, `SelectedRow`, `DenseContent`, and `Narrow`.
- **Evidence:** `storybook-table-comparison` and `storybook-table-narrow`.
- **Used by:** [Waiting room](../../capabilities/calendar/spec.md#screen-contract-waiting-room)
  and [patient account](../../capabilities/billing/spec.md#screen-contract-patient-account).
- **Excludes:** Data fetching, sorting state, virtualisation, domain selection, and bulk action.

### DS-DSP-005 Separator

- **Need:** Mark a boundary only when spacing or surface change is insufficient.
- **Owner:** `apps/web/src/components/ui/separator.tsx`.
- **Semantics:** Decorative by default; semantic separator role is used only when the boundary has
  meaning for assistive technology.
- **Public contract:** Horizontal and vertical orientations using the border token.
- **States:** No interactive state.
- **Keyboard and focus:** Never focusable.
- **Responsive/content:** Vertical separators are removed or reoriented when stacked content makes
  the relationship misleading.
- **Required stories:** `Horizontal`, `Vertical`, and `Semantic`.
- **Evidence:** `separator-orientation`.
- **Used by:** [Patient record workspace](../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Section labelling and page-specific decoration.

## Navigation and disclosure

### DS-NAV-001 Tabs

- **Need:** Switch between peer views within one task without implying a route or workflow completion.
- **Owner:** `apps/web/src/components/ui/tabs.tsx`.
- **Semantics:** Tab list, tabs, and associated tab panels. Use navigation links when changing route
  or location rather than local panel selection.
- **Public contract:** Controlled or uncontrolled value, disabled tabs, and active/focus states.
- **States:** Active and focused states are distinct and non-colour. Hidden panels are not exposed as
  active content.
- **Keyboard and focus:** Arrow/Home/End navigation and activation follow the established tab model;
  focus order proceeds into the active panel.
- **Responsive/content:** Labels remain readable; a narrow layout scrolls or uses an approved
  disclosure without clipping the active state.
- **Required stories:** `Default`, `Controlled`, `Disabled`, `LongLabels`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `tabs-states` and `tabs-keyboard`.
- **Used by:** [Recall worklist](../../capabilities/recalls-and-reminders/spec.md#screen-contract-recall-worklist).
- **Excludes:** Route access, permission gating, queue counts, and domain state.

## Overlays

### DS-OVR-001 Dialog

- **Need:** Focus attention on a bounded decision or supporting task without losing the invoking context.
- **Owner:** `apps/web/src/components/ui/dialog.tsx`.
- **Semantics:** Modal dialog with trigger, overlay, labelled title, description, content, close,
  header, and footer composition.
- **Public contract:** Open/closed control, focus containment, close affordance, and responsive width.
  A destructive confirmation's content remains a capability or molecule contract.
- **States:** Opening/closing motion honours reduced motion. Busy/failed submit keeps the dialog and
  recoverable input available. Closing MUST NOT imply confirmation.
- **Keyboard and focus:** Focus enters meaningfully, remains trapped while modal, Escape closes only
  when safe, and returns to the trigger on close.
- **Responsive/content:** Content reflows within the viewport and provides internal scrolling without
  hiding title, consequence, or final actions.
- **Required stories:** `Default`, `Open`, `LongContent`, `FailedSubmit`, `Narrow`, `ReducedMotion`,
  and `KeyboardFlow`.
- **Evidence:** `dialog-layout` and `dialog-keyboard`.
- **Used by:** [Consultation completion](../../capabilities/consultations/spec.md#dialog-contract-complete-consultation).
- **Excludes:** Consequence wording, validation, permission, mutation, and dirty-state policy.

### DS-OVR-002 Dropdown Menu

- **Need:** Present infrequent contextual actions without competing with the primary task.
- **Owner:** `apps/web/src/components/ui/dropdown-menu.tsx`.
- **Semantics:** Named menu trigger, menu, groups, labels, separators, and menu items. It is not a
  form select or a hiding place for the only frequent/safety-critical action.
- **Public contract:** Default and destructive item variants; disabled items; aligned/inset groups;
  open/closed positioning within the viewport.
- **States:** Focused, disabled, and destructive items are distinct beyond colour.
- **Keyboard and focus:** Established menu arrow/type-ahead/activation/Escape behaviour applies and
  focus returns to the trigger.
- **Responsive/content:** Long labels and shortcut/supporting text remain understandable; the menu
  stays within the viewport.
- **Required stories:** `Default`, `Grouped`, `DisabledItem`, `DestructiveItem`, `LongLabels`, and
  `KeyboardFlow`.
- **Evidence:** `menu-states` and `menu-keyboard`.
- **Used by:** [Appointment panel](../../capabilities/calendar/spec.md#screen-contract-appointment-panel).
- **Excludes:** Action availability, permission, transition validity, and confirmation.

### DS-OVR-003 Tooltip

- **Need:** Supply brief supplemental explanation for an already understandable trigger.
- **Owner:** `apps/web/src/components/ui/tooltip.tsx`.
- **Semantics:** Tooltip linked to a named trigger. Required instructions, errors, status, or safety
  meaning MUST remain visible outside the tooltip.
- **Public contract:** Open/closed state, preferred placement, bounded width, and trigger/content
  composition.
- **States:** Appears on keyboard focus and pointer hover; does not remain as the only route on touch.
- **Keyboard and focus:** Trigger retains focus; Escape dismisses; tooltip content is not an
  interactive container.
- **Responsive/content:** Text is brief and wraps. Long guidance moves to visible help or disclosure.
- **Required stories:** `Default`, `KeyboardFocus`, `LongTextBoundary`, and `ViewportEdge`.
- **Evidence:** `tooltip-keyboard`.
- **Used by:** May supplement help in accepted screen contracts but MUST NOT carry required capability
  behaviour on its own.
- **Excludes:** Interactive popovers, validation messages, required instructions, and protected content.
