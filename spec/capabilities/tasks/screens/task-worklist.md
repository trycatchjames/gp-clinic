# Screen contract: Task worklist

## Purpose and actors

Shows each user/team what work they own, why it exists and what outcome is required.

## Layout and required information

Queue tabs (mine, team, unassigned exception, completed); filters for due/priority/category/location/assignee; worklist; selected task detail/source link/history. Each row shows title safe for viewer, patient identity when permitted, source type, assignee/accountable team, due date/time, priority, status and overdue age.

## Actions

Accept/start, assign/reassign, defer with reason/new date, complete with outcome, cancel with reason, add comment, open permitted source, create linked follow-up task/recurrence.

## States/failure

Empty queue names scope; unassigned queue always shows governance owner. Partial patient/source failure is labelled and completion disabled if source context is required. Failed transition leaves task in prior queue and preserves outcome/comment draft. Bulk reassignment previews every affected owner and returns itemised outcome.

## Permissions/accessibility

Own/team/admin permissions; clinical content hidden without access. Dismiss notification is not completion. Keyboard traversal and sortable headers preserve selection/focus on refresh.
