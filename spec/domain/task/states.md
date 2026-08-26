# Task lifecycle

`open → in_progress → completed`; `open|in_progress → deferred → open`; `open|in_progress|deferred → cancelled`.

Completion and cancellation require outcome/reason. Reopening a completed task is privileged and retains the original completion. Recurrence creates a new linked task after completion according to the recurrence rule; it does not reset history on the same task.
