# UX rules

These rules apply to every pattern in [patterns/](patterns/) and to any capability-owned screen.
A pattern page may add to them for its own problem; it may not contradict them. Where a rule and a
capability screen contract disagree, the authority order in [../../../SPEC.md](../../../SPEC.md)
governs and the conflict must be repaired before implementation.

## Compact Clinical direction

Version 1 uses one light appearance. Its product language is Compact Clinical: a calm,
information-dense workspace for Australian general-practice teams. It is professional, modern,
restrained, human, high-trust, space-efficient, and purpose-built for sustained clinical work. It
should feel closer to a mature desktop productivity application than a marketing-style SaaS
dashboard.

The governing principle is **high information density, low visual density**. A screen may expose a
large amount of useful information, but it MUST NOT make every fact or section compete as a card,
badge, icon, border, or decorative accent. Typography, alignment, whitespace, and subtle dividers
carry most of the hierarchy.

Visual character serves the task. Decoration MUST NOT compete with patient identity, safety state,
queue responsibility, financial consequence, or the next valid action. Do not use gradients,
glass effects, blurred blobs, decorative waves, floating abstract shapes, large rounded panels, or
generic healthcare illustration as product chrome.

## Hierarchy

Decision-relevant information leads. Supporting facts, identifiers, and provenance remain
available but visually quieter. Hierarchy SHOULD combine weight, contrast, size, and spacing rather
than making primary content oversized or secondary content illegibly small.

Most task regions have one primary action, a small number of secondary actions, and discoverable
tertiary actions. Destructive meaning and action priority are separate: a destructive action may be
visually subordinate before confirmation, but its consequence remains explicit and the final
confirmation action is unmistakable.

Semantic markup and visual hierarchy are independent decisions. Components MUST use the correct
element, role, heading level, accessible name, and table relationship even when the desired visual
weight is quiet.

## Colour

Brand colour and clinical meaning are separate:

- the chosen primary identifies the product and primary actions;
- brand accents support identity and orientation and MUST NOT imply operational status;
- success, information, warning, and destructive colours communicate state only; and
- every status also has text, structure, or a familiar icon, so colour is never the sole signal.

The interface MUST use semantic CSS tokens from `apps/web/src/index.css`. Components MUST NOT add
raw brand or status colour values. Version 1 provides one light appearance; components and review
tools MUST NOT expose a dark appearance until a separate theme contract and evidence are approved.

| Token | Value | Role and typical use |
|---|---:|---|
| `background` | `#f8f7f3` | warm off-white application canvas |
| `surface`, `card`, `popover` | `#ffffff` | contained work or transient surfaces |
| `foreground` | `#182523` | primary text and high-emphasis icons |
| `muted-foreground` | `#687370` | metadata and secondary text |
| `primary` | `#176b68` | primary action, link, selected state, restrained brand identity |
| `primary-hover` | `#125754` | hover and pressed emphasis for the primary role |
| `primary-foreground` | `#ffffff` | text and icon on primary |
| `border` | `#dde3df` | quiet section, table-row, and surface separation |
| `muted`, `secondary` | `#f0f2ef` | low-emphasis regions, skeletons, quiet grouping |
| `success` | `#2f7d4a` | labelled normal, completed, or successful state only |
| `warning` | `#b97818` | labelled recall, borderline, caution, or attention state only |
| `danger`, `destructive` | `#c94444` | allergy, dangerous clinical state, destructive action, or failure |
| `info` | `#3f6f9f` | labelled neutral clinical or operational information only |
| `input`, `ring` | derived structural values | perceivable control boundaries and focus indication |
| `sidebar-*` | derived navigation values | persistent application navigation and active context |
| `chart-1` to `chart-5` | derived categorical values | labelled series that do not imply semantic status |

Token values form a deliberate scale. Add a new role only when existing tokens cannot express a
stable meaning across components; do not create a near-duplicate shade for one screen.

Teal is deliberately sparse. Most pixels SHOULD remain `background`, `surface`, `foreground`,
`muted-foreground`, `border`, or `muted`. Semantic colour communicates clinical or operational
meaning and MUST NOT become decorative branding. A status does not receive a badge merely because
a badge variant exists.

## Typography and numbers

Use Inter, Geist, IBM Plex Sans, or an equivalent highly legible sans-serif UI stack. Type sizes and
weights MUST come from a constrained scale. Body copy is normally 12-14px, section headings
14-16px, and page titles 20-28px. Headings use medium or semibold weight; most content remains
regular. Headings are compact and confident rather than oversized, and normal interface text MUST
NOT use a weight so light that legibility is reduced.

Paragraphs SHOULD normally remain within 45-75 characters per line. Operational lists and tables
may be wider when columns carry decision-relevant data. Long explanatory copy is not a substitute
for a concise label, state, or action at the decision point.

