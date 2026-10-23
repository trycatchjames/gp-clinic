# Grill queue

Topics waiting for a grill session. This folder is non-normative: each file is a question to
settle, not a rule to follow. A session settles a topic with the people deciding and writes the
result into the authoritative specification, such as [`experience/`](../experience/).

Ask **"What should I grill next?"** and the agent offers the first topic that is ready. **"Grill
me on <topic>"** starts one. The `grilling` skill runs the session.

## One file per topic

Each topic is its own file, named by a short descriptive name, so branches that settle or add
different topics never edit the same file. There is no index to keep in step and no numbering.

```markdown
---
area: ux
blocked-by: [ux-save-feedback]
needs-review: [clinical-safety]
---

# Topic title

## Decide
## Why we're asking
## Examples
## Starts from
## Blocks
```

- `area` groups topics. `ux` decides how screens behave across the app; other areas join later.
- `blocked-by` names the topics, by file name, that must be settled first. Leave it empty when
  nothing blocks the topic.
- `needs-review` names the reviews a session must bring in before it settles the topic, such as
  `clinical-safety` or `privacy`. A session does not settle those parts alone.
- **Decide** lists the questions. **Why we're asking** says what goes wrong if nobody decides.
  **Examples** are concrete cases from a practice; they become the acceptance scenarios.

## Order

A topic is ready when every topic it is blocked by has been settled, that is, its file is gone.
Among ready topics, take the one that blocks the most others, then the one a planned slice
needs soonest.

## Settling a topic

The pull request that settles a topic deletes its file, writes the decisions into the
specification with who decided and the date, and adds a file for each part the session
deferred. A decision recorded here before a session, such as a chosen direction, is still only
a starting point until the specification says it.
