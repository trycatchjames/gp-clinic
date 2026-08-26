# Canonical enums

Enums are closed for commands and extensible/read-tolerant only where the contract explicitly says. Display labels may be configured; stored canonical values do not change.

## Appointment

`scheduled`, `arrived`, `waiting`, `in_consultation`, `at_billing`, `completed`, `cancelled`, `did_not_attend`, `entered_in_error`.

Reschedule is a transition/history event, not the current state.

## Encounter

`draft`, `in_progress`, `completed`, `abandoned`, `reopened`. Amendments are linked entries, not a replacement state.

## Clinical entry status

`draft`, `active`, `completed`, `amended`, `inactive`, `resolved`, `entered_in_error`, `superseded`—only the subset defined by the owning domain is valid.

## Result

Match: `unmatched`, `matched_unassigned`, `assigned`. Review: `unreviewed`, `under_review`, `reviewed_no_further_action`, `reviewed_action_required`, `follow_up_in_progress`, `closed`. Source attention: `not_supplied`, `normal`, `abnormal`, `critical` (provenance-bearing, not local interpretation).

## Recall/reminder/task

Recall: `open`, `contact_in_progress`, `appointment_arranged`, `unable_to_contact`, `clinically_resolved`, `ceased_by_clinician`.  
Reminder: `due`, `offered`, `sent`, `appointment_arranged`, `completed`, `declined`, `opted_out`, `expired`.  
Task: `open`, `in_progress`, `deferred`, `completed`, `cancelled`.

## Financial

Invoice: `draft`, `issued`, `partially_paid`, `paid`, `overdue`, `voided`.  
Claim: `draft`, `ready`, `manually_submitted`, `accepted`, `rejected`, `corrected`, `paid`, `cancelled`, `withdrawn_recorded`.

## Common data states

Assessment: `not_assessed`, `asked_none_known`, `known_present`.  
Delivery: `not_attempted`, `prepared`, `attempted`, `delivered_recorded`, `failed`, `unknown`.  
Priority: `routine`, `urgent`, `critical` only when assigned by authorised user/policy; no automatic clinical inference.
