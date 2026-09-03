# Design-system evolution plan

**Status:** proposal for owner review; non-normative until accepted and folded into the
authoritative design-system contract.

## Outcome

Create a specification-led atomic design system that lets the owner review reusable UI contracts
in Storybook before capability screens depend on them. The finished system should make common
interaction, accessibility, state, responsive, and visual behaviour predictable while leaving
permissions, clinical rules, API state, and domain mutations with their capability owners.

The design system will be complete for Version 1 when every reusable need in the current screen
contracts is either:

1. covered by an approved atom or molecule; or
2. explicitly retained as a capability-owned organism, template, or page because it needs domain,
   permission, route, or query knowledge.

"Complete" does not mean designing every conceivable component in advance. New screen contracts
may introduce new needs later, through the same contribution and approval flow.

## Decisions

### One normative source, three forms of evidence

- Markdown under `spec/product/design-system/` will define intent and reusable public contracts.
- Component source will implement those contracts.
- Storybook will demonstrate the implementation and its meaningful states in isolation.
- Tests and captured browser evidence will verify behaviour.
- A GitHub pull-request approval and merge will be the approval record. A story on a branch is a
  candidate; the corresponding story on `main` is approved.

Storybook MUST NOT become a second source of product rules. Story descriptions may show an exact
contract excerpt or link to it, but must not contain independently maintained normative prose.
Markdown MUST NOT be treated as a prompt from which production components are generated without
human review.

### Atomic design describes composition, not folders

| Atomic level | Repository owner | Storybook namespace | Specification owner |
|---|---|---|---|
| Foundation | design tokens and global styles | `Foundations/*` | design-system foundation files |
| Atom | `apps/web/src/components/ui` | `Atoms/<category>/*` | `atoms.md` |
| Molecule | `apps/web/src/components/patterns` | `Molecules/<category>/*` | `molecules.md` |
| Organism | `apps/web/src/features/<capability>/components` | `Capabilities/<capability>/*` | capability screen contract |
| Template | capability route/layout | `Capabilities/<capability>/Templates/*` when useful | capability screen contract |
| Page | route plus actor, permissions, and data | end-to-end evidence; a story only when isolation adds value | capability acceptance and screen contracts |

Do not add `atoms/`, `molecules/`, or `organisms/` source directories. The existing ownership layers
remain the code architecture.

## Proposed Markdown structure

Replace the current single `spec/product/design-system.md` file in one atomic specification change
with the following compact tree. `README.md` becomes the one entry point and links to every
normative part.

```text
spec/product/design-system/
├── README.md
├── principles-and-foundations.md
├── composition-and-ownership.md
├── states-and-interaction.md
├── responsive-and-content.md
├── atoms.md
├── molecules.md
├── storybook-and-evidence.md
└── contributing.md
```

| File | Owns | Must not duplicate |
|---|---|---|
| `README.md` | outcome, authority, scope, navigation, glossary | detailed component contracts |
| `principles-and-foundations.md` | Eucalyptus and Wattle character; semantic colour; type; spacing; shape; elevation; motion; icon rules | component APIs |
| `composition-and-ownership.md` | atomic mapping, layer boundaries, promotion/reuse rules | capability domain rules |
| `states-and-interaction.md` | common async/save states, selection, focus, keyboard, announcements, destructive actions | component-specific details already in a catalogue entry |
| `responsive-and-content.md` | density, breakpoints as behavioural constraints, zoom/reflow, long/missing content, dates/numbers/identifiers, concise copy | pixel layouts for screens |
| `atoms.md` | grouped atom catalogue and public contracts | source-level implementation details |
| `molecules.md` | grouped molecule catalogue and public contracts | organisms or capability policy |
| `storybook-and-evidence.md` | story metadata, required scenarios, automated/manual evidence, QA checklist | normative component behaviour |
| `contributing.md` | proposal, approval, change, deprecation, and removal workflow | delivery status or activity logs |

Avoid one Markdown file per component. A component gets its own document only when a genuinely
complex public contract cannot remain readable in the grouped catalogue and component API.
Implementation status belongs in delivery manifests and pull requests, not in the normative spec.

### Catalogue entry shape

Every public atom or molecule receives a stable contract ID and the same compact fields:

