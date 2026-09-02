# Clinical and administrative task

## Purpose

Task coordinates discrete staff work. It may support a result, recall, referral, document or practice process but does not replace the owning clinical obligation.

## Attributes

Title and non-sensitive summary; patient link if applicable; task category; clinical/administrative classification; priority; due date/time; assignee user/team and accountable owner; creator; source record; status; outcome; comments; recurrence definition where permitted; sensitivity and audit history.

## Rules and invariants

- Every open task has one accountable assignee or governed team queue.
- Completion requires an outcome; it cannot automatically close a linked recall/result/referral unless that owning workflow independently validates closure.
- Reassignment preserves history and notifies/places work in the new queue atomically.
- Clinical task detail is unavailable to users without clinical-task/record access; reception-safe contact instructions are separately represented.
- A due date is not silently changed by recurrence or reassignment.
- Overdue is a computed condition, not a terminal state.
- Practitioner/user deactivation is blocked until owned tasks are reassigned or accepted by a team queue.

## Task lifecycle

`open → in_progress → completed`; `open|in_progress → deferred → open`; `open|in_progress|deferred → cancelled`.

Completion and cancellation require outcome/reason. Reopening a completed task is privileged and retains the original completion. Recurrence creates a new linked task after completion according to the recurrence rule; it does not reset history on the same task.
