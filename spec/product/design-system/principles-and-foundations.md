# Principles and visual foundations

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