```markdown
### DS-ACT-001 Button

- **Need:** The staff task or safety need this foundation serves.
- **Owner:** `apps/web/src/components/ui/button.tsx`
- **Semantics:** Required element/role and what the component means.
- **Public contract:** Controlled props, slots, callbacks, and meaningful variants.
- **States:** Relevant normal, hover, focus, active, disabled, loading, invalid, and selected states.
- **Keyboard and focus:** Order, activation, focus movement, Escape/recovery, and announcements.
- **Responsive/content:** Narrow-width, zoom, long-label, missing-value, and density behaviour.
- **Required stories:** Stable story names that prove the contract.
- **Evidence:** Stable screenshot and keyboard-flow identifiers.
- **Used by:** Links to the screen contracts that establish the reusable need.
- **Excludes:** Behaviour that remains capability-owned.
```

Prefixes should identify catalogue groups without coupling IDs to filenames: `DS-ACT` actions,
`DS-FRM` forms, `DS-DSP` data display, `DS-FBK` feedback/state, `DS-NAV` navigation/disclosure,
`DS-OVR` overlays, and `DS-PAT` composed patterns. IDs are never reused after removal.

## Markdown-to-Storybook bridge

Each co-located Component Story Format file will declare typed design-system metadata:

```ts
const meta = defineFoundation({
  title: 'Atoms/Actions/Button',
  component: Button,
  contractId: 'DS-ACT-001',
  specRef: 'spec/product/design-system/atoms.md#ds-act-001-button',
  evidence: ['button-states', 'button-keyboard'],
  tags: ['autodocs', 'atom'],
});
```

The bridge should be deliberately small:

1. A repository script parses catalogue headings and required fields into a generated in-memory
   manifest during lint/build; generated output is not hand-edited.
2. A typed `defineFoundation` helper puts the contract ID, source link, evidence IDs, ownership,
   and maturity tags into Storybook metadata.
3. Storybook Autodocs derives the implementation API from TypeScript and displays the exact spec
   reference. If showing the contract text inside Storybook is useful, it is read from the parsed
   Markdown rather than copied into MDX.
4. `lint:design-system` fails for duplicate/unknown IDs, broken source links, missing required
   fields, an implemented catalogue entry without a story, or a public foundation story without a
   catalogue entry.

This creates traceability without pretending that prose can safely compile into UI behaviour.

## Required story contract

Stories are co-located beside components. Sidebar titles express the atomic taxonomy; folders do
not. Use one deterministic synthetic fixture per coherent contract and freeze locale, timezone,
time, motion, and network state where relevant.

Every atom or molecule needs the smallest applicable set of independently renderable stories:

| Story | Purpose |
|---|---|
| `Default` | canonical semantics, hierarchy, and ordinary content |
| semantic variant stories | each variant that changes meaning or interaction, not cosmetic permutations |
| state stories | disabled, loading, invalid, selected, empty, unavailable, offline, restricted, and failure where relevant |
| `KeyboardFlow` | primary keyboard route and focus/selection assertions through a `play` function |
| `ContentStress` | long names, long errors, identifiers, dates, missing optional values, and dense content |
| `Narrow` | 390-pixel layout or equivalent reflow proof when layout changes |

Global toolbar controls may switch theme, density, locale context, and viewport, but required
evidence must use fixed story parameters so it remains deterministic. Capabilities may add organism
stories under `Capabilities/*`; those stories reference the relevant capability screen contract
and do not promote the organism into the shared library.

## QA and approval flow

The lifecycle is: screen contract or cross-cutting need → Markdown catalogue proposal → owner
accepts intent and owning layer → component, tests, and stories → deterministic CI → candidate
Storybook preview and evidence → owner visual/task QA → GitHub approval and merge → approved
Storybook on `main` → capability adoption.

### 1. Propose the contract

- Name one staff task or safety need and link the originating screen contracts.
- Search the existing catalogue before creating a component or variant.
- Choose the lowest owning layer and record explicit exclusions.
- Specify meaningful states, keyboard/focus behaviour, content stress, and responsive behaviour
  before styling begins.
- Obtain owner agreement for the Markdown contract before a capability makes it a de facto
  standard. A tiny implementation spike may accompany the proposal when feasibility is unclear.

### 2. Implement the candidate

- Reuse semantic tokens and accessible native or existing Radix mechanics.
- Keep atoms and molecules independent of SDK types, authentication, permissions, routes, queries,
  and domain mutation.
- Add focused unit tests, stories, deterministic fixtures, and `play` interactions together.
- Reference contract IDs from stories; never retype normative rules into story descriptions.

### 3. Run automated gates