Align mixed-size text deliberately; text sharing a line SHOULD normally align by baseline. Use
tabular figures for times, identifiers, counts, money, dosages, and aligned measurements. Numeric
table values intended for comparison SHOULD be right-aligned while labels and prose remain
left-aligned.

## Spacing and layout

Spacing follows a constrained scale built on a four-pixel base rhythm. The scale MAY grow by larger
steps at larger sizes; a four-pixel base does not permit arbitrary multiples when an established
token exists.

Related elements normally use 8-12px vertical separation; major regions normally use 16-24px.
Controls are normally 28-36px high, with any larger target treatment supplied without making the
visible control oversized. These are density defaults, not permission to weaken pointer-target,
focus, label, error, or zoom/reflow requirements.

There MUST be more separation around a semantic group than within it. A label must read as belonging
to its control, a warning to its affected action, and metadata to its record. Equal gaps that create
ambiguous grouping are not acceptable.

Give content the width required by its task. Forms and prose SHOULD use a readable maximum width;
dense calendars, worklists, and comparisons MAY use available width where their data requires it.
Do not stretch a component merely to satisfy a page grid, and do not shrink it before the viewport
requires a responsive change.

## Shape, borders, and elevation

Corners are softly rounded and consistent. Default containers use a 6-8px radius and compact
controls MAY use a smaller radius. Pill shapes are reserved for controls or labels whose semantics
benefit from that form; they are not the default visual motif.

Use spacing or a subtle surface change for grouping before adding a border. Use borders when a
boundary, input affordance, table relationship, or selected region must remain explicit. Avoid
nested cards and repeated outlines that make every region compete equally.

Shadows communicate elevation, not decoration, and SHOULD be rare and subtle. Inline surfaces
remain at canvas level; menus, popovers, and dialogs may use progressively stronger elevation
because they sit above and interrupt the current task. The elevation scale MUST be small,
consistent, and paired with correct focus and modal behaviour.

## Motion

Motion is brief and functional. It may clarify opening, closing, reordering, progress, or state
change but MUST NOT carry information that disappears when motion is disabled. Reduced-motion users
receive the same state and hierarchy. Loading motion SHOULD not cause avoidable layout shift.

## Icons and imagery

Icons support concise labels and familiar state; they do not replace unfamiliar actions, status
text, or accessible names. Use monochrome Lucide icons with a constrained size and stroke
treatment. An icon's visual weight SHOULD be balanced with adjacent text without reducing contrast
below the required level. Do not place an icon beside every heading or colour navigation icons for
decoration.

Avatars and decorative imagery are supplemental. Patient or practitioner identity MUST remain
available as text. User-supplied clinical images, result content, correspondence, and source
documents MUST preserve evidentiary content and MUST NOT be cropped, colourised, or decorated merely
to fit a layout.

## Informative design reference

The user-supplied *Refactoring UI* v1.0.2 informs the feature-first process, constrained scales,
visual hierarchy, grouping, readable text, purposeful elevation, and first-class empty states. Its
generic recommendations do not override semantic HTML, WCAG 2.2 AA, clinical/financial consequence,
visible form labels, or the repository's perceptual semantic-token model.

## State model

Every interactive foundation MUST define the relevant states below. Components expose mechanics;
capabilities supply domain meaning and decide which state applies.

| State | Meaning | Required presentation |
|---|---|---|
| normal | available without current interaction | ordinary hierarchy and complete accessible name |
| hover | pointer is over an available target | supplemental affordance only; no hidden required action or meaning |
| focus | keyboard/programmatic focus is on the target | visible, unobscured focus without implying selection |
| active | pointer/keyboard activation is in progress | momentary feedback without implying committed success |
| disabled | the control cannot currently be operated | unavailable semantics plus a nearby reason when the cause matters |
| selected | the item is deliberately chosen | semantic selected state plus a non-colour visual cue |
| invalid | supplied input needs correction | identified field, associated message, preserved value, and no save implication |
| loading | requested content is not yet known | labelled/busy state; dependent actions unavailable; stable geometry where useful |
| empty | the request succeeded and the current scope contains no records | scope-specific message and valid next action, if one exists |
| unavailable | required information could not be established | unknown information named; affected actions disabled |
| offline | current connectivity is unavailable | cached freshness labelled; unsafe writes stopped; recoverable drafts remain uncommitted |
| restricted | the user is known not to have permission or context | no protected-content leak; escalation/request path only when configured |
| partial | one region/source failed while verified content remains usable | failed region and freshness named; only dependent actions disabled |
| stale | shown data is older than the authoritative state | as-of/freshness visible; unsafe mutation requires refresh or revalidation |
| failure | an attempted operation or load failed | no success implication; recoverable work preserved; safe retry/escalation offered |
| conflict | another version or rule now prevents the proposed change | latest state and reason shown; local work available for compare/reapply |

These states MUST NOT share copy or styling that makes them sound equivalent. In particular:

