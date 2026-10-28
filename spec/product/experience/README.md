# Experience

## Outcome

The interface helps Australian general-practice staff move quickly without losing patient,
practitioner, location, record, responsibility or save context. It should feel calm and assured
under pressure: professional enough for clinical work, warm enough for a community practice, and
distinctive without becoming decorative.

This directory is the normative contract for what a screen does and how it behaves. Capability
screen contracts remain authoritative for domain meaning, protected information, permissions and
task outcomes. Application code and gallery examples are implementation evidence only.

## How to use it

| Change | Read |
|---|---|
| Where a task happens — panel, dialog, page, inline | [patterns/choosing-a-surface.md](patterns/choosing-a-surface.md) |
| A screen that searches, filters, scans or selects records | [patterns/finding-records.md](patterns/finding-records.md) |
| Presenting a record's saved facts | [patterns/reading-a-record.md](patterns/reading-a-record.md) |
| A record's history, amendments or entered-in-error entries | [patterns/record-history.md](patterns/record-history.md) |
| Comparing or merging two records or versions | [patterns/comparing-records.md](patterns/comparing-records.md) |
| A date, time, number, file or controlled choice | [patterns/entering-values.md](patterns/entering-values.md) |
| Grouping fields, disclosing sections, gathering errors | [patterns/organising-a-form.md](patterns/organising-a-form.md) |
| Saving, conflicts, recovery, dirty state | [patterns/saving-work.md](patterns/saving-work.md) |
| A destructive or corrective action | [patterns/confirming-an-action.md](patterns/confirming-an-action.md) |
| Telling someone what an operation did | [patterns/reporting-an-outcome.md](patterns/reporting-an-outcome.md) |
| Empty, restricted, stale, partial or failed results | [patterns/empty-and-failed-outcomes.md](patterns/empty-and-failed-outcomes.md) |
| Naming a screen, its subject and its freshness | [patterns/naming-a-screen.md](patterns/naming-a-screen.md) |
| Moving between the sections of a workspace | [patterns/moving-between-sections.md](patterns/moving-between-sections.md) |
| Colour, type, spacing, density, states, copy, dates and numbers | [rules.md](rules.md) |
| What exists and where it lives | [components.md](components.md) |

[rules.md](rules.md) applies to every pattern. A pattern page may add to it for its own problem;
it may not contradict it.

Before changing observable capability behaviour, also read that capability's `spec.md`,
`acceptance.feature`, `review.yaml` and every dependency linked from its specification.

## How a pattern is settled

A pattern is not settled by being written down. It is settled by a real screen shipping, and then
hardened when a second screen needs the same thing.

1. **Name the first reference.** Every pattern page names the shipped screen that established it.
   New work copies that screen rather than interpreting prose. A pattern with no shipped consumer
   says so plainly, and says which capability is expected to be its first — an unproven pattern is
   a proposal, not a standard.

2. **Revise on the second instance.** A pattern is provisional after one screen. When a second
   screen needs the same thing and exposes a better shape, change the page — do not quietly build
   a variant. Reusable list, search, filter and save patterns must be specified here and
   demonstrated in the gallery before a capability makes them the de facto standard.

3. **Record who asked, and when.** Every page carries a **Settled by** section naming the slice,
   the review or the person whose decision produced it, with a date. Six months later "why is it
   like this?" has an answer, and nobody — human or agent — quietly improves away a deliberate
   choice. A decision made in a review is recorded in the page it changed, in the same pull
   request.

A pattern page owns the product problem and the rules that answer it. The contracts at the foot of
each page own the reusable mechanics. Primitives own neither and are listed in
[components.md](components.md).

## Adding or changing a pattern

### Need before component

Start from an accepted staff task, safety need or repeated cross-cutting requirement. Do not start
from a preferred component shape.

1. Read the originating capability screen contract and its review manifest.
2. Inspect existing tokens, primitives, patterns and consumers.
3. Show why native markup or an existing pattern cannot express the need.
4. Choose the lowest layer that can own it without learning application data or rules.
5. State what remains capability-owned.

Markup repeating once is not evidence for extraction. A repeated fragment becomes a pattern only
when it owns a stable reusable contract and at least one accepted screen requires it. A component
does not become generic merely because domain data is renamed to abstract props.

### Stable IDs

Every public primitive or pattern receives a stable ID: `DS-ACT` actions, `DS-FRM` forms,
`DS-DSP` display, `DS-FBK` feedback and state, `DS-NAV` navigation and disclosure, `DS-OVR`
overlays, `DS-PAT` composed patterns. An ID is never reused after removal.

### What a contract states