The smallest relevant checks run during development. A design-system pull request then runs:

- design-system traceability lint;
- TypeScript and existing component tests;
- Storybook static build and render tests;
- Storybook interaction tests in a real browser;
- the official accessibility add-on with violations configured to fail CI;
- Playwright screenshots at fixed desktop and narrow viewports;
- the primary keyboard path with trace/video; and
- the repository `pnpm gate`.

Automated accessibility checks supplement, but do not replace, keyboard, screen-reader, target-size,
contrast, zoom/reflow, and assistive-technology review.

### 4. Owner QA

The pull request presents a candidate Storybook URL when preview hosting is available, with a
downloadable static Storybook artifact as the no-vendor fallback. The PR embeds the named desktop
and narrow screenshots and links the keyboard trace/video.

The owner checks only the contract in the slice:

- task hierarchy and visual fit with Eucalyptus and Wattle;
- all required states, including failure versus empty and pending versus saved;
- keyboard order, focus visibility, selection distinction, and recovery;
- narrow layout, 200% zoom/reflow, comfortable/compact density where supported;
- long, missing, and dense content fixtures;
- concise Australian product language; and
- explicit confirmation for destructive, clinical, and financial consequences.

If intent is wrong, amend the Markdown contract. If implementation does not meet accepted intent,
amend the component, story, or test. Do not approve a screenshot exception that contradicts the
contract.

### 5. Approve and adopt

- GitHub approval plus merge records acceptance; no separate manually edited `approved` flag is
  required.
- Stories on `main` carry the stable catalogue. Branch previews are always candidates.
- A capability can adopt a candidate in the same pull request only when the foundation is a lower
  layer in that slice and the combined change remains small and reviewable. Otherwise the
  foundation lands first.
- Breaking changes identify consumers, provide migration, update evidence, and use deprecation
  before removal where safe.

## Storybook migration

The current `/foundations` route is useful evidence but duplicates the job Storybook should own.
Migrate it without a big-bang rewrite:

1. Resolve the current repository merge and preserve the delivered `UI-001` evidence.
2. Accept the Markdown structure and update all links from `SPEC.md`, delivery manifests, app
   guidance, and the UI-foundations skill in the same specification change.
3. Add Storybook for React and Vite, import the real app tokens/styles, and configure docs,
   viewport/theme controls, interaction tests, and accessibility checks.
4. Convert each existing `/foundations` section into co-located atom/molecule stories using the
   existing synthetic fixtures. Do not change component behaviour merely to complete migration.
5. Point Playwright evidence capture at stable Storybook story URLs and confirm parity at desktop
   and narrow widths.
6. Remove the `/foundations` route only after every maintained item has a catalogue entry, stories,
   automated checks, and equivalent evidence. Preserve useful route tests by moving their
   assertions to stories or focused component tests.

Use the current stable `@storybook/react-vite` framework with the official docs, accessibility,
and Vitest integrations, pinned by the repository lockfile. Preview hosting is a delivery choice,
not a design-system rule; it must use synthetic data and avoid exposing secrets or real patient or
practice information.

## Version 1 library coverage

### Existing baseline to migrate first

| Group | Existing foundations |
|---|---|
| Actions and feedback | Button, Badge, Alert, Progress |
| Form controls | Input, Textarea, Label, Checkbox, Radio Group, Switch, Select |
| Surfaces and display | Card, Avatar, Table primitives, Separator, Skeleton |
| Overlays and disclosure | Dialog, Dropdown Menu, Tabs, Tooltip |
| Pure patterns | Field/Field Group, Context Banner, State Panel, Summary List, Filter Bar, List View |

`EmptyState` should be assessed during migration and either folded into `StatePanel` with consumer
migration or retained only if it has a distinct contract.

### Coverage waves

Candidate names below are needs to validate against screen contracts, not pre-approved APIs. Each
candidate is added only when its first delivery slice defines the reusable contract.

#### Wave 1 — Storybook and baseline parity

- Storybook harness, deterministic fixture decorators, contract metadata, and traceability lint.
- Stories and evidence for all maintained existing atoms and molecules.
- Token, typography, spacing, icon, focus, theme, and density documentation stories.
- Retire `/foundations` after parity.

#### Wave 2 — forms, actions, and save safety

Unblocks registration, settings, appointment and clinical editors.

