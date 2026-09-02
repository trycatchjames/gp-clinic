# Results management

## Dependencies

- Domains: [investigation](../../domain/investigation.md), [patient](../../domain/patient.md), [recall](../../domain/recall.md), [result](../../domain/result.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

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

## Rules

- Every received item remains visible in unmatched/matched responsibility.
- Match requires approved identifier comparison; reassignment preserves history.
- Opening/acknowledging is not review.
- Only a clinician records disposition/clinical closure; source abnormality remains.
- Required linked actions are created atomically with disposition.
- Patient contact is separately recorded; attempted is not informed.
- Corrected content reopens review and shows prior action.
- Absence/offboarding reassigns open work before access removal.
- High-risk results always have a configured in-hours/out-of-hours responsibility path.

## Interactions

Manual document/result ingestion enters Document/Correspondence/Result queues with shared provenance but separate states. Matching links patient/investigation. Review may atomically create Recall, Task, repeat Investigation or Referral. A contact attempt uses the linked Recall/Result instruction and safe contacts. A result-related appointment is evidence of follow-up but clinician decides closure. A correction emits a new Result version and new review obligation, retaining previous contact history.

## Permissions

Match, assign, review and contact execution are separate. Administrative staff see identifiers/routing and the minimum safe contact instruction, not report body or clinical reason by default. Covering clinicians need explicit delegation/team scope. Bulk action may reassign but never apply a clinical disposition. Sensitive results require additional access or audited break glass.

## Screen contracts

### Screen contract: Result viewer and action

#### Purpose

Lets an authorised clinician understand a result in request/patient context and record an explicit disposition and follow-up.

#### Layout and required information

Persistent patient/allergy banner; result source, received/performed/document times, source priority/abnormal/critical label and correction chain; ordering/responsible practitioner; originating request/indication; full report/document and structured values with units/reference source; relevant prior comparable results; review and communication history; action composer.

#### Clinical dispositions

Practice-configurable display labels map to stable outcomes such as no further action, inform patient, routine/urgent recall, immediate action, repeat investigation, refer or other-with-reason. The system does not suggest a disposition. No-further-action may require reason according to policy, especially with source attention flag.

#### Interaction

Selecting an action previews linked recall/task/referral/contact work and accountable owner. Commit is atomic. Opening/scrolling/acknowledging does not review. Patient reassignment shows both identities and requires match evidence. Corrected result returns to unreviewed even if prior version closed.

#### Failure/safety

Missing patient summary/request is labelled, not assumed absent. Failed action keeps result assigned/unreviewed and preserves comment draft. Critical/high-risk source flag is always visible and after-hours/cover path is shown. Reception-safe contact view hides report/reason.

### Screen contract: Results inbox

#### Purpose and actors

Provides clinicians and governed teams an accountable work queue of results needing matching, assignment, review or follow-up.

#### Entry points and layout

Primary clinical navigation/dashboard, practitioner cover, patient unchecked-results link. Regions: queue selector (mine, covering, team, unmatched/unassigned, follow-up); filters/search; ordered result list; selected result viewer/action panel; queue age/count summary.

#### Required list information

Patient identity or unmatched source identifiers; received/performed date; source/type; ordering/responsible practitioner; source attention flag; review/follow-up state; age/due indicator; corrected-version marker. Priority display differentiates source flag from local disposition.

#### Primary actions

Match/reassign with permission; open viewer; start/record review; create linked action; record patient contact; close when valid; navigate next/previous without losing filters; bulk reassign only with preview and no bulk clinical disposition.

#### States

Loading; empty for selected queue with definition; populated; dense/oldest-first; partial source failure/stale; full failure; no cover assignment. Empty unmatched is “none currently unmatched”, never “all results reviewed”.

#### Permissions/failure/accessibility

Admin can see permitted routing metadata/execute delegated contact but not clinical content/disposition. Failed disposition leaves result in its prior queue. Keyboard list/view split has clear focus; opening is not review and does not remove/reorder until commit.
