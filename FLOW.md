# How work moves

Work moves through three stages. The product manager decides what the product does; the pipeline
builds it. Each stage has its own documents, so a reader always knows whether something is
evidence, a decision, or something that exists.

```text
Research              →   Product                            →   Build
what is true              what the product does, and why         what exists
spec/research/            spec/proposals/ → spec/                delivery/slices/ → apps/
an agent, PM reviews      the PM, in a grill session             the pipeline, unattended
a report                  a proposal and its promotion           a slice and its pull request
```

| Stage | Answers | Who | Unit |
|---|---|---|---|
| **Research** | How does Australian general practice actually work, and what is best practice? | An agent, reviewed by the PM | A report. It never decides product behaviour. |
| **Product** | What should the product do, and why? | The PM, in a [grill session](#the-grill-session) | One pull request: the proposal as the record of why, the specification change it promotes, and the slices it releases |
| **Build** | Does the product do it? | `tools/pr-pipeline`, overnight and unattended | A pull request that delivers one slice |

The specification follows the decision; the code follows the specification. The plan for a build
lives in its pull request, not in the repository. Review is a gate at every stage, not a separate
artifact.

## How to ask

The PM names a stage. Each phrase maps to a skill in `agent-skills/<name>/SKILL.md`.

| Say | What happens | Skill |
|---|---|---|
| "Grill me" | Take the next topic off the queue and settle it | `grilling` |
| "Grill me on <topic>" | Settle that topic instead | `grilling` |
| "What's next?" | Show the queue and what each topic unblocks, change nothing | `grilling` |
| "Add <topic> to the queue" | Queue it in dependency order | `grilling` |
| "Is <slice> ready to build?" | Plan the build on paper and report every gap | `reviewing-readiness` |

A grill session is a conversation and needs the PM present. Run without them — in the pipeline or
any unattended run — it stops and says the topic needs a session.

## Shared language

Use these words, with these meanings, in documents, pull requests, commit messages and
conversation. When a word here fits, do not reach for a synonym.

### Research

| Term | Means |
|---|---|
| **Report** | A paper on one topic, in `spec/research/`. Records how Australian general practice works and what good practice looks like. Never decides product behaviour. |
| **Source** | Where a claim comes from, registered in [spec/research/sources.md](spec/research/sources.md). Every statutory rule, fee, interval or programme claim carries one. |
| **Open question** | Something the evidence does not establish, in [spec/research/open-questions.md](spec/research/open-questions.md). Answered by evidence, never by assumption. |

### Product

| Term | Means |
|---|---|
| **Grill session** | A conversation in which an agent questions the PM one point at a time, with its recommendation grounded in research, until every choice a change needs is made or recorded as open. |
| **Proposal** | The record of why, for one change: the problem, the evidence, the options, the decisions and the delta. Identified `P-###`, and frozen once accepted. |
| **Option** | One alternative a proposal considered, kept with the reason it was or was not chosen. |
| **Design question** | A choice the proposal needs someone to make, numbered within it: `P-004 Q2`. Unlike an open question, a decision answers it, not evidence. |
| **Decision** | The recorded answer to a design question, with its date and who made it. |
| **Delta** | What the proposal changes: domain, capability, screens, contracts and acceptance, before and after. |
| **Acceptance** | The PM's approval, which turns a proposal into specification. It always comes with promotion. |
| **Promotion** | Carrying an accepted proposal's decisions into `spec/`, in the same pull request. |
| **Supersede** | Replace an accepted proposal with a newer one. The old one stays as history. |
| **Ready** | A readiness review found a slice has no product decision left for the builder. Recorded as `ready` on the slice. The pipeline builds nothing without it. |

### Build

| Term | Means |
|---|---|
| **Slice** | One user outcome a pull request can deliver and prove, in `delivery/slices/`. The build unit. |
| **Gap** | A choice a build would have to make that a person using the product could notice. Gaps are closed by the PM before the slice is ready, never by the builder. |
| **Follow-up** | Work or a decision noticed while building, outside the current slice, raised as a linked issue. |

### Words to avoid

- **Task:** a slice, or a step inside one. Code never cites a task, a plan step or a pull request;
  it may name the capability it implements, because that identifier is stable.
- **Story:** the actor, goal and benefit inside a slice, not a unit of its own.
- **Epic, sprint, backlog grooming:** not used. The queue and the slice list are the plan.

## The right size

Each unit has a right size. Too large and it cannot be reviewed in one sitting. Too small and it
has no meaning of its own.

| Unit | Right size | Too large when | Too small when |
|---|---|---|---|
| **Report** | One topic, or one jurisdiction on one topic | It mixes evidence with a product decision | It is one fact that belongs in an existing report |
| **Proposal** | One change the PM can accept or reject whole, usually releasing one to five slices | It needs two separate conversations, runs past about 300 lines, or releases more than about five slices: split it and say which depends on which | It changes no domain, capability, screen or contract: edit the specification directly |
| **Slice** | One outcome one actor can observe, proved by one to three scenarios | Its scenarios serve two actors' goals, or its parts would ship at different times | It is not observable on its own, such as "add the search index": that is part of building one |
| **Scenario** | One rule, one example | It checks two rules | It repeats an API permutation through the interface |
| **Pull request** | One proposal, or one slice | It needs two separate reviews | It cannot be reviewed or proved on its own |

## 1. Research

Research records how Australian general practice works — Medicare and MBS rules, programme
requirements, privacy and retention law, recall intervals, what existing software does and why —
and keeps the unknowns visible as open questions. A report may compare approaches or recommend a
direction, but the decision is made in a proposal that links back to it.

Research is the one stage sometimes skipped, but never for anything that bills, calculates a
clinical interval, or touches privacy or retention law. Those need sourced rules before their
product decision is made. A grill session that meets a fact nobody has established stops on it and
records an open question; it never assumes the answer.

## 2. Product

### The grill session

The PM decides what the product does. "Grill me" starts a session: the agent asks one question at
a time, with a recommendation grounded in research and existing practice, until it has an answer
or a recorded open question for every point below. A point that does not apply is said to, rather
than skipped.

1. **Outcome and actors:** who achieves what, and why it matters to them.
2. **Access:** each action, its resource scope and the permission it needs, which role holds that
   permission, and the denied and cross-practice cases.
3. **Records and ownership:** what the change owns, what it reads or writes that another domain
   owns, and which domain is authoritative.
4. **Lifecycle:** its states, what is locked when, and how a mistake is corrected or reversed
   without erasing history.
5. **Clinical safety:** what a wrong, late, missing or failed record could cause, and what the
   interface must never imply.
6. **Effects:** what changes elsewhere when this changes, and what happens here when something it
   depends on changes.
7. **Evidence:** what research it relies on, and what is still open.
8. **Worked examples:** concrete cases, with numbers where there are any. They become the
   scenarios.
9. **Journey and screens:** the steps, each screen's states (empty, loading, failure, restricted,
   partial, stale), and the pattern in [spec/product/experience/](spec/product/experience/README.md)
   it follows.
