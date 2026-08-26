# Recall and reminder states

## Recall

`open → contact_in_progress → appointment_arranged → clinically_resolved`  
Alternatives: `open/contact/appointment → unable_to_contact` (still open obligation); any open state → `ceased_by_clinician`.

`unable_to_contact` is a work/escalation state, not closure. A cancellation or DNA returns `appointment_arranged` to `contact_in_progress` and records escalation. Only `clinically_resolved` and `ceased_by_clinician` are closed states.

## Preventive reminder

`due → offered/sent → appointment_arranged → completed`; alternatives `declined`, `opted_out`, `expired` according to practice policy. Non-response may remain due/expired without pursuit. Each transition preserves communication evidence.
