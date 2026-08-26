# Results management

## Purpose and actors

Clinicians safely review findings; reception/nurses/managers carry out authorised follow-up and monitor queues without blurring clinical responsibility.

## Primary tasks

Ingest/manual create; resolve unmatched patient/request/provider; assign/reassign; compare source/previous context; record clinical disposition; record patient informed; create recall/task/referral; manage corrected results; close only when follow-up obligations permit.

## Inputs and outputs

Consumes Result/Investigation/Patient Summary, coverage and permissions. Changes result states and creates linked obligations atomically.

## Constraints

Opened is not reviewed; source flag is not clinician interpretation; unmatched/absent-owner queues visible; high-risk after-hours cover; corrected content reopens review; admin cannot make clinical disposition.

## Out of scope

Pathology/radiology connectivity, automated interpretation, reference-range knowledge and patient portal delivery.
