# Result lifecycle

```text
received_unmatched → matched_unassigned → assigned → under_review → reviewed_action_required → follow_up_in_progress → closed
assigned → reviewed_no_further_action → closed
any matched/reviewed state → corrected (new linked result returns to assigned review)
```

| Transition | Authority | Required facts |
|---|---|---|
| unmatched → matched | `result.match` | three-identifier comparison, match reason/confidence, actor |
| matched → assigned/reassigned | `result.assign` | accountable practitioner/team queue and coverage |
| assigned → reviewed_* | `result.review` clinician | disposition, comment/reason, review time; linked action if required |
| action required → follow-up | authorised staff | contact/recall/task activity; clinical responsibility remains visible |
| reviewed → closed | clinician or governed rule | required actions resolved, patient communication status recorded, reason |

Delete is not a lifecycle state. Entered-in-error/quarantine is a privileged provenance-preserving exception for non-result material or duplicate ingestion.
