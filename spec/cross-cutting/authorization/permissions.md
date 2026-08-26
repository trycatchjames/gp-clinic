# Authorisation and permission catalogue

## Decision model

Every protected operation evaluates:

```text
authenticated user
AND active practice membership
AND granular permission
AND location scope (where relevant)
AND practitioner credential/scope (where relevant)
AND patient/entry restriction
AND work/care relationship or approved purpose
AND operation-specific preconditions
```

The server/domain boundary enforces the decision; hiding a control is not enforcement. Denial reveals no unnecessary patient existence/content and creates an audit event for sensitive attempts.

## Canonical permissions

### Patient and scheduling

`patient.search`, `patient.demographics.view`, `patient.demographics.edit`, `patient.representatives.manage`, `patient.alerts.operational.manage`, `patient.lifecycle.manage`, `patient.merge`, `appointment.view`, `appointment.create`, `appointment.edit`, `appointment.reschedule`, `appointment.cancel`, `appointment.arrive`, `appointment.dna`, `appointment.flow.manage`, `appointment.overbook`, `availability.view`, `availability.manage`.

### Clinical

`clinical.summary.view`, `clinical.entry.view`, `clinical.entry.create`, `clinical.entry.amend`, `clinical.entry.entered_in_error`, `encounter.start`, `encounter.complete`, `encounter.reopen`, `problem.manage`, `allergy.manage`, `medication.manage`, `observation.record`, `prescription.draft`, `prescription.issue`, `prescription.cancel`, `investigation.issue`, `result.match`, `result.assign`, `result.review`, `referral.issue`, `immunisation.record`, `care_plan.manage`, `sensitive_record.view`, `clinical.break_glass`.

### Work and communication

`document.ingest`, `document.match`, `document.classify`, `correspondence.view`, `correspondence.dispatch_record`, `task.manage_own`, `task.manage_team`, `recall.contact`, `recall.clinical_close`, `reminder.manage`, `notification.template.manage`.

### Financial and administration

`billing.view`, `billing.prepare`, `billing.override_fee`, `invoice.issue`, `invoice.adjust`, `payment.record`, `payment.reverse`, `claim.manage`, `fee_schedule.manage`, `practice.configure`, `location.manage`, `practitioner.manage`, `user.manage`, `role.manage`, `report.operational`, `report.clinical`, `report.financial`, `data.export`, `audit.view`, `audit.investigate`.

Permissions are stable identifiers; roles bundle them. New permissions default denied and require migration/review.

## Sensitive records and break glass

- A sensitive patient/entry can require `sensitive_record.view` plus a care/work relationship.
- If a safety-critical need exists, `clinical.break_glass` permits time-bounded access after the user records a reason and reauthenticates. The patient/practice privacy officer is notified according to policy and the event is prominently audited.
- Break glass cannot grant prescribing, merge, export, user management or audit-log administration.
- A “VIP” flag must not create an invisible record that increases wrong-patient risk; search may show a restricted stub with identifiers and access request path.

## Delegation and queues

Delegation names source, delegate/team, scope, start/end and responsibilities. It does not transfer authorship or prescribing identity. Team queues have a named accountable owner and monitored service level; “unassigned” is a visible exception queue, never a valid long-term owner.
