# Chronic disease and care plans

## Dependencies

- Domains: [care plan](../../domain/care-plan.md), [clinical record](../../domain/clinical-record.md), [consultation](../../domain/consultation.md), [patient](../../domain/patient.md), [recall](../../domain/recall.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

GPs, nurses and relevant allied health practitioners coordinate longitudinal goals, actions, participants and review for chronic/complex care.

## Primary tasks

Create patient-centred draft; link problems/needs; record priorities/goals/actions/responsibilities; gain participation/consent; activate; create referrals/tasks/observations; review outcomes; revise/supersede; complete/cease.

## Inputs and outputs

Consumes patient summary, problems, observations, participants and practitioner scope. Produces CarePlan versions, tasks, referrals and review entries; billing remains separate.

## Constraints

Active plan has responsible practitioner/review disposition; historical plan preserved; plan existence does not imply Medicare eligibility/item compliance; templates versioned and reviewed.

## Out of scope

MBS eligibility automation, MyMedicare, multidisciplinary external exchange and guideline decision support.

## Rules

- A care plan has an accountable owner, patient, goals, actions, participants, review date and versioned status.
- Goals and actions are distinct; completing an action does not automatically achieve a goal.
- Plan review records progress, patient participation and agreed changes without overwriting prior versions.
- Overdue review is visible but does not silently create a Medicare claim or programme submission.
- Templates assist completeness but cannot invent clinical facts or consent.

## Interactions

A clinician may create a plan from a consultation and link problems, medicines, observations, referrals, tasks and recalls. Team members see only information permitted by role and patient context. Review may close or replace actions and set a new review obligation. Billing can reference a completed care activity, but item selection and eligibility remain explicit human decisions.

## Permissions

`clinical.summary.view` reads current plans; `care_plan.manage` authors/activates/reviews within clinical scope. Contributors can record only their attributed updates when delegated. Reception may manage linked appointments/tasks through those capabilities without plan-goal access. Rendering/disclosure checks clinical content and recipient authority.

## Screen contracts

### Screen contract: Care-plan workspace

#### Purpose and actors

Lets the care team create, agree, action and review a patient-centred longitudinal plan without turning billing rules into clinical content.

#### Layout/information

Patient summary; plan owner/status/version; patient priorities and agreed goals; linked problems/needs; actions/services with responsible participant and target; participants/recipient snapshots; consent/participation; linked referrals/tasks/observations; review date/disposition and outcome history.

#### Actions

Draft/activate; add/reorder goals/actions; assign participant; create linked referral/task; record progress/review; revise/supersede; complete/cease with outcome and open-work review; render a shareable plan version.

#### States/failure

Draft, active, review due, under review, superseded/completed/ceased. Failed activation/review preserves draft and leaves current plan unchanged. Billing information, if shown, is a separate permitted panel and never marks plan completion.

#### Permissions

Clinical view/manage and participant-contribution scopes. Reception may schedule linked appointments/tasks without reading goals. External sharing is manual Version 1 correspondence with explicit content/consent.
