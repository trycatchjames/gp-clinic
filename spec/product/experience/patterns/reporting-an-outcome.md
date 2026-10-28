# Reporting an outcome

## The problem

After an operation the person needs to know what actually happened — not that something was
attempted, and not a cheerful summary that papers over the rows it skipped. A bulk action that
reports "done" when it processed 18 of 20 records has misreported the state of the system.

This page covers telling someone the result of an operation. Whether their edit is on the record
is [saving work](saving-work.md).

## Rules

- Say what happened, in words, including what was skipped and why.
- A partial result names the failed scope and does not imply complete success.
- When an operation deliberately did nothing, say so.
- Report an outcome without taking focus from the task in hand. Routine updates are announced
  politely; interrupt only when the consequence warrants it.
- Name the object and the action only after durable success.
- A failure says what failed, what remains unchanged, and the safe next step. Never show server
  internals.
- Keep a failure available until dismissed. A notification that disappears has not been read.

## First reference

None on real data. `ToastRegion` and `ItemisedOutcome` were specified and demonstrated by DS-019
and DS-026. The first capability with a bulk operation becomes this page's first reference.

## Settled by

Toast region by DS-019 ("report an operation's outcome without taking focus from the task in
hand"), itemised outcome by DS-026 ("say what a bulk operation would do, and then what it
actually did").

## Contracts

### DS-PAT-014 Toast Region

- **Need:** Report the outcome of a completed or failed operation where the operator is looking,
  and announce it to assistive technology, without moving focus away from the task in hand.
- **Owner:** `apps/web/src/components/patterns/toast-region.tsx`.
- **Semantics:** A labelled landmark holding an ordered list of outcome messages, paired with two
  live regions that exist for the life of the component. Routine confirmation and status use the
  polite region; a failed operation uses the assertive one. The visible stack is NOT itself a live
  region, so a message is announced once and its controls are not read as part of it.
- **Public contract:** Requires the controlled list of messages and a dismissal callback. Each
  message requires a stable identity, a tone, and a title naming the object and the action, and
  accepts a description, a single recovery or undo action, and an explicit announcement string. The
  caller owns every word, the operation, and when a message is removed.
- **States:** Success, routine status, and failure. Success wording is only correct after a durable
  commit. A failure states what did not happen and what remains unchanged, and offers the safe next
  step as a control. Re-supplying an unchanged message under its existing identity MUST NOT announce
  it again, so a background refresh cannot repeat itself.
- **Keyboard and focus:** Arrival never moves focus. Every message exposes a dismissal control named
  with its title, and any recovery action is reachable in reading order before it. The region owns
  no timer: a message stays until the caller removes it or the operator dismisses it, so an outcome
  cannot expire before it has been read.
- **Responsive/content:** Messages stack from the bottom edge on narrow screens and from the bottom
  right otherwise, and are bounded in width. A long partial-failure description wraps in full rather
  than truncating, because a hidden clause can turn a partial result into an apparent success. Tone
  is carried by an icon and a leading word as well as by colour.
- **Required stories:** `Default`, `Tones`, `FailureWithRecovery`, `WithUndo`, `ContentStress`,
  `Narrow`, `Announcement`, and `KeyboardFlow`.
- **Evidence:** `toast-tones`, `toast-failure`, `toast-content-stress`, `toast-narrow`,
  `toast-announcement`, and `toast-keyboard`.
- **Used by:** [Calendar day](../../../capabilities/calendar/spec.md#screen-contract-calendar-day) and
  [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Deciding that an operation succeeded, retry and idempotency, wording, how long a
  message should remain, persistent or reviewable notification history, and any message that carries
  required instructions or a decision the operator must not miss.

### DS-PAT-021 Itemised Outcome

- **Need:** Show what an operation across many records would do, and then what it actually did, so a
  partial result cannot read as complete success and every record that did not change keeps its
  identity and its reason.
- **Owner:** `apps/web/src/components/patterns/itemised-outcome.tsx`.
- **Semantics:** A labelled region whose summary counts each outcome, followed by the records
  grouped by outcome with the ones needing attention first. The same structure serves the preview
  before commit and the result afterwards, so an operator reads the record list in one shape twice.
  A result containing a failure carries alert semantics; a preview never does, because nothing has
  happened yet.
- **Public contract:** Requires the phase, a heading, the singular and plural noun for what is
  counted, and the items, each with a stable key, the record's name, and an outcome. The phase
  constrains the permitted outcomes by type: a preview may only say `ready` or `blocked`, and a
  result may only say `applied`, `failed`, or `skipped`. Each item accepts a reason and a single
  recovery action. The caller owns the operation, whether a retry is safe, and every word.
- **States:** Preview with every record ready; preview with blocked records; complete success;
  partial success; nothing applied; and an operation still running, which claims no outcome for a
  record it has not reached. Records that succeeded MAY be collapsed through `DS-PAT-018` because
  they need no further work; records that failed, were skipped, or are blocked MUST remain visible.
  A summary MUST NOT state a total that its items do not account for.
- **Keyboard and focus:** Arrival does not move focus. Every recovery action is a control in
  reading order beside the record it belongs to. Expanding the applied records does not move focus
  into them, and the records needing attention stay above the disclosure.
- **Responsive/content:** A long record name or reason wraps in full rather than truncating, because
  a hidden clause can turn a partial result into an apparent success. Counts use tabular figures.
  Outcome is carried by an icon and a word as well as by colour, and the region stacks without
  overflow at a narrow width.
- **Required stories:** `Preview`, `PreviewBlocked`, `Applied`, `PartialFailure`, `NothingApplied`,
  `InProgress`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `itemised-preview`, `itemised-partial-failure`, `itemised-narrow`, and
  `itemised-keyboard`.
- **Used by:** [Task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist),
  [results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [practitioner offboarding](../../../capabilities/practitioner-management/spec.md#screen-contract-practitioner-profile-and-offboarding).
- **Excludes:** Performing the operation, deciding that a record is blocked or that a retry is safe,
  the wording of any reason, atomicity and idempotency, audit, and reporting a single-record outcome,
  which stays with `DS-PAT-014`.