10. **Out of scope:** what is deliberately left for later.

The agent then writes it all up: the proposal, the promotion into `spec/`, and the slices it
releases. It checks each slice is [ready to build](#ready-to-build), then opens one pull request.

### Grounding a recommendation

Every question carries the agent's recommendation. A recommendation on anything clinical,
regulatory or billing-related must be grounded, not asserted: say what Australian general practice
does today, cite the research or source behind it, and say plainly when no source was found. The
PM decides either way, but they decide against evidence rather than against an opinion.

Where a decision would affect patient safety, say so in the question, and record the safety
consequence alongside the decision in the proposal.

### Ready to build

Before the pull request opens, the agent checks each slice is ready (the `reviewing-readiness`
skill). It plans the build as the pipeline would, from only what the repository says, and lists
every choice the build would face. A choice that changes what a person could notice is a **gap**:
a rule without its values, a rule without a scenario, a missing denied or cross-practice case, an
undefined error shape, an unstated screen state, or a record the domain lacks.

Each gap goes back to the PM as a plain question until every slice is ready. The pipeline builds
and reviews without anyone present, so the specification must leave it nothing to decide.

A slice the review finds ready records the date in its `ready` field. A change to a ready slice's
rules, scenarios or contracts takes the date off until the review passes again.

### The proposal

The proposal is the record of why. It states the problem, links the evidence, compares the options
with the reason each was or was not chosen, records each decision with its date and who made it,
and sets out the delta. Once accepted it is frozen: a change takes a new proposal.

An accepted proposal explains; it does not govern. The specification it promoted into is
authoritative for what the product does. See [spec/proposals/README.md](spec/proposals/README.md).

## 3. Build

**Merging the grill session's pull request is what releases the work.** When its slices reach
`main`, the `Release ready slices` workflow opens a queued issue for each one that is `queued`
with a `ready` date. The PM merges; nobody has to open an issue by hand. A queued slice that
somehow arrives without a readiness result is not released, and the run says so.

The build itself still runs locally with `pnpm pipeline:run`, because no model credential is held
in GitHub. The pipeline picks the next ready slice whose dependencies are met, implements it
against the specification, captures its evidence, reviews it and hands back a pull request.

It decides no product question. A question it raises during a build is a gap the readiness review
should have found, and it is answered by the PM in a grill session, not by the builder.

`AGENTS.md` holds the engineering rules for that stage.