- Combobox/autocomplete and search input.
- Date, time, date-range, numeric, currency, and file-input mechanics as screen needs prove them.
- Form Section, Form Error Summary, Save State, Action Bar, and Confirmation pattern.
- Unsaved-change/recovery presentation and inline asynchronous validation.
- Popover, Sheet/Drawer, Collapsible/Accordion, Toast/Live Announcement, and Pagination primitives
  where existing mechanics do not cover the accepted contracts.

#### Wave 3 — dense search, lists, and queues

Unblocks patient search, tasks, results, recalls, documents, waiting room, accounts, and worklists.

- Active Filters, Result Count, sortable/paginated Data Table, responsive list alternative, and
  controlled bulk selection/action mechanics.
- List/Detail Workspace, selected-row semantics, queue scope/freshness header, and stable refresh
  behaviour.
- Empty versus failed versus partial/stale data compositions using `StatePanel`.
- Timeline/History, source metadata, and before/after change display.

The pattern owns density, hierarchy, responsive layout, and keyboard coordination. Capability code
supplies protected content, permissions, state transitions, priority, and mutations.

#### Wave 4 — record and workflow composition

Unblocks patient record, consultation, prescribing, referrals, billing, care plans, and duplicate
review.

- Page Header, persistent context/action region, Section Navigation, and Summary/Metadata groups.
- Side-by-side Comparison, version/amendment chain, linked-action status, and preview/review shell.
- Step/Progress navigation for bounded workflows.
- Recoverable Editor shell and document/attachment presentation where a cross-capability contract
  is proven.

Patient identity, allergy meaning, clinical warnings, billing totals, and record lifecycle remain
capability-owned even when rendered through shared patterns.

#### Wave 5 — specialist mechanics, only when capability-led

- Accessible time-grid mechanics and chronological list alternative for calendar work.
- Chart frame with exact textual values/table for reporting and observations.
- Document viewer frame, quarantine/unavailable states, and attachment handling.
- Recurrence, schedule, and drag-equivalent interaction mechanics.
- Rich clinical narrative editing and conflict comparison.

These are not automatically molecules. Most begin as capability-owned organisms because their
meaning depends on appointments, records, permissions, or clinical state. Extract only stable,
domain-neutral mechanics after the contract is demonstrated.

## Delivery sequence

Use one small delivery slice and one open agent-managed pull request at a time:

| Slice | Owner-visible outcome | Explicit exclusion |
|---|---|---|
| DS-001 | Proposed Markdown structure becomes the authoritative linked design-system contract | Storybook or component changes |
| DS-002 | Owner can open a local/static Storybook showing tokens and one traced existing component | migrating the whole gallery |
| DS-003 | Existing atoms have catalogue traceability, stories, tests, and baseline evidence | new atoms |
| DS-004 | Existing molecules have catalogue traceability, stories, tests, and baseline evidence | capability organisms |
| DS-005 | Owner reviews a candidate Storybook build from each design-system PR | third-party visual service unless explicitly chosen |
| DS-006 onward | One coherent screen-driven foundation family per slice, following coverage waves | speculative library expansion |

Each implementation slice should normally contain one to three focused acceptance scenarios and
name its screenshots, fixture, and keyboard flow. A foundation family can share a slice when its
parts cannot be reviewed meaningfully in isolation; otherwise split it.

## Completion checks

The Version 1 foundation library is ready for systematic screen construction when:

- all accepted atom and molecule catalogue entries map to source, stories, tests, evidence, and at
  least one originating screen contract;
- every V1 screen contract has a coverage review showing shared foundations versus explicitly
  capability-owned composition;
- no capability introduces raw brand/status colours, hidden permission logic, or a page-specific
  variant in place of a shared contract;
- required empty, loading, unavailable, offline, restricted, partial, failure, conflict, and saved
  states are consistently distinguishable where applicable;
- keyboard, screen-reader, narrow viewport, 200% zoom/reflow, content stress, and deterministic
  screenshot evidence are current;
- Storybook builds and tests in the repository gate; and
- the approved Storybook on `main` is the same commit from which the evidence was generated.

Even after these checks, organism, template, page, permission, tenancy, clinical-safety, and
end-to-end capability behaviour still require their own screen-contract and acceptance review.

## References

- [Storybook for React with Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)
- [Storybook tags](https://storybook.js.org/docs/writing-stories/tags)
- [Storybook play functions](https://storybook.js.org/docs/writing-stories/play-function)
- [Storybook Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [Storybook accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Publishing a static Storybook](https://storybook.js.org/docs/sharing/publish-storybook)
