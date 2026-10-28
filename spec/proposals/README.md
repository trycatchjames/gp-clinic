# Proposals

A proposal is where a change is worked through before the product commits to it: one change the
product manager can accept or reject whole. It is written in the product stage of
[the flow](../../FLOW.md), from a [grill session](../../FLOW.md#the-grill-session), and accepted
together with its promotion into `spec/` in one pull request.

## Authority

A proposal is the record of **why**. The specification it promotes into is authoritative for
**what** the product does. An accepted proposal explains a decision; it does not govern behaviour,
and it is never cited in place of the specification or an ADR.

Where a decision is durable enough to constrain future work — identity, lifecycle, ownership,
safety or compatibility — the proposal also adds or amends an ADR in
[../decisions/](../decisions), and the ADR governs.

## Shape

```text
spec/proposals/
  P-001-<short-name>.md
  P-002-<short-name>.md
```

One file per proposal, flat, numbered in the order they were started. Proposals are not filed
under a capability, because the ones that matter most span several. Give a new proposal the next
unused number.

## Lifecycle

| Status | Means | Who may change it |
|---|---|---|
| `exploring` | Still being shaped; options are open and the delta may be incomplete | The author |
| `proposed` | Complete enough to decide; every design question is listed | The author, answering review |
| `accepted` | Decided and promoted into `spec/` in the same pull request; now frozen | Nobody. A change takes a new proposal. |
| `rejected` | Decided against, kept so the reasoning is not repeated | Nobody |
| `superseded` | Replaced by the proposal named in `superseded-by` | Only to add `superseded-by` |

A rejected proposal is merged with its status and its reason, so the option is visible the next
time someone considers it.

## Promotion

Acceptance and promotion happen in the same pull request, in this order:

1. Record every decision under **Design questions**, set `status: accepted`, and add `accepted`
   with today's date.
2. Carry domain decisions into [../domain/](../domain) — concepts, invariants, lifecycle
   transitions and ownership.
3. Carry behaviour into the owning capability's `spec.md`: actors, rules, interactions,
   permissions, screen contracts and what is out of scope. Add scenarios to its
   `acceptance.feature`. Update its `review.yaml` so the change produces the right evidence.
4. Update [../cross-cutting/](../cross-cutting), [../contracts/](../contracts) and
   [../architecture/](../architecture) only where meaning actually changed.
5. Add or amend an ADR in [../decisions/](../decisions) for a durable decision.
6. Write a slice in `delivery/slices/` for each outcome the change releases, run the readiness
   review, and record `ready` and `decided_by` on each.
7. Run `pnpm lint:spec`, `pnpm lint:slices` and `pnpm gate`.

After promotion the proposal is the record of why; the specification and the code are the record
of what.

## Writing one

Start from this template. Leave a section in with "None" rather than deleting it, so a reviewer
can see it was considered.

````markdown
---
id: P-###
kind: proposal
status: exploring
capabilities: patient-search, patient-registration
domains: patient
decided_by: <who settled the design questions>
---

# An imperative title for the change

## Problem

What is wrong or missing, for whom, and why now. One or two paragraphs in plain product language.

## Evidence

The research, sources and existing-practice observations this relies on, each linked. Say which
open questions remain open and how the proposal avoids depending on an answer. Where a decision
rests on how Australian general practice works, cite it. Where no source was found, say so.

## Options

Each alternative considered, with the reason it was or was not chosen. Keep the rejected ones.

## Design questions

Numbered within the proposal. Each with the decision, who made it and when.

### Q1 <the question in plain words>

**Recommendation.** What the agent advised, and the evidence behind it.

**Decision.** What was chosen, by whom, on what date.

**Safety consequence.** What a wrong answer here could cause, or "none".

## Delta

What changes, before and after:

- **Domain:** concepts, invariants, lifecycle, ownership.
- **Capability:** rules, interactions, permissions, screens, out of scope.
- **Acceptance:** the scenarios added or changed.
- **Contracts and architecture:** only where meaning changes.
- **Decisions:** the ADR this adds or amends, or "none".

## Clinical safety

What a wrong, late, missing or failed record could cause, and what the interface must never imply.
State "none" only when the change cannot affect care or billing.

## Slices released

Each slice this proposal releases, with its outcome and what it deliberately excludes.

## Out of scope

What is deliberately left for later, so a builder does not fill the gap.

## Open questions

Anything the session did not settle, and whether the change can stand without it.
````
