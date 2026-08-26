# Screen contract: Result viewer and action

## Purpose

Lets an authorised clinician understand a result in request/patient context and record an explicit disposition and follow-up.

## Layout and required information

Persistent patient/allergy banner; result source, received/performed/document times, source priority/abnormal/critical label and correction chain; ordering/responsible practitioner; originating request/indication; full report/document and structured values with units/reference source; relevant prior comparable results; review and communication history; action composer.

## Clinical dispositions

Practice-configurable display labels map to stable outcomes such as no further action, inform patient, routine/urgent recall, immediate action, repeat investigation, refer or other-with-reason. The system does not suggest a disposition. No-further-action may require reason according to policy, especially with source attention flag.

## Interaction

Selecting an action previews linked recall/task/referral/contact work and accountable owner. Commit is atomic. Opening/scrolling/acknowledging does not review. Patient reassignment shows both identities and requires match evidence. Corrected result returns to unreviewed even if prior version closed.

## Failure/safety

Missing patient summary/request is labelled, not assumed absent. Failed action keeps result assigned/unreviewed and preserves comment draft. Critical/high-risk source flag is always visible and after-hours/cover path is shown. Reception-safe contact view hides report/reason.
