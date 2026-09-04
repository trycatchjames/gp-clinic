# Storybook and evidence

## Purpose

Storybook is the executable workbench for isolated foundations, atoms, molecules, and useful
capability compositions. It demonstrates the implementation; the Markdown contract remains
normative. Component tests, browser tests, accessibility checks, screenshots, and traces provide
evidence. GitHub pull-request approval and merge record acceptance.

Until the Storybook harness and current-component parity are delivered, `/foundations` remains the
executable gallery and its existing `data-evidence` targets remain valid. Storybook replaces that
route only after every maintained atom and molecule has equivalent stories, checks, and evidence.
The migration MUST NOT discard delivered `UI-001` evidence or weaken a component contract.

## Storybook structure

Stories are co-located with their component source. Sidebar titles provide the composition taxonomy
without creating new source folders:

| Layer | Storybook namespace | Normative contract |
|---|---|---|
| visual foundation | `Foundations/*` | this directory's foundation documents |
| atom | `Atoms/<category>/*` | [Atom catalogue](atoms.md) |
| molecule | `Molecules/<category>/*` | [Molecule catalogue](molecules.md) |
| organism/template | `Capabilities/<capability>/*` | capability screen contract |
| page | only when isolated review adds value | capability screen and acceptance contracts |

The component source remains under `components/ui`, `components/patterns`, capability features, and
routes. Story navigation does not change code ownership.

## Specification bridge

Each catalogue heading supplies a stable contract ID. A co-located Component Story Format file
declares typed metadata equivalent to:

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

The implementation bridge MUST remain small:

1. A repository script parses catalogue headings and required fields during lint/build.
2. A typed helper records contract ID, source reference, evidence IDs, ownership, and tags in story
   metadata.
3. Autodocs derives the implementation API from TypeScript and links to the exact contract.
4. If contract prose is shown inside Storybook, it is read from the Markdown source rather than
   copied into independently maintained MDX.
5. Traceability lint fails for duplicate or unknown IDs, broken source references, missing required
   catalogue fields, or a public foundation story without a catalogue entry. During the migration
   it reports the number of maintained catalogue entries still awaiting stories. The full-gallery
   parity slice turns any remaining catalogue entry without a story into a failure before
   Storybook replaces `/foundations`.

Markdown does not compile directly into production UI. It constrains implementation and enables
traceability; a human still reviews the component contract and rendered result.

## Required stories

Use the smallest applicable set of independently renderable stories. Semantic variants or states
receive separate stories when doing so improves testing, visual comparison, or direct linking.

| Story | Purpose |
|---|---|
| `Default` | canonical semantics, hierarchy, and ordinary content |
| semantic variant | each variant that changes meaning or interaction, not cosmetic permutations |
| state | disabled, loading, invalid, selected, empty, unavailable, offline, restricted, partial, stale, failure, or conflict where relevant |
| `KeyboardFlow` | primary keyboard route, focus, activation, dismissal, and selection assertions |
| `ContentStress` | long/missing values, identifiers, dates, errors, dense content, and wrapping |
| `Narrow` | the component's narrow-layout or reflow behaviour when it changes |
| `ReducedMotion` | equivalent state when animation would otherwise communicate change |

Global toolbar controls MAY switch density, locale context, and viewport for exploration. The
Version 1 workbench uses the approved light appearance only. Named evidence MUST use fixed story
parameters so the same commit produces the same result.

## Deterministic fixtures

- Use synthetic names, identifiers, practices, locations, messages, and records only.
- Never use real patient, staff, practice, credential, secret, or production data.
- Freeze the relevant locale, timezone, current time, reduced-motion preference, and network state.
- Make randomness, generated IDs, animation, service workers, and asynchronous delay deterministic
  or disabled for evidence capture.
- Include long names, missing optional values, similar identities, dates, identifiers, multiline
  errors, and the densest accepted content when relevant.
- A fixture names the reusable contract state; it MUST NOT claim an API, permission, clinical, or
  end-to-end outcome that the isolated component cannot prove.

## Test and evidence split

| Evidence | Proves | Does not prove |
|---|---|---|
| component test | DOM semantics, accessible relationships, controlled callbacks, invalid/disabled behaviour | real browser focus, layout, capability outcome |
| Storybook render test | an isolated story renders with its configured context | visual correctness or end-to-end behaviour |
| Storybook `play` test | interaction and assertions in a real browser story | permission, tenancy, server mutation, audit |
| accessibility add-on | automated detectable accessibility violations | complete WCAG conformance or assistive-technology usability |
| Playwright screenshot | rendered hierarchy and named state at a fixed viewport | keyboard or mutation correctness |
| Playwright trace/video | primary keyboard/pointer path and focus/state transitions | unexercised edge cases |
| capability test | permission, API, tenancy, domain, and end-to-end outcome | general reuse quality outside that capability |

A design-system pull request runs traceability lint, TypeScript, focused component tests, Storybook
static build/render tests, applicable `play` tests, automated accessibility checks configured to
fail on violations, fixed desktop/narrow screenshots, the primary keyboard trace/video, and the
repository gate required by the delivery workflow.

Automated checks supplement manual keyboard, screen-reader, target-size, contrast, zoom/reflow, and
assistive-technology review. A known exception needs an explicit, time-bounded remediation decision.

## Owner QA

The pull request provides a candidate Storybook URL when preview hosting is available and a
downloadable static build as the no-vendor fallback. It embeds the named screenshots and links the
trace/video generated from the reviewed head.

The owner reviews only the contract in the delivery slice:

- the staff task and current context lead the hierarchy;
- the Compact Clinical palette is warm, restrained, high-trust, and leaves dense work calm;
- colour communicates brand, selection, or semantic meaning rather than decoration;
- the composition remains understandable in greyscale and avoids unnecessary cards and borders;
- every required state is available, especially failure versus empty and pending versus saved;
- keyboard order, focus visibility, selection distinction, activation, dismissal, and recovery are
  correct;
- narrow layout, 200% zoom/reflow, and supported density preserve required information and targets;
- long, missing, and dense fixture content remains usable;
- product language is concise, task-specific, and Australian; and
- destructive, clinical, and financial consequence remains explicit.

If intent is wrong, amend the Markdown contract. If implementation does not meet accepted intent,
amend the component, story, or test. A screenshot exception cannot override a normative contract.

## Publishing and approval

The Storybook build for a pull request is always a candidate. Merge approval is granted through the
GitHub pull request after required evidence passes. The Storybook built from the merged commit on
`main` is the approved reference.

Preview hosting is a delivery decision rather than a component rule. It MUST use synthetic content,
expose no secrets, and comply with repository security controls. The implementation should use the
current stable React/Vite Storybook framework and official docs, accessibility, and test
integrations, pinned by the repository lockfile.

## Storybook references

- [React with Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)
- [Tags](https://storybook.js.org/docs/writing-stories/tags)
- [Play functions](https://storybook.js.org/docs/writing-stories/play-function)
- [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [Static publishing](https://storybook.js.org/docs/sharing/publish-storybook)
