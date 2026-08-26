# Patient record

## Purpose and actors

The patient record gives clinicians a trustworthy health summary and longitudinal history while giving administrative users only the operational information needed for their work.

## Primary tasks

Confirm patient context; scan immediate safety summary; navigate timeline/categories; view provenance/amendments; access results, documents, referrals, recalls and tasks; start consultation; update domain facts through their owning capabilities; request export/correction through governed workflows.

## Inputs and outputs

Composes PatientAdministrativeSummary/PatientSummary and authorised domain records. It outputs commands to domains; it does not edit a monolithic record.

## Constraints

Banner and allergies remain visible during clinical actions. Unknown/unavailable is not rendered as empty/none. Timeline distinguishes effective and recorded time. Sensitive entries follow granular policy. Every view/action retains patient context and save state.

## Out of scope

Patient portal, My Health Record, cross-practice shared record and automated clinical recommendations.
