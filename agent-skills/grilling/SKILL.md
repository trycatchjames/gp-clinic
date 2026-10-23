---
name: grilling
description: Question the user one point at a time on a GP Clinic grill-queue topic until every choice is decided or recorded as open, then write the decisions into the specification. Use for "grill me on <topic>", "what should I grill next?", or when a change needs product or UX decisions the user has not made; do not use unattended.
compatibility: Requires the GP Clinic repository with spec/product/grill-queue/.
---

# Grill the user on a topic

The user decides; you ask, recommend and write it up. Topics live one per file in
`spec/product/grill-queue/`; its `README.md` describes the format and the order.

## Only with the user present

A grill session is a conversation. In an unattended run, such as the PR pipeline, stop: say
the topic needs a session with the user, and change nothing.

## Choosing a topic

For "What should I grill next?", read every topic file's front matter and offer the first
ready topic as the README orders them, with what it decides and what it unblocks. Change
nothing.

## Prepare

Before the first question, read the topic file and everything under its **Starts from**, plus
the specification it would change: `spec/product/experience/` for a `ux` topic, and the
capabilities, domains, cross-cutting requirements and ADRs it touches. Read the screens it names
in `apps/web/src`. Tell the user in a few lines what already exists and what you will ask, so
you ask only what the repository cannot answer.

## Ask

- Ask **one question at a time**, in plain product terms. Start with a concrete example from a
  practice, give your recommendation and why, and the realistic alternatives, so the user can
  answer in a word.
- Spend time on what is expensive to change later: behaviour every screen will copy, safety,
  privacy and data that could be lost. Spend little on wording and layout detail.
- Turn each answer into a worked example. Those examples become acceptance scenarios.
- When an answer conflicts with the specification or an accepted ADR, say so and ask whether it
  supersedes it.
- For each review in `needs-review`, do not settle those parts alone: record what the session
  proposes and that it awaits that review.
- When a question needs a fact nobody has established, do not answer it. Add it to
  `spec/research/open-questions.md` and say whether the topic can be settled without it.
- When the user asks you to settle something, decide it with a reason and record it as decided
  by you at their request.

## Write it up

Use the `gp-specification` skill to write the decisions into the specification, naming who
decided each and the date. For a `ux` topic, update `spec/product/experience/` and name the
screen that first follows each pattern. In the same change, delete the topic's file and add a
file for each part the session deferred, with its `blocked-by`. Run `pnpm lint:spec`, then
open one pull request when the user asks for it.
