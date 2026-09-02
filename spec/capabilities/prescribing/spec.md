# Prescribing

## Dependencies

- Domains: [allergy](../../domain/allergy.md), [consultation](../../domain/consultation.md), [medication](../../domain/medication.md), [patient](../../domain/patient.md), [prescription](../../domain/prescription.md), [problem](../../domain/problem.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Legally and organisationally authorised prescribers create an internally valid, attributable prescription and issue it by a Version 1 manual/print method.

## Primary tasks

Create/edit draft; choose medicine/directions/quantity/repeats; review patient/prescriber/location/allergy context; issue and render; reprint; cancel or supersede/reissue; optionally update medication list explicitly.

## Inputs and outputs

Consumes Patient Summary, prescriber-at-location authority, local medicine display catalogue, jurisdiction configuration and Medication. Produces immutable Prescription/Document versions and optional explicit Medication command.

## Constraints

Issue is atomic; no signing as another practitioner; no unsupported interaction/dose/schedule claim; cancel cannot assert external revocation; external e-prescribing is future scope.

## Out of scope

Electronic prescribing exchanges, PBS authority, RTPM, dispensing, pharmacy selection and validated clinical decision support.

## Rules

Issue requires authenticated authorised prescriber-at-location, correct patient context, complete item content, current allergy assessment/reaction display and jurisdiction configuration. Unknown/unassessed allergies require acknowledgement according to policy. Unsupported clinical interaction/dosing checks are absent rather than simulated. Issued content is immutable; correction is cancel/supersede/reissue. Print/manual handoff and external receipt/dispense are distinct.

## Interactions

Prescribing starts in a verified patient and authorised prescriber context. The order checks active medicines, allergy/ADR records and locally available safety data, then presents warnings for human decision. Signing creates an immutable prescription/order snapshot and updates the medication history as specified. Version 1 supports print/manual issue only and records no electronic transmission or dispensing outcome.

## Permissions

`prescription.draft` permits draft preparation within clinical scope. `prescription.issue` requires the issuing user to be linked to the authorised prescriber and pass location/effective credential checks. Delegates may prepare but cannot issue as the prescriber. Cancel/reprint use explicit permission and audit. Administrators cannot grant themselves clinical authority merely through user management; organisational approval is separately governed.

## Screen contracts

### Screen contract: Prescription editor

#### Purpose and actors

Allows an authorised prescriber to draft, review and issue an internal/manual prescription in the correct patient/prescriber/location context.

#### Layout regions

1. Persistent patient banner and prominent allergy assessment/reactions.
2. Prescriber/location/jurisdiction and authority status.
3. Prescription items: medicine display/local code, strength/form, directions, quantity, repeats and optional indication.
4. Medication-list update choice.
5. Validation/warnings and rendered preview.
6. Draft/issue actions and save state.

#### Behaviour

Medicine selection never auto-generates a clinical dose. Free-text/uncoded selection is visibly distinct and governed by practice policy. Adding the same local medicine prompts comparison. Issue reviews patient, prescriber, location, active allergies and not-assessed status; exact locally supported match warning requires reasoned override. Issue fixes content/rendition and optionally performs the explicitly selected medication update atomically.

#### States/failure

Draft, validating, ready, issued read-only, cancelled/superseded and failed. If summary/allergy/authority is unavailable, issue is blocked though safe draft recovery continues. A failed issue remains draft and produces no issued document. Reprint/cancel are explicit audited actions with Version 1 external-limitation message.

#### Permissions/accessibility

Draft and issue permissions are separate. Only the authenticated authorised prescriber can issue as themselves. Warnings are read before issue in keyboard order and no shortcut bypasses confirmation.