- failure MUST NOT render as empty;
- unavailable or restricted MUST NOT render as none-known, zero, or absent;
- focus MUST NOT render as selection;
- a dismissed notification MUST NOT render as completed work; and
- local, pending, queued, or recovered work MUST NOT render as durably saved or externally delivered.

## Save and recovery

A save state is capability-supplied but uses consistent presentation:

| Save state | User contract |
|---|---|
| unchanged | no uncommitted edits exist |
| dirty | local edits differ from the last durable version |
| saving | an attempt is active; success is not yet claimed |
| saved | durable commit and required audit succeeded |
| failed | the committed record is unchanged; local input remains recoverable |
| conflict | a newer authoritative version exists; neither version is silently discarded |
| recovered | a local draft is available with patient/context, author, and timestamp before restore |

Dynamic save and validation messages MUST be programmatically announced without stealing focus.
Leaving a dirty or failed consequential editor follows its capability's recovery contract. A shared
component MUST NOT decide whether discard, autosave, or navigation is safe.

## Keyboard and focus

- Keyboard order follows visible task order.
- Focus is visible, unobscured, and restored to the invoking control when a transient surface closes.
- Native or established Radix interaction models govern composite widgets.
- Arrow keys MAY move focus within a composite widget; only explicit activation selects or mutates.
- Escape closes a transient surface when doing so does not discard or complete work. When Escape
  would lose work, the capability's dirty-state decision is invoked.
- Drag, hover, fine pointer movement, truncation, and icon recognition MUST have an equivalent path.
- Opening, focusing, scrolling, or acknowledging content MUST NOT imply clinical review, selection,
  save, or completion.
- Focus changes caused by validation or conflict move to a useful summary/explanation, not an
  obscured background control.
- Keyboard shortcuts MAY accelerate frequent clinical workflows, but they MUST be discoverable,
  must not conflict with platform or assistive-technology shortcuts, and MUST NOT be the only path.

Pointer targets, accessible names, descriptions, headings, error associations, and focus behaviour
MUST meet the cross-cutting accessibility requirements. Comfortable and compact presentation MUST
not shrink targets below that requirement.

## Actions and consequences

Most regions expose one primary action. Secondary and tertiary actions remain discoverable without
competing equally. A hidden overflow action MUST NOT be the only route to a frequent or safety-
critical task.

Progressive disclosure is preferred for infrequent secondary actions through an overflow menu,
dialog, sheet, command surface, or contextual menu. Several actions on one screen MUST NOT all use
the filled primary treatment.

Destructive and corrective actions name the target and consequence. Before final confirmation the
interface shows relevant context, retained history, downstream effects, and safer alternative as
required by the cross-cutting destructive-action contract. The final consequential action remains
visually distinct from ordinary primary actions.

Disabled actions SHOULD explain the failed precondition at the point of need when the user could
reasonably act to resolve it. Invalid or unavailable transitions are omitted only when their absence
cannot make the current state or required next step ambiguous.

## Feedback and announcements

- Validation feedback is associated with the affected field and summarised when multiple fields or
  regions need correction.
- Success feedback names the completed object/action only after durable success.
- Failure feedback states what failed, what remains unchanged, and the safe recovery action.
- Partial results name failed scope and do not imply complete success.
- Long-running progress has an accessible name and textual state; animation is supplemental.
- Routine status updates use polite announcements. Urgent destructive or failed-operation feedback
  uses assertive announcement only when interruption is warranted.
- Repeated background refreshes MUST NOT repeatedly announce unchanged content or move focus.

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

### Shared display formatters

`apps/web/src/lib/formatters.ts` is the canonical web display-formatting boundary. Components and
capability screens MUST use it instead of creating local `Intl` instances or manual spacing for the
same value type.

- Currency accepts integer minor units and displays Australian dollars with two decimal places.
- Calendar dates use `DD/MM/YYYY` by default and may use an unambiguous written Australian
  day-month-year form where the task warrants it. A date-only value is formatted without converting
  it through a timezone that could change the calendar day. Taking the calendar date of an instant
  requires the caller to name the timezone, because an instant is a different day in different
  places.
- Instants and times require the caller to supply the relevant IANA timezone, support the
  practice-configured 12/24-hour cycle, and may include the short timezone label when location
  context is not otherwise clear.
- Australian mobile, geographic, `13`, `1300`, and `1800` numbers use consistent readable grouping.
  An unrecognised number is preserved rather than rewritten into a plausible different number.
- Comparable numbers use Australian grouping and tabular figures in the consuming layout.
- A missing-value fallback is presentational only. The capability still distinguishes missing,
  unknown, unavailable, withheld, and restricted meanings in accompanying content.

These functions format already accepted values for display. They MUST NOT parse user input,
validate identity/contact details, calculate money, infer a timezone, choose identifier masking, or
change the stored value.

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
