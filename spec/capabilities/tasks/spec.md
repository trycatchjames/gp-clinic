# Tasks

## Dependencies

- Domains: [patient](../../domain/patient.md), [practice](../../domain/practice.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

All staff coordinate assigned work through personal/team queues while clinical source obligations retain their own closure rules.

## Primary tasks

Create patient/practice task; assign/accept/reassign; set priority/due; start/defer/complete/cancel; comment; create recurrence; filter personal/team/overdue; follow source link.

## Inputs and outputs

Consumes users/teams, patient administrative or clinical context according to permission and source domain. Creates Task history and notifications.

## Constraints

Every open task accountable; protected clinical detail; completion outcome; recurrence creates new task; never closes recall/result/referral by inference; offboarding prevents orphaning.

## Out of scope

Generic project management, external to-do integration and automated clinical prioritisation.

## Rules

- A task has an owner or owned queue, due time, priority, subject/context, state and provenance link.
- Assignment, acceptance, reassignment, completion, cancellation and reopening are recorded with actor and time.
- Completing a task does not close a linked result, recall, referral or other clinical obligation.
- Overdue and unassigned tasks remain visible and follow escalation rules.
- Task text cannot be used to hide clinical facts that belong in the patient record.

## Interactions

Tasks may be created from patient, result, recall, referral, document or administrative context. The task links to its source without duplicating or changing source status. Offboarding transfers owned tasks explicitly. Patient-sensitive task visibility follows both task permission and source-record restriction; audit records assignment and completion transitions.

## Permissions

`task.manage_own` manages assigned work; `task.manage_team` assigns/reassigns/monitors a governed queue. Source-record permission controls title/detail and source opening. Neither permission grants recall closure or result review. Bulk reassignment and clinical-content export require separate authority.

## Screen contracts

### Screen contract: Task worklist

#### Purpose and actors

Shows each user/team what work they own, why it exists and what outcome is required.

#### Layout and required information

Queue tabs (mine, team, unassigned exception, completed); filters for due/priority/category/location/assignee; worklist; selected task detail/source link/history. Each row shows title safe for viewer, patient identity when permitted, source type, assignee/accountable team, due date/time, priority, status and overdue age.

#### Actions

Accept/start, assign/reassign, defer with reason/new date, complete with outcome, cancel with reason, add comment, open permitted source, create linked follow-up task/recurrence.

#### States/failure

Empty queue names scope; unassigned queue always shows governance owner. Partial patient/source failure is labelled and completion disabled if source context is required. Failed transition leaves task in prior queue and preserves outcome/comment draft. Bulk reassignment previews every affected owner and returns itemised outcome.

#### Permissions/accessibility

Own/team/admin permissions; clinical content hidden without access. Dismiss notification is not completion. Keyboard traversal and sortable headers preserve selection/focus on refresh.
