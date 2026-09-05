# States and interaction

## State model

Every interactive foundation MUST define the relevant states below. Components expose mechanics;
capabilities supply domain meaning and decide which state applies.

| State | Meaning | Required presentation |
|---|---|---|
| normal | available without current interaction | ordinary hierarchy and complete accessible name |
| hover | pointer is over an available target | supplemental affordance only; no hidden required action or meaning |
| focus | keyboard/programmatic focus is on the target | visible, unobscured focus without implying selection |
| active | pointer/keyboard activation is in progress | momentary feedback without implying committed success |
| disabled | the control cannot currently be operated | unavailable semantics plus a nearby reason when the cause matters |
| selected | the item is deliberately chosen | semantic selected state plus a non-colour visual cue |
| invalid | supplied input needs correction | identified field, associated message, preserved value, and no save implication |
| loading | requested content is not yet known | labelled/busy state; dependent actions unavailable; stable geometry where useful |
| empty | the request succeeded and the current scope contains no records | scope-specific message and valid next action, if one exists |
| unavailable | required information could not be established | unknown information named; affected actions disabled |
| offline | current connectivity is unavailable | cached freshness labelled; unsafe writes stopped; recoverable drafts remain uncommitted |
| restricted | the user is known not to have permission or context | no protected-content leak; escalation/request path only when configured |
| partial | one region/source failed while verified content remains usable | failed region and freshness named; only dependent actions disabled |
| stale | shown data is older than the authoritative state | as-of/freshness visible; unsafe mutation requires refresh or revalidation |
| failure | an attempted operation or load failed | no success implication; recoverable work preserved; safe retry/escalation offered |
| conflict | another version or rule now prevents the proposed change | latest state and reason shown; local work available for compare/reapply |

These states MUST NOT share copy or styling that makes them sound equivalent. In particular:

- failure MUST NOT render as empty;
- unavailable or restricted MUST NOT render as none-known, zero, or absent;
- focus MUST NOT render as selection;
- a dismissed notification MUST NOT render as completed work; and
- local, pending, queued, or recovered work MUST NOT render as durably saved or externally delivered.

## Save and recovery

A save state is capability-supplied but uses consistent presentation:

| Save state | User contract |
|---|---|
| unchanged | no uncommitted edits exist |
| dirty | local edits differ from the last durable version |
| saving | an attempt is active; success is not yet claimed |
| saved | durable commit and required audit succeeded |
| failed | the committed record is unchanged; local input remains recoverable |
| conflict | a newer authoritative version exists; neither version is silently discarded |
| recovered | a local draft is available with patient/context, author, and timestamp before restore |

Dynamic save and validation messages MUST be programmatically announced without stealing focus.
Leaving a dirty or failed consequential editor follows its capability's recovery contract. A shared
component MUST NOT decide whether discard, autosave, or navigation is safe.

## Keyboard and focus

- Keyboard order follows visible task order.
- Focus is visible, unobscured, and restored to the invoking control when a transient surface closes.
- Native or established Radix interaction models govern composite widgets.
- Arrow keys MAY move focus within a composite widget; only explicit activation selects or mutates.
- Escape closes a transient surface when doing so does not discard or complete work. When Escape
  would lose work, the capability's dirty-state decision is invoked.
- Drag, hover, fine pointer movement, truncation, and icon recognition MUST have an equivalent path.
- Opening, focusing, scrolling, or acknowledging content MUST NOT imply clinical review, selection,
  save, or completion.
- Focus changes caused by validation or conflict move to a useful summary/explanation, not an
  obscured background control.
- Keyboard shortcuts MAY accelerate frequent clinical workflows, but they MUST be discoverable,
  must not conflict with platform or assistive-technology shortcuts, and MUST NOT be the only path.

Pointer targets, accessible names, descriptions, headings, error associations, and focus behaviour
MUST meet the cross-cutting accessibility requirements. Comfortable and compact presentation MUST
not shrink targets below that requirement.

## Actions and consequences

Most regions expose one primary action. Secondary and tertiary actions remain discoverable without
competing equally. A hidden overflow action MUST NOT be the only route to a frequent or safety-
critical task.

Progressive disclosure is preferred for infrequent secondary actions through an overflow menu,
dialog, sheet, command surface, or contextual menu. Several actions on one screen MUST NOT all use
the filled primary treatment.

Destructive and corrective actions name the target and consequence. Before final confirmation the
interface shows relevant context, retained history, downstream effects, and safer alternative as
required by the cross-cutting destructive-action contract. The final consequential action remains
visually distinct from ordinary primary actions.

Disabled actions SHOULD explain the failed precondition at the point of need when the user could
reasonably act to resolve it. Invalid or unavailable transitions are omitted only when their absence
cannot make the current state or required next step ambiguous.

## Feedback and announcements

- Validation feedback is associated with the affected field and summarised when multiple fields or
  regions need correction.
- Success feedback names the completed object/action only after durable success.
- Failure feedback states what failed, what remains unchanged, and the safe recovery action.
- Partial results name failed scope and do not imply complete success.
- Long-running progress has an accessible name and textual state; animation is supplemental.
- Routine status updates use polite announcements. Urgent destructive or failed-operation feedback
  uses assertive announcement only when interruption is warranted.
- Repeated background refreshes MUST NOT repeatedly announce unchanged content or move focus.

## Search, lists, and selection

Search and list mechanics follow the user's decision order. The name or task object leads each row;
distinguishing facts follow; internal or external references remain secondary. Focus movement does
not select. Selection uses semantic state and a non-colour cue, and the query remains easy to reach
and revise.

Loading preserves the active query and scope. An empty result names the searched scope. Partial or
full search failure cannot be described as no matches. Background refresh preserves query, focus,
and deliberate selection unless the capability requires an explicit invalidation decision.

Persistent left navigation uses simple monochrome icons and short labels with approximately
36-40px rows. The active item uses a quiet tint, teal text and icon, and a non-colour cue such as a
2px leading rule or equivalent selected structure. Focus, hover, and selected states remain
distinct.
