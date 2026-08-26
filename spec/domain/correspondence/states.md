# Correspondence lifecycle

Inbound: `received_unmatched → matched → assigned → action_required|no_action_required → actioned → filed`.

Outbound: `draft → approved/issued → dispatch_pending → dispatched → delivered|failed|unknown`.

Delivery state is independent of clinical record state. Failed/unknown clinical dispatch remains visible to its owner and may create a task. A received correction or replacement links versions and reopens review where content changed.
