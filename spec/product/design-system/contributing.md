# Contributing to the design system

## Need before component

Start from an accepted staff task, safety need, or repeated cross-cutting requirement. Do not begin
with a preferred component shape or an attempt to design the entire application shell.

Before proposing a foundation:

1. read the originating capability screen contract and review manifest;
2. inspect existing tokens, atoms, molecules, examples, and consumers;
3. show why native markup or an existing foundation cannot express the need;
4. choose the lowest owning layer; and
5. state what remains capability-owned.

Work in short design/implementation cycles. The catalogue should grow from real Version 1 screen
needs rather than speculative completeness.

## Contract proposal

Every public atom or molecule receives a stable ID. IDs use `DS-ACT` for actions, `DS-FRM` for
forms, `DS-DSP` for display, `DS-FBK` for feedback/state, `DS-NAV` for navigation/disclosure,
`DS-OVR` for overlays, and `DS-PAT` for composed patterns. An ID is never reused after removal.

Each catalogue entry states:

- **Need:** staff task or safety need;
- **Owner:** source path and atomic layer;
- **Semantics:** element/role and meaning;
- **Public contract:** controlled props, slots, callbacks, and meaningful variants;
- **States:** relevant interaction, async, save, error, and selection states;
- **Keyboard and focus:** order, movement, activation, dismissal, recovery, and announcements;
- **Responsive/content:** narrow, zoom/reflow, density, long/missing content, and truncation rules;
- **Required stories:** stable isolated proofs;
- **Evidence:** stable screenshot and interaction identifiers;
- **Used by:** originating screen contracts; and
- **Excludes:** behaviour retained by capabilities or higher authority.

The owner accepts the contract and owning layer before a capability makes the component a de facto
standard. A small implementation spike may accompany the proposal when feasibility is unclear, but
the spike is not accepted behaviour until its contract and evidence pass review.

Before approval, review the rendered result against the Compact Clinical test:

1. Can anything be removed without reducing usefulness?
2. Is every border necessary?
3. Is every card necessary?
4. Is colour communicating meaning?
5. Can the clinician scan the important information in under two seconds?
6. Does the layout remain understandable in greyscale?
7. Does it look like a mature clinical tool rather than a generic SaaS template?
8. Is it compact without feeling cramped?

## Implementation

- Reuse semantic tokens and accessible native or established Radix mechanics.
- Keep the public API minimal and controlled.
- Do not add page-specific variants, raw colour/spacing props, SDK imports, permission logic, or
  domain state to an atom or molecule.
- Add focused component tests, deterministic fixtures, gallery stories, and applicable interaction
  tests together.
- Demonstrate the component before a capability adopts it.
- Generate evidence from the reviewed commit; never edit evidence to hide a defect.

During the gallery transition, new work follows the current executable mechanism named in
[Storybook and evidence](storybook-and-evidence.md). Do not maintain duplicate `/foundations` and
Storybook examples after parity is reached.

## Approval and adoption

A foundation change is complete only when it has:

1. one accepted staff task or safety need and a named owning layer;
2. a catalogue contract with explicit exclusions and originating screen links;
3. a minimal public API and every meaningful state;
4. focused tests for semantics and controlled behaviour;
5. a deterministic synthetic fixture;
6. gallery examples linked to the stable contract ID;
7. desktop, narrow, content-stress, and primary keyboard evidence where applicable;
8. current repository validation; and
9. owner approval through the GitHub pull request.

An isolated foundation proves reuse mechanics only. Capability adoption still proves permission,
tenant, API, clinical-safety, domain, and end-to-end outcomes.

## Change and deprecation

For a breaking change:

- identify every consumer and affected screen contract;
- explain the user or safety problem rather than styling preference;
- update the catalogue, source, stories, tests, and evidence atomically;
- provide consumer migration and preserve stack order when changes span delivery slices;
- deprecate before removal when consumers need time to move; and
- never silently weaken keyboard, error, recovery, permission, or safety behaviour.

