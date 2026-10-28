# Organising a form

## The problem

A long form is a navigation problem before it is an input problem. Someone completing a patient
registration or a practice setup needs to know where they are, what is left, and — when they
submit and it fails — every field that needs correcting, not the first one.

This page covers grouping fields, disclosing sections, and gathering errors. Entering a single
value is [another pattern](entering-values.md); the save itself is
[a third](saving-work.md).

## Rules

- Make each region of a long form a labelled, navigable group. Grouping by whitespace alone is not
  a group.
- There MUST be more separation around a group than within it.
- Gather every field needing correction into one list the person can act from, and move focus to
  that summary rather than to an obscured control.
- A summary entry names its field and moves focus to it.
- Collapsing a section MUST NOT hide a safety indicator or an unresolved error inside it.
- A disclosure starts open when it contains an error, a warning, or work in progress.

## First reference

None on real data for section navigation or the error summary. The onboarding steps group fields
but predate these contracts. The first long form to adopt them becomes the first reference.

## Settled by

Form section by DS-022, collapsible section by DS-023, form error summary by DS-021. The
"close a dense summary without closing away its safety indicators" rule is DS-023's title.

## Contracts

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
- **Used by:** [Patient registration](../../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
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
- **Used by:** [Consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace)
  and [patient record workspace](../../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Deciding which facts are safety indicators, allergy and warning meaning, what the
  summary counts, remembering the open state across visits, and permission.

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
- **Used by:** [Patient registration](../../../capabilities/patient-registration/spec.md#screen-contract-patient-registration)
  and [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Validation rules and authority, message wording, deciding when a form may be
  submitted, clearing or preserving other sections, and permission.

