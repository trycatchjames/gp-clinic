---
name: delivering-slice
description: Implement one queued GP Clinic delivery slice as a small, spec-traceable pull request with tests and review evidence. Use for work selected from delivery/slices or an agent:queued GitHub issue; do not use for broad roadmap or unrelated maintenance work.
---

# Deliver one slice

1. Read `AGENTS.md`, `SPEC.md`, the slice manifest, every referenced scenario and the affected
   capability/domain/cross-cutting documents. Resolve specification conflicts before coding.
2. Restate the actor, outcome, exclusions, affected permissions and safety risks. Keep the change
   inside the slice. Create a linked issue for non-blocking discoveries outside it.
3. Implement a vertical, deployable outcome. Put pure UI primitives/patterns and connected
   capability code in their defined layers. Keep `tools/pr-pipeline` out of application imports.
4. Add deterministic tests for the acceptance scenarios. Permission or practice-scoped changes
   require forbidden-role and cross-practice negative tests.
5. Use the `capturing-pr-evidence` skill for observable UI changes. Update the slice manifest to
   `in_review` only after its named evidence exists.
6. Run the smallest relevant checks while iterating, including database-backed or Playwright
   checks when the risk requires them. When invoked by `tools/pr-pipeline`, do not run the full
   `pnpm gate`; the harness runs it once after implementation. Outside that harness, run the full
   gate before handoff. Fix failures caused by the slice and report unrelated failures with
   evidence.
7. Prepare the PR body from `.github/pull_request_template.md`. State what remains unresolved and
   never claim a check or screenshot that was not produced from the current head.

Do not merge, approve, resolve human review threads or expand the slice without explicit authority.
