# Screen contract: Operations and safety dashboard

## Purpose and actors

Gives authorised managers/clinical leads actionable oversight of service operations and unresolved risk, with drill-through to source queues.

## Required information

As-of time/freshness; appointment capacity/arrival/wait/DNA trends; unmatched documents/results count and oldest age; unreviewed/high-risk/follow-up results; overdue recalls/tasks by accountable owner; practitioner absence/offboarding gaps; unbilled appointments, debtors and claim exceptions; security/audit exceptions appropriate to role.

## Semantics

Counts define numerator, denominator, timeframe, location and excluded states. Clinical and financial panels require respective permissions and can be completely absent without implying zero. Small-cell/sensitive drill-down protections apply. Trend charts offer data tables.

## Actions/failure

Filter date/location/team; open source worklist with filters; export only with permission/reason. Stale/partial projections are labelled and not rendered as zero. Dashboard never mutates source state and never auto-assigns clinical priority.
