# Repository working agreement

This repository is an Australian general-practice product. Treat GitHub pull requests as the
delivery and approval interface: ship small, reviewable user outcomes with observable evidence.

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
- Prefer accessible shadcn-derived primitives in `apps/web/src/components/ui`, pure shared
  compositions in `apps/web/src/components/patterns`, and API/permission-aware components in a
  capability-owned feature area.
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
- Reusable list, search and filter patterns must be specified and demonstrated in the component
  gallery before a capability makes them the de facto standard. Capability code supplies data and
  rules; the pattern owns density, hierarchy, keyboard behaviour and responsive layout.

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

Reusable workflows live canonically in `agent-skills/` using the open Agent Skills format.
`.agents/skills` and `.claude/skills` are checked-in discovery symlinks to that one source. Use the
relevant skill when a task matches it, especially for delivery slicing, PR evidence, feedback
handling and the consolidated slice review.
