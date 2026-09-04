# Responsive behaviour and content

## Responsive contract

Foundations are mobile-capable even when the dominant workflow is desktop. Responsive decisions
follow content and task constraints rather than device labels or a universal grid.

At narrow widths:

- required identity, status, responsibility, freshness, and safety context remain available;
- primary actions stay visible and supporting actions wrap or move to an accessible disclosure;
- labelled facts become a deliberate single-column or compact stacked presentation;
- list/detail layouts provide a clear route back to the query or worklist;
- dense tables expose the equivalent list, grouped-row, or horizontal strategy required by the
  capability screen contract; and
- no required action or explanation becomes hover-only, clipped, or dependent on fine pointer use.

A component uses only the width it needs until the viewport requires adaptation. Large text,
containers, spacing, and controls MAY change at different rates; preserving a desktop proportion is
not a responsive requirement. Reflow at 200% zoom MUST preserve meaning, order, and operation.

## Density

Compact density is the default for desktop clinical and operational work. It reduces visual bulk,
not useful information or interaction safety. Comfortable presentation MAY be used where a task or
viewport genuinely benefits from it. Compact density MUST NOT:

- remove decision-relevant information;
- reduce target sizes, text, focus indicators, or error visibility below accessibility requirements;
- collapse patient, practitioner, location, date, status, or responsibility context;
- use unexplained abbreviations; or
- make adjacent rows or groups ambiguous.

Density is a stable component or screen contract, not a page-specific collection of spacing
overrides. When a user-selectable density is supported, it changes presentation rather than
permissions, ordering, or available information. Compact must not mean cramped: related items
remain visibly grouped and major task regions remain distinct.

## Content stress

Long names, compound names, previous names, identifiers, dates, times, money, units, missing optional
values, multiline errors, and dense record history are normal fixture cases. Every relevant
foundation MUST demonstrate them before adoption.

Text wraps deliberately. Truncation is allowed only when the full value is available through an
accessible, non-hover-only path and losing the hidden text cannot cause a wrong-patient,
wrong-context, clinical, financial, or workflow decision. Identifiers and numeric values SHOULD
avoid ambiguous mid-value truncation.

Missing, unknown, not asked, not applicable, declined, none-known, zero, and empty collection are
distinct. Components render the capability-supplied value without inventing a fallback that changes
meaning.

## Labels and product copy

Visible labels are the default for form controls. Placeholder text is an example or transient hint,
not a label. A label may be visually hidden in a compact search/filter composition only when the
control remains unambiguous in context and has a complete accessible name.

Read-only facts may combine label and value or visually quiet a label when meaning remains clear to
every intended actor. In information-dense clinical, identity, billing, or audit regions, retain
explicit labels when users scan by field name or similar values could be confused.

Copy is brief, task-specific, and placed at the decision point. It MUST NOT:

- explain ordinary mechanics that the control already communicates;
- repeat headings;
- use success language before durable commit;
- use “none”, “clear”, or “complete” when the actual state is unknown, failed, or partial;
- imply an external service received, accepted, delivered, or paid a Version 1 manual record; or
- expose protected content in an error, empty, restricted, or routing-only state.

Destructive, clinical, and financial confirmation names the object and consequence. Recovery copy
states what was preserved and what the user can safely do next.

## Dates, times, identifiers, and numbers

- Display dates in Australian order and use an unambiguous written date when safety warrants.
- Show timezone when work crosses locations or the time's context is otherwise ambiguous.
- Preserve partial/estimated date precision; never manufacture missing day or month values.
- Use tabular figures for times, identifiers, counts, money, dosages, and measurements.
- Right-align comparable numeric table values and keep units visible.
- Do not use an identifier as a security credential or imply identity verification from a search
  match.
- Mask protected identifiers according to the owning capability; a shared component does not decide
  the masking rule.

## Tables, charts, and visual data

Use a semantic table when row/column relationships are meaningful. Headers, captions, selection,
sort state, and row actions remain programmatically available. Related values MAY share a cell to
improve hierarchy only when sortable meaning, comparison, and accessible labelling remain intact.

Clinical information normally uses compact tables or structured lists before individual result
cards. Rows use clear alignment and subtle separators. Hover may use a very light neutral or teal
tint, but it is supplemental and MUST NOT imply selection or hide required actions.

Charts provide exact textual values or an equivalent data table, with units and dates. Colour,
shape, line style, label, and contrast work together so a trend or category is not colour-only.
Warnings do not flash.

## Images and documents

Decorative images use appropriate alternative-text behaviour and MUST NOT interfere with task
contrast. Avatars are supplemental to textual identity. Images at a different aspect ratio use a
stable container only when cropping cannot remove material meaning.

Clinical images, uploaded documents, results, correspondence, and issued artefacts are evidence,
not decoration. Their viewer may scale or pan without altering source content, and any unavailable,
quarantined, partial, or rendering-failure state remains explicit.
