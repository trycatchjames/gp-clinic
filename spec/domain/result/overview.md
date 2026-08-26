# Result

## Purpose

Result stores investigation findings and drives clinical review, communication and follow-up. It may be received manually, generated as a fixture or entered from an internal procedure in Version 1.

## Core attributes

Source/provenance, received/document/performed times, patient match and confidence, related investigation, ordering/responsible practitioner, report text/document/structured values, source priority/abnormal flags, correction lineage, review status, clinical disposition, patient communication and linked recall/task/referral.

## Responsibility model

Receipt, matching, assignment, clinical review, acknowledgement, patient notification and follow-up completion are distinct facts. Source flags are displayed but clinical significance/disposition is decided by an authorised clinician. A normal result may require action given the indication. [RACGP-SGP5, GP2.2]

## Invariants

1. Every received result is in either unmatched or matched responsibility; none can be invisible because matching failed.
2. Opening or acknowledging a result does not review it.
3. Filing/archiving requires an explicit clinician disposition; disposition does not imply patient notification or follow-up completion.
4. A source-corrected result preserves and links the prior version and triggers re-review if the clinical content changed.
5. Patient reassignment requires high-risk confirmation, reason and audit; the old association remains traceable.
6. An abnormal/critical source flag cannot be removed by local review; a clinician may record interpretation separately.
7. If review creates a recall/task/referral, creation and result disposition commit atomically or the result remains unreviewed/action-required.
8. A responsible practitioner cannot be deactivated while results remain assigned without governed reassignment.
9. High-risk results require an after-hours/absence coverage route defined by practice policy. [RACGP-HIGHRISK]
10. Administrative users may execute delegated contact but cannot set clinical disposition.