Removal retires but never reuses the stable contract ID. A compatibility component may contain only
the minimum migration path and is removed after all consumers move. Delivery status and activity
logs remain in delivery manifests and pull requests, not in the normative catalogue.

## Version 1 coverage strategy

The maintained catalogues contain only approved public foundations. The following list is an
informative delivery order, not approval for an API or atomic layer.

### Wave 1: Storybook and baseline parity

- Storybook harness, deterministic fixture decorators, typed contract metadata, and traceability lint.
- Stories and evidence for every maintained atom and molecule.
- Foundation stories for tokens, type, spacing, icon, focus, theme, and density.
- Removal of `/foundations` only after complete evidence parity.

### Wave 2: forms, actions, and save safety

Candidate needs include combobox/autocomplete, search input, Australian date/time input, date range,
numeric/currency input, file input, Form Section, Form Error Summary, Save State, Action Bar,
Confirmation, unsaved/recovery presentation, Popover, Sheet/Drawer, Collapsible/Accordion,
Toast/Live Announcement, and Pagination. Add only the subset proven by the first accepted screen.

### Wave 3: dense search, lists, and queues

Candidate needs include Active Filters, Result Count, sortable/paginated Data Table, responsive list
alternative, controlled bulk selection/action, List/Detail Workspace, queue scope/freshness header,
stable refresh behaviour, Timeline/History, source metadata, and before/after comparison.

Patterns own density, hierarchy, keyboard coordination, and responsive layout. Capabilities supply
protected content, permission, priority, state transitions, and mutations.

### Wave 4: record and workflow composition

Candidate needs include Page Header, persistent context/action region, Section Navigation,
Summary/Metadata groups, Side-by-side Comparison, version/amendment chain, linked-action status,
preview/review shell, bounded Step/Progress navigation, Recoverable Editor shell, and
document/attachment presentation.

Patient identity, allergy meaning, clinical warnings, billing totals, and record lifecycle remain
capability-owned even when rendered through shared patterns.

### Wave 5: capability-led specialist mechanics

Candidate needs include accessible time-grid mechanics with a chronological alternative, chart
frames with exact tables, document-viewer mechanics, recurrence/schedule controls, drag-equivalent
interaction, and rich narrative editing/conflict comparison.

These normally begin as capability-owned organisms. Extract only stable domain-neutral mechanics
after implementation proves reuse.

## Delivery slices

Keep each design-system change to one owner-visible outcome and normally one to three acceptance
examples. The expected sequence is:

| Slice | Outcome | Exclusion |
|---|---|---|
| `DS-001` | this directory becomes the authoritative linked design-system contract | application and Storybook changes |
| `DS-002` | the owner can open Storybook showing foundations and one traced existing component | whole-gallery migration |
| `DS-003` | every existing atom has traceability, stories, tests, and baseline evidence | new atoms |
| `DS-004` | every existing molecule has traceability, stories, tests, and baseline evidence | capability organisms |
| `DS-005` | each design-system pull request provides a reviewable candidate Storybook build | external visual service unless chosen separately |
| `DS-006+` | one coherent screen-driven foundation family per slice | speculative expansion |

## Completion checks

The shared Version 1 foundation library is ready for systematic screen construction when:

- every accepted atom and molecule maps to source, stories, tests, evidence, and an originating need;
- every Version 1 screen contract has a coverage review separating shared foundations from
  capability-owned composition;
- capability code does not introduce raw brand/status colours, hidden permission logic, or a
  page-specific variant in place of a shared contract;
- required empty, loading, unavailable, offline, restricted, partial, stale, failure, conflict,
  dirty, and saved states are consistently distinguishable where applicable;
- keyboard, screen-reader, narrow viewport, 200% zoom/reflow, content-stress, and deterministic
  screenshot evidence are current;
- the gallery builds and tests in the repository gate; and
- the approved gallery on `main` is built from the evidence commit.

The library remains evolvable. A later accepted screen may introduce a new reusable need through
this same process.
