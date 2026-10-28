---
name: grilling
description: Question the product manager one point at a time to settle what the product should do, then write it up as a proposal, its promotion into spec/, and the ready slices it releases, as one pull request. Use for "grill me", "grill me on <topic>", "what's next?" and "add <topic> to the queue"; do not use for implementation work or for anything the specification already answers.
---

# Grill the product manager

The product manager decides what the product does. You ask, recommend and write it up. Read
[the flow](../../FLOW.md), especially the grill checklist, and
[the proposal format](../../spec/proposals/README.md).

Assume the PM is not technical and is often on a phone. That shapes everything below: short
questions, no jargon, no commands for them to run, and a pull request they can judge without
reading a diff.

## Only with the PM present

A grill session is a conversation. If nobody can answer you — a pipeline run, or any unattended
invocation — stop. Say the topic needs a session with the PM and change nothing.

## "What's next?"

Read [the queue](../../spec/grill-queue.md) and report the first few topics whose blockers are
settled: what each decides and what it unblocks. Change nothing and start nothing.

## "Add <topic> to the queue"

Add it to [the queue](../../spec/grill-queue.md) in dependency order, with what it decides, what
it unblocks and whether it needs research first. Commit it on a branch with a pull request. Do
not start a session.

## Prepare before the first question

Read enough that you only ask what the repository cannot answer. Do this silently — do not narrate
the reading.

- [SPEC.md](../../SPEC.md), the authority order, and the Version 1 boundary.
- The owning capability's `spec.md`, `acceptance.feature` and `review.yaml`, and the capabilities
  either side of it.
- Every domain that owns a fact the topic touches, and the cross-cutting requirements for
  clinical safety, privacy, authorisation, audit and error handling.
- Accepted ADRs in [spec/decisions/](../../spec/decisions) that constrain the topic.
- [spec/research/](../../spec/research), its sources and its open questions.
- The pattern in [spec/product/experience/](../../spec/product/experience/README.md) any screen
  would follow.
- Existing proposals in [spec/proposals/](../../spec/proposals) on the same records or journey.

Then tell the PM, in a few short lines: what the repository already settles, what you will ask
about, and roughly how many questions. If an existing proposal already covers the topic, ask
whether to work from it.

## Ask

Work through [the checklist](../../FLOW.md#the-grill-session) in order.

- **One question at a time.** Never two in a message. Wait for the answer.
- **Lead with your recommendation**, then the realistic alternatives, so the PM can answer in a
  word. "I'd suggest X, because … The alternative is Y, which would mean … Which way?"
- **Plain product language.** No capability IDs, no file paths, no "cross-cutting invariant", no
  "aggregate". Say "the patient record", not `spec/domain/patient.md`.
- **Push hardest on what is expensive to change later:** ownership, lifecycle, corrections, who
  may see what, and how other features depend on this one. Spend little on wording and layout
  detail, which are cheap to change.
- **Make every answer concrete** with a worked example, using real numbers where there are any.
  Those examples become the scenarios.
- When an answer conflicts with an accepted ADR or the current specification, say so and ask
  whether this supersedes it.
- When the PM asks you to settle something, decide it with a reason and record it as decided by
  you at their request.
- If the topic grows past one proposal, say so, propose the split and which part depends on
  which, then take one part at a time.

### Ground every recommendation

On anything clinical, regulatory or billing-related, a recommendation must be grounded rather
than asserted. Say what Australian general practice does today and cite the research or source
behind it. Where you looked and found nothing, say that plainly — "I couldn't find a source for
this; my reasoning is …" — so the PM knows what they are deciding against.

Where a wrong answer could affect patient safety, say so in the question itself, and record the
safety consequence beside the decision.

## The three stops

**Research.** A question that needs a fact nobody has established — an MBS rule, a statutory
retention period, a lawful disclosure, a clinical interval — is not yours to answer. Record it in
[spec/research/open-questions.md](../../spec/research/open-questions.md), tell the PM the design
cannot safely rest on a guess, and offer a research step. Anything that bills, calculates a
clinical interval, or touches privacy or retention law needs its rules sourced first.

**Authority.** A decision that contradicts an accepted ADR, a domain invariant or a cross-cutting
safety requirement stops. Name what it contradicts, in plain words, and ask whether this
supersedes it. If it does, the proposal says so and amends the ADR. Never quietly weaken a
requirement.

**Scope.** Version 1 connects to no external service. A topic that needs one is parked, not
designed around with a simulated success.

## Write it up

When the checklist is done, work on a new branch and write:

1. **The proposal**, as [spec/proposals/README.md](../../spec/proposals/README.md) describes: the
   next unused `P-###`, the problem, the evidence, the options with the reason each was or was not
   chosen, every design question with its decision, who made it and the date, the delta, the
   clinical-safety consequence and what is out of scope.
2. **Its promotion**, when no design question is open: set `status: accepted` with today's date,
   then carry the decisions into the domain, the capability's `spec.md`, its `acceptance.feature`
   and its `review.yaml`, plus cross-cutting, contracts and an ADR where meaning genuinely
   changed. With a question still open, leave the proposal `exploring` and promote nothing.
3. **The slices it releases**, in `delivery/slices/`, one per observable outcome, each within
   [the right size](../../FLOW.md#the-right-size).
4. **The readiness review** on each slice, with the `reviewing-readiness` skill. Put every gap it
   finds to the PM as another plain question, one at a time, until each slice is ready. Then set
   `ready` to today's date and `decided_by` to the PM on each.
5. Run `pnpm lint:spec`, `pnpm lint:slices` and `pnpm gate` yourself. Never ask the PM to run
   anything.

## Hand it back

Open one pull request, with its body from
[the proposal template](../../.github/PULL_REQUEST_TEMPLATE/proposal.md). Write it for the PM,
not for an engineer: what this decides, what changes for staff, what gets built next, what is
still open, and the safety consequence. The changed files go last, inside the collapsed section,
never at the top.

Then tell the PM in two or three lines: what it settles, that the readiness review passed, and
that merging is what releases the work — the `Release ready slices` workflow opens a queued issue
for each ready slice as soon as it reaches `main`. Give them the link. Do not merge unless they
say to.

Finally, remove the finished topic from [the queue](../../spec/grill-queue.md) in the same pull
request, and add any deferred part where its dependencies put it.
