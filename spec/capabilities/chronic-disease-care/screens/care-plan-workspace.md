# Screen contract: Care-plan workspace

## Purpose and actors

Lets the care team create, agree, action and review a patient-centred longitudinal plan without turning billing rules into clinical content.

## Layout/information

Patient summary; plan owner/status/version; patient priorities and agreed goals; linked problems/needs; actions/services with responsible participant and target; participants/recipient snapshots; consent/participation; linked referrals/tasks/observations; review date/disposition and outcome history.

## Actions

Draft/activate; add/reorder goals/actions; assign participant; create linked referral/task; record progress/review; revise/supersede; complete/cease with outcome and open-work review; render a shareable plan version.

## States/failure

Draft, active, review due, under review, superseded/completed/ceased. Failed activation/review preserves draft and leaves current plan unchanged. Billing information, if shown, is a separate permitted panel and never marks plan completion.

## Permissions

Clinical view/manage and participant-contribution scopes. Reception may schedule linked appointments/tasks without reading goals. External sharing is manual Version 1 correspondence with explicit content/consent.
