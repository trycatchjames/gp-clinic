---
area: ux
blocked-by: []
needs-review: [privacy]
---

# Selecting many rows

## Decide

- Whether lists offer bulk actions, and which lists will need them first.
- Whether the header checkbox selects the visible page, every matching row, or offers both.
- What the selection bar shows: the count, Clear selection and the actions.
- How a bulk outcome is reported, including rows skipped and why.
- Whether selection survives a page change, and when it clears.

## Why we're asking

Recalls, reminders and billing will all need to act on many patients at once, and each would
otherwise build its own selection. A bulk action on patients carries privacy risk: sending a
reminder to the wrong group, or exporting more than intended, is hard to undo. SmoothPay's list
pattern already answers most of this and can be adapted.

## Examples

- A practice manager selects 40 patients due for a recall and sends a reminder. Five have no
  mobile number. What does the outcome say?
- A receptionist selects every patient matching "no-show in the last month". Is that a fixed
  list, or whatever matches when the action runs?
- A GP selects three results to mark as reviewed. Is bulk review even allowed for results?

## Starts from

- [List views](../experience/list-views.md).
- SmoothPay's selection and bulk action rules: the page checkbox with an all-matching menu, and
  a selection bar.

## Blocks

Bulk reminders, recalls and billing actions.
