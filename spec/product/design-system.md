# Product design system

## Outcome

The interface helps Australian general-practice staff move quickly without losing patient,
practitioner, location, record, or save context. It should feel calm and assured under pressure:
professional enough for clinical work, warm enough for a community practice, and distinctive
without becoming decorative.

This document is the single normative visual and component contract. `/foundations` is its
executable gallery. Component source documents implementation details only when the public API
cannot make them obvious.

## Character: Eucalyptus and Wattle

The primary colour is **eucalyptus**, a deep blue-green associated with Australian landscape and
calm clinical care. **Wattle** is a restrained warm accent used for selected navigation, emphasis,
and moments of orientation. Warm paper backgrounds prevent the product from feeling like a generic
blue hospital portal; dark mineral text preserves the gravity and legibility of a clinical record.

Brand colour and clinical meaning are separate:

- eucalyptus identifies the product and primary actions;
- wattle supports orientation and emphasis, but MUST NOT mean warning;
- semantic success, information, warning, and destructive colours communicate state only;
- every status also has text, structure, or an icon, so colour never carries meaning alone.

The interface MUST use the semantic CSS tokens in `apps/web/src/index.css`. Components MUST NOT add
raw brand or status colour values. Dark mode may map the same tokens differently, but a component's
meaning and hierarchy MUST remain unchanged.

## Visual foundations

### Colour roles

| Token | Role | Use |
|---|---|---|
| `background` | warm paper | application canvas |
| `foreground` | mineral ink | primary text and high-emphasis icons |
| `card` | clear paper | contained work surfaces |
| `primary` | eucalyptus | primary actions, product mark, active emphasis |
| `secondary` | eucalyptus mist | lower-emphasis actions and grouped context |
| `accent` | wattle wash | navigation selection and orientation |
| `muted` | sage-grey wash | low-emphasis regions, skeletons, quiet grouping |
| `destructive` | red earth | destructive actions and failures |
| `success`, `warning`, `info` | semantic state | labelled status and feedback only |

Text uses the platform sans-serif stack for predictable rendering and high legibility. Headings are
compact and confident rather than oversized. Tabular figures MUST be used for times, identifiers,
counts, money, and aligned measurements. Body copy should normally fit within 70 characters per
line; operational lists may be wider when their columns carry decision-relevant data.

Spacing follows a four-pixel base rhythm. Related controls use tighter space than separate tasks.
Corners are softly rounded, not pill-shaped by default. Borders establish most grouping; shadows
are reserved for raised or transient surfaces. Motion is brief, functional, and removable without
losing information.

## Atomic model and code ownership

Atomic design is a composition vocabulary, not a second folder hierarchy.

| Atomic level | Repository owner | Contract |
|---|---|---|
| Atom | `apps/web/src/components/ui` | One accessible semantic or interaction primitive with token-based variants |
| Molecule | `apps/web/src/components/patterns` | A pure composition driven entirely by props, slots, and callbacks |
| Organism | `apps/web/src/features/<capability>/components` | Capability-aware composition that maps permissions, API state, and domain rules into patterns |
| Template | capability route/layout | Responsive placement of organisms and persistent task context |
| Page | capability route plus data | A real actor, permission set, state, and user outcome |

Atoms and molecules MUST remain independent of generated SDK types, authenticated context,
permissions, route state, and domain mutations. Organisms MUST use atoms and molecules rather than
forking their mechanics or appearance. A repeated fragment becomes a foundation only when it owns
a stable semantic, interaction, density, responsive, or state-display contract.

## Foundation inventory

The maintained atoms are buttons, badges, alerts, cards, avatar, text inputs, text areas, labels,
checkboxes, radio groups, switches, selects, tabs, tables, dialogs, dropdown menus, progress,
separators, skeletons, and tooltips. Their public variants represent distinct meaning or interaction,
not one-page styling preferences.

The maintained molecules are:

- **Field** — binds a visible label, hint, required state, validation error, and control;
- **Filter bar** — keeps the primary query, secondary filters, active scope, and live result count in
  one compact, named search region;
- **List view** — presents dense selectable rows with a leading task object, distinguishing facts,
  secondary references, explicit selection, and focus movement that does not select;
- **Context banner** — keeps the active record or workflow identity and key metadata visible;
- **State panel** — distinguishes empty, loading, unavailable, offline, restricted, and failure
  outcomes, with an optional recovery action;
- **Summary list** — presents compact labelled facts with deliberate wrapping and tabular values
  where needed.

The inventory is intentionally short. Add an item only when its contract is implemented, tested,
shown in `/foundations`, and useful beyond a single screen.

## State and interaction contract

Every interactive foundation MUST define its relevant normal, hover, focus, active, disabled,
loading, invalid, and selected states. Data-bearing patterns MUST additionally distinguish:

- **loading:** content is not yet known and actions that depend on it are unavailable;
- **empty:** the request succeeded and no records match the current scope;
- **unavailable:** required information could not be established;
- **offline:** cached information may be shown, labelled with freshness, while unsafe writes stop;
- **restricted:** the user is known not to have permission; and
- **failure:** an attempted operation failed and recoverable work remains present.

These states MUST NOT share copy that makes them sound equivalent. Pending work MUST NOT look saved.
Focus movement MUST NOT imply selection. Destructive actions name their consequence and remain
visually distinct from ordinary primary actions.

Search and list patterns MUST follow the user's decision order. The name or task object leads each
row, distinguishing facts follow, and internal or external references remain secondary. Normal rows
fit within two lines; an additional footnote is reserved for relevant match or safety context.
Keyboard focus may move with Tab or list-navigation keys, but only explicit activation selects.
Selection has a non-colour cue and the primary query remains easy to reach and revise.

Keyboard order follows visual task order. Focus is visible and unobscured. A composite widget uses
the native or Radix interaction model expected for its role. Dynamic save and validation messages
are announced without stealing focus. Pointer target size, accessible names, descriptions, and
error associations MUST meet the cross-cutting accessibility requirements.

## Responsive and density contract

Foundations are mobile-capable even when the dominant workflow is desktop. At narrow widths,
actions wrap beneath their context, labelled facts become a single column, and dense tables expose
an equivalent list or horizontal strategy defined by their screen contract. Required actions,
identity, status, and safety context MUST never be clipped or hover-only.

Comfortable and compact density may alter space and row height, not hide information or shrink
targets below the accessibility requirement. Long names, missing optional values, identifiers,
dates, and error messages are fixture cases, not edge cases deferred to capability work.

## Contribution and evidence

A foundation change is complete only when it has:

1. one staff task or safety need and a named owning layer;
2. a minimal controlled API and the meaningful states above;
3. focused component tests for semantics and controlled behaviour;
4. a deterministic synthetic fixture with no real patient, staff, practice, or credential data;
5. a `/foundations` example with a stable `data-evidence` target;
6. browser evidence at desktop and narrow widths, plus the primary keyboard path; and
7. the component inventory in this document updated when a public foundation is added or removed.

The gallery demonstrates reusable contracts, not finished capability behaviour. API, permission,
tenancy, clinical-safety, and end-to-end outcomes remain the responsibility of the later
capability slice.
