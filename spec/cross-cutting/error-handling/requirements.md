# Error-handling requirements

## Error classes and user contract

| Class | Meaning | Required response |
|---|---|---|
| validation | supplied value missing/malformed | preserve input, identify fields and correction; no save |
| business-rule conflict | valid input violates current state/invariant | explain rule/current state and safe next action; no partial change |
| concurrency conflict | another actor/version changed target | show newer state and preserve user's work for comparison/reapply |
| permission | user lacks authority/context | deny without leaking hidden content; offer request/escalation path if configured |
| temporary infrastructure | dependency/storage/network temporarily failed | label unsaved, preserve recoverable input, allow safe retry with idempotency |
| unexpected system | unanticipated failure | no success implication; correlation reference; safe recovery/escalation |

## Clinically/operationally important mutations

- A success message appears only after durable commit of domain change and required audit.
- Retrying the same operation cannot duplicate an appointment, issued prescription, result action, recall contact, invoice, payment or claim.
- Multi-record changes are atomic when partial success would violate an invariant. Otherwise the response lists each target outcome.
- If the user leaves after failure, recoverable drafts remain clearly uncommitted and bound to patient/author.
- Error telemetry excludes unnecessary health information.

## Partial page failure

The screen identifies which region failed, preserves already verified content, marks stale data and disables only actions whose preconditions cannot be known. A clinical summary failure cannot be disguised by rendering an empty allergy/medicine/problem section; it must show unavailable.

## Supportability

Errors include a non-secret correlation ID and server time. Staff can report it without copying patient clinical text. Support access follows authorisation and audit rules.
