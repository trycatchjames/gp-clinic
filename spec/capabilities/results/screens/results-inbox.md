# Screen contract: Results inbox

## Purpose and actors

Provides clinicians and governed teams an accountable work queue of results needing matching, assignment, review or follow-up.

## Entry points and layout

Primary clinical navigation/dashboard, practitioner cover, patient unchecked-results link. Regions: queue selector (mine, covering, team, unmatched/unassigned, follow-up); filters/search; ordered result list; selected result viewer/action panel; queue age/count summary.

## Required list information

Patient identity or unmatched source identifiers; received/performed date; source/type; ordering/responsible practitioner; source attention flag; review/follow-up state; age/due indicator; corrected-version marker. Priority display differentiates source flag from local disposition.

## Primary actions

Match/reassign with permission; open viewer; start/record review; create linked action; record patient contact; close when valid; navigate next/previous without losing filters; bulk reassign only with preview and no bulk clinical disposition.

## States

Loading; empty for selected queue with definition; populated; dense/oldest-first; partial source failure/stale; full failure; no cover assignment. Empty unmatched is “none currently unmatched”, never “all results reviewed”.

## Permissions/failure/accessibility

Admin can see permitted routing metadata/execute delegated contact but not clinical content/disposition. Failed disposition leaves result in its prior queue. Keyboard list/view split has clear focus; opening is not review and does not remove/reorder until commit.
