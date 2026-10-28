---
name: reviewing-readiness
description: Check that a delivery slice can be built with no product decision left, so the pipeline meets no surprises. Use before a grill session's pull request opens, for "is <slice> ready to build?", and when a pull request changes a proposal, a capability specification or a slice; do not use to review implementation code.
---

# Review a slice for build readiness

The pipeline builds without anyone present, so every product decision has to be in the
specification before it starts. A question the builder raises mid-build is a gap this review
should have found. Read [the flow](../../FLOW.md), [SPEC.md](../../SPEC.md) and
[the proposal format](../../spec/proposals/README.md).

## What to review

- **A grill session's write-up**, before its pull request opens: every slice it releases.
- **One slice** ("is PATSEARCH-003 ready to build?"): its manifest, the capability behind it and
  what it depends on.
- **A pull request** that changes `spec/proposals/`, `spec/capabilities/`, `spec/domain/`,
  `spec/cross-cutting/` or `delivery/slices/`:

  ```bash
  repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
  gh pr view <n> --repo "$repo" --json title,body,files,url
  gh pr diff <n> --repo "$repo"
  ```

## Build it in your head

For each slice, plan the build as the pipeline would, from only what the repository says: the
manifest, the capability's `spec.md` and `acceptance.feature`, the domains it touches, the
cross-cutting requirements, the contracts, the experience patterns and the accepted ADRs.

Write down every choice the build would have to make. An engineering choice that changes no
observable behaviour — naming, file structure, a library already in the stack — is fine.
**A choice a person using the product could notice is a gap.**

Then check each point:

1. **Outcome.** One actor, one observable outcome, provable by one to three scenarios. The
   manifest's actor, goal and benefit match what the capability says.
2. **Rules.** Each is a durable condition a test can prove. Nothing is "to be decided", "where
   appropriate" or a list of alternatives. Limits, rounding, dates, timezones, ordering,
   intervals and defaults are given as values, not described.
3. **Scenarios.** Every rule the slice delivers has one, with concrete values. The denied,
   cross-practice, invalid, empty, restricted and boundary cases are present, and so are
   corrections and amendments wherever the rules allow them.
4. **Access.** Each action names its permission and resource scope, and which role holds it.
   Denied and cross-practice cases are specified, not implied. A granular permission, not a
   job-title check.
5. **Records.** Every fact the scenarios use exists in the owning domain, with one owner. The
   delta names new fields, relationships and constraints, and says what happens to existing
   records.
6. **Contracts.** Wherever two components share an exact shape — a request, a response, an event,
   an error — a contract gives it. No builder should have to invent a wire shape or an error
   code.
7. **Dependencies.** `depends_on` names the slices this needs, nothing is circular, and each
   dependency is delivered or ahead of it in the stack.
8. **Screens.** Each screen's states are specified — empty, loading, failure, restricted,
   partial, stale — and distinguishable from one another. The pattern it follows is named, and
   the wording of anything the user must understand, such as a warning or an error, is given.
   Layout is left to the build.
9. **Clinical safety.** What a wrong, late, missing or failed record could cause is stated, and
   what the interface must never imply. A destructive or corrective action names its consequence
   and what is retained. A failure cannot read as an empty or successful result.
10. **Evidence.** The capability's `review.yaml` names the screenshots, flows and fixtures this
    change should produce, and the slice's `evidence` block matches them. Fixtures are synthetic.
11. **Out of scope.** What the slice deliberately leaves out is written down, so the build does
    not fill the gap.
12. **Fit.** It agrees with the accepted ADRs, the domain invariants and the cross-cutting
    requirements, or the proposal says which it supersedes and amends it.

## Report

List each slice as **ready** or **not ready**. For each gap, say which point it fails and what a
builder would otherwise have to guess, then ask the decision it needs as a plain product
question, with your recommendation and the evidence behind it.

**Never fill a gap yourself.** Filling one silently makes you the decision-maker, which is the
failure this review exists to prevent.

The slice's `ready` field records the result, and the pipeline builds only a slice that has one:

- **In a grill session**, put each gap to the PM one at a time, record the answers in the
  proposal and the specification, and review again. Set `ready` to today's date and `decided_by`
  to the PM only when the slice passes. Open the pull request only when every slice is ready, or
  the PM has chosen to leave one out of this change.
- **On a pull request with the PM present**, give the report in the conversation and post it only
  if they ask.
- **Unattended**, never add the field. Remove it from any slice the pull request changes that is
  no longer ready, and say so in the report.

A change to a ready slice's rules, scenarios or contracts takes the date off until the review
passes again.
