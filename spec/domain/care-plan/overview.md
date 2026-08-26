# Care plan

## Purpose

Care Plan coordinates longitudinal goals, actions, participants and review for chronic or complex care. It is a clinical plan, not proof of Medicare eligibility or claimability.

## Core attributes

Patient; plan type/local template version; responsible practitioner and contributors; problems/needs; patient priorities and agreed goals; planned actions/services; responsible participant for each action; target/review dates; consent/participation; status; review/outcome entries; linked referrals, tasks, observations and encounters.

## Rules and invariants

- Goals and actions are attributable and understandable to clinicians and, when shared, the patient.
- A plan may exist without an MBS billing item; billing decisions remain in Billing.
- Reviews append outcomes and revisions; they do not rewrite the plan that guided earlier care.
- Every active plan has a responsible practitioner and next-review disposition (date, event-triggered or explicitly none with reason).
- Participant details are snapshotted for issued/shared versions.
- Closing a plan requires outcome/reason and handles open linked tasks/referrals explicitly.
