# Repository working agreement

This repository is an Australian general-practice product. Treat GitHub pull requests as the
delivery and approval interface: ship small, reviewable user outcomes with observable evidence.

## How work moves

Read [`FLOW.md`](FLOW.md) first. Work moves through three stages, and knowing which one you are
in decides what you may change:

| Stage | Who | You may change |
|---|---|---|
| **Research** | an agent, the PM reviews | `spec/research/` |
| **Product** | the PM, in a grill session | `spec/proposals/`, then `spec/`, then the slices it releases |
| **Build** | the pipeline, unattended | `apps/`, `packages/`, tests and evidence |

**The product stage decides; the build stage never does.** Working in the build stage, decide no
product question. If the specification does not answer something a person using the product could
notice, that is a gap the readiness review missed: stop and raise it for a grill session rather
than choosing. `FLOW.md` has the words this repository uses and the right size for each unit.

A grill session needs the PM present and never runs unattended.

## Authority

1. Read `SPEC.md` before product work.
2. Follow accepted ADRs, domain invariants and cross-cutting safety requirements before
   capability examples or implementation precedent.
3. Read the relevant capability's `spec.md`, `acceptance.feature` and `review.yaml` before changing
   observable behaviour, then follow every dependency linked from `spec.md`.
4. Follow the nearest nested `AGENTS.md` for area-specific instructions.
5. If authoritative requirements conflict, stop implementation and repair or escalate the
   specification conflict. Do not select the easiest interpretation.

Generated OpenAPI output and existing prototype behaviour are evidence only. They must not
override `SPEC.md` or `spec/`.

## Delivery slices

- Implement one delivery slice at a time. A slice has one user outcome, normally one to three
  Gherkin scenarios, explicit exclusions and named review evidence.
- Delivery slice manifests live in `delivery/slices/` and follow
  `delivery/slices/schema.json`. Do not broaden a slice merely because nearby work is easy.
- Keep no more than `PIPELINE_MAX_OPEN_PRS` agent-managed pull requests open. The repository default
  is one; raise it only after the owner explicitly chooses to resume stacking.
- Put a dependency in the same slice or a lower stack layer. Never work around a missing lower
  layer from a higher one.
- Material behaviour, permission, safety, domain, contract or screen changes require the
  corresponding authoritative specification change.
- A slice reaches the pipeline only after a readiness review found no product decision left for
  the builder. That result is the slice's `ready` date and `decided_by`, and `pnpm lint:slices`
  refuses a queued slice without them. A change to a ready slice's rules, scenarios or contracts
  takes the date off until the review passes again.
- Merging the pull request that writes a slice is what releases it: the `Release ready slices`
  workflow opens the queued issue the pipeline picks up. Do not open those issues by hand, and do
  not queue a slice by labelling an issue in place of a readiness review.
- Findings outside the slice become a linked GitHub issue with evidence and acceptance criteria.
  Fix them in the current PR only when they block the story or make it unsafe.

## Pull-request contract

Every product PR must make the following obvious in its body:

- actor, outcome and user/safety problem;
- included acceptance scenarios and explicit exclusions;
- affected capabilities, domains, permissions and invariants;
- screenshots for changed states and a Playwright trace/video for the main flow;
- deterministic validation performed and any unresolved question;
- stack position and the PR immediately below it, when applicable.

Do not claim evidence that was not generated from the PR head. Use demo data only; never put real
patient information, secrets or production data into fixtures, screenshots, traces or logs.

## Required engineering behaviour

- Enforce authorization and practice/account isolation server-side. UI hiding is not access
  control. Add negative tests for forbidden roles and cross-practice identifiers.
- Use granular permission decisions rather than new role-name checks. Existing role checks are
  migration evidence, not a pattern to extend.
- Keep each domain's mutations behind its owner. Cross-domain reads use published contracts;
  cross-domain writes use explicit application orchestration.
- Never silently discard failed saves, conflicts or clinically consequential history.
- Keep generated SDK and OpenAPI outputs deterministic; do not edit generated SDK files.
- Build web screens from unmodified shadcn registry components in `apps/web/src/components/ui`,
  composed with Tailwind utilities. Install a missing one with the shadcn CLI; never edit an
  installed file or write a look-alike. The brand lives only in `apps/web/src/index.css`.
- Lay screens out by [`spec/product/experience/`](spec/product/experience/): web interaction
  patterns and list views. Keep API/permission-aware components in a capability-owned feature
  area.
- Keep `tools/pr-pipeline` independent of application packages. Application code must not import
  it. GitHub workflows should be thin adapters around it.

## Communication and copy

- Pull requests and issues are current-state records, not activity logs. Automation updates the
  marked `Pipeline` and `Automated review` sections in the description and does not post routine
  progress, review, rebase or completion comments. PR comments are reserved for humans.
- Automated review output is verdict-first and capped at three one-line findings. Omit praise,
  scope recaps, checked-item inventories, repeated context and speculative suggestions.
- Agent implementation summaries stay under 300 words and report only outcome, evidence,
  validation and blockers.
- Product copy is brief, task-specific and written at the point of need. Do not explain normal UI
  mechanics, repeat headings, or turn safety guidance into persistent prose when a concise label,
  state or decision-point message is sufficient.
- When a screen settles a layout choice others should follow, record it in
  `spec/product/experience/` in the same PR, naming the screen as the first reference, and say
  who asked for it and when. Six months on, "why is it like this?" then has an answer.
- A pattern is provisional after one screen and hardens on the second. When a second screen needs
  the same thing and exposes a better shape, revise the page rather than building a variant.

## Validation

Run the smallest relevant checks while iterating. The local PR pipeline owns the complete
pre-publication gate and runs it once after the implementation agent returns:

```bash
pnpm gate
```

When working outside the PR pipeline, run that complete gate before handing off a PR.

For UI changes, also run the relevant Playwright project and capture the evidence named by the
slice and capability review manifests. For API, permission, tenancy, migration or clinical-safety
changes, run the database-backed checks even if unit tests pass.

The consolidated LLM review supplements deterministic gates and applies security, access,
clinical-safety, architecture and UX considerations according to the manifest and diff. It must
identify evidence and risks; it does not replace tests for permissions, account boundaries, data
integrity or domain invariants.

## Repository skills

Reusable workflows live canonically in `agent-skills/` using the open Agent Skills format. Add a
skill there and both supported harnesses find it with no further wiring: Claude Code discovers it
through the checked-in `.claude/skills` symlink and Codex through `.agents/skills`. Both symlinks
resolve to that one directory. Never add a second copy, a harness-specific variant or a third
discovery path. Use the relevant skill when a task matches it.

| Skill | For |
|---|---|
| `grilling` | Settling what the product should do, with the PM. The product stage's only entry point. |
| `reviewing-readiness` | Checking a slice has no product decision left before the pipeline takes it. |
| `delivering-slice` | Implementing one ready slice. |
| `reviewing-slice` | The consolidated review gate on a slice pull request. |
| `handling-pr-feedback` | Applying trusted human review to the right layer of a stack. |
| `gp-specification` | Auditing or consolidating the specification outside a grill session. |