- **Need** — the staff task or safety need;
- **Owner** — source path;
- **Semantics** — element, role and meaning;
- **Public contract** — controlled props, slots, callbacks, meaningful variants;
- **States** — interaction, async, save, error and selection states that apply;
- **Keyboard and focus** — order, movement, activation, dismissal, recovery, announcements;
- **Responsive/content** — narrow, zoom and reflow, density, long and missing content, truncation;
- **Required stories** — stable isolated proofs;
- **Evidence** — stable screenshot and interaction identifiers;
- **Used by** — originating screen contracts;
- **Excludes** — behaviour retained by capabilities or higher authority.

The exclusions matter most. A pattern that does not say what it refuses to decide will be given
those decisions by its first caller.

## Evidence

Storybook is the executable gallery; stories sit beside their component source. The Markdown here
stays normative — Storybook demonstrates the implementation, it does not define it. If contract
prose appears in Storybook it is read from these files, never copied.

### Required stories

| Story | Purpose |
|---|---|
| `Default` | canonical semantics, hierarchy and ordinary content |
| semantic variant | each variant that changes meaning or interaction, not cosmetic permutations |
| state | disabled, loading, invalid, selected, empty, unavailable, offline, restricted, partial, stale, failure or conflict where relevant |
| `KeyboardFlow` | primary keyboard route, focus, activation, dismissal and selection assertions |
| `ContentStress` | long and missing values, identifiers, dates, errors, dense content, wrapping |
| `Narrow` | narrow-layout or reflow behaviour where it changes |
| `ReducedMotion` | equivalent state where animation would otherwise communicate change |

Named evidence uses fixed story parameters, so the same commit produces the same result.

### Deterministic fixtures

- Synthetic names, identifiers, practices, locations, messages and records only. Never real
  patient, staff, practice, credential, secret or production data.
- Freeze locale, timezone, current time, reduced-motion preference and network state.
- Make randomness, generated IDs, animation, service workers and async delay deterministic or
  disabled for capture.
- Include long names, missing optional values, similar identities, dates, identifiers, multiline
  errors and the densest accepted content where relevant.
- A fixture names a reusable contract state. It MUST NOT claim an API, permission, clinical or
  end-to-end outcome the isolated component cannot prove.

### What each kind of evidence proves

| Evidence | Proves | Does not prove |
|---|---|---|
| component test | DOM semantics, accessible relationships, controlled callbacks, invalid and disabled behaviour | real browser focus, layout, capability outcome |
| Storybook render test | an isolated story renders with its configured context | visual correctness or end-to-end behaviour |
| Storybook `play` test | interaction and assertions in a real browser | permission, tenancy, server mutation, audit |
| accessibility add-on | automatically detectable violations | complete WCAG conformance or assistive-technology usability |
| Playwright screenshot | rendered hierarchy and named state at a fixed viewport | keyboard or mutation correctness |
| Playwright trace/video | primary keyboard and pointer path, focus and state transitions | unexercised edge cases |
| capability test | permission, API, tenancy, domain and end-to-end outcome | reuse quality outside that capability |

Generate evidence from the reviewed commit. Never edit evidence to hide a defect. A screenshot
exception cannot override a normative contract.

Traceability lint fails on a duplicate or unknown ID, a broken source reference, a pattern story
without a contract, a contract without a registered story, or evidence a contract never declared.

## Review

Review the rendered result, not only the diff:

1. Can anything be removed without reducing usefulness?
2. Is every border necessary? Is every card necessary?
3. Is colour communicating meaning, or decorating?
4. Can a clinician scan the important information in under two seconds?
5. Does it remain understandable in greyscale?
6. Does it look like a mature clinical tool rather than a generic SaaS template?
7. Is it compact without feeling cramped?
8. Is every required state distinguishable — above all failure from empty, and pending from saved?
9. Are keyboard order, focus visibility, selection distinction, activation, dismissal and recovery
   correct?
10. Do narrow layout, 200% zoom and reflow preserve required information and targets?

If the intent is wrong, amend the pattern page. If the implementation does not meet accepted
intent, amend the component, story or test.

## Approval, change and deprecation

A change is complete when it has an accepted need and owning layer, a contract with explicit
exclusions and originating screen links, a minimal controlled public API with every meaningful
state, focused tests, a deterministic fixture, gallery examples linked to the stable ID, the
applicable desktop, narrow, content-stress and keyboard evidence, a passing repository gate, and
owner approval on the pull request.

For a breaking change: identify every consumer and affected screen contract, explain the user or
safety problem rather than a styling preference, update the page, source, stories, tests and
evidence atomically, provide migration, and deprecate before removal where consumers need time.
Never silently weaken keyboard, error, recovery, permission or safety behaviour.

Removal retires but never reuses the ID.

A pattern proves reuse mechanics only. Capability adoption still proves permission, tenancy, API,
clinical safety, domain rules and the end-to-end outcome.
