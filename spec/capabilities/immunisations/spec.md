# Immunisations

## Dependencies

- Domains: [clinical record](../../domain/clinical-record/overview.md), [consultation](../../domain/consultation/overview.md), [immunisation](../../domain/immunisation/overview.md), [patient](../../domain/patient/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Authorised clinicians/nurses record vaccines administered or historical reports and make them available in the health record.

## Primary tasks

Review history/source; record consent/pre-assessment reference; capture vaccine/brand/batch/dose/time/site/route/administerer; record historical dose/provenance; correct entered-in-error; record AEFI link; create next-dose reminder.

## Inputs and outputs

Consumes patient/encounter, local vaccine catalogue and practitioner/location. Produces Immunisation, observation/document links and optional Reminder.

## Constraints

Complete local record independent of AIR; administered-here differs from history; no silent correction; adverse event does not assert causality; future AIR status labelled not connected.

## Out of scope

AIR integration, vaccine inventory/cold chain, schedule decision support and external AEFI reporting.

## Rules

- A vaccination record captures vaccine/antigen, brand where applicable, batch, dose, route, site, administration date/time, administering practitioner and source.
- Consent and relevant screening are recorded as performed assertions, never inferred from administration alone.
- AEFI details and actions are linked without changing the original administration record.
- Correction is additive and preserves the original value, actor, time and reason.
- AIR status in Version 1 is `not_submitted`; no upload or acknowledgement is simulated as real.

## Interactions

An immunisation may be recorded during a consultation and shown in the patient summary and timeline. Local due logic may create a preventive reminder with its rule/version provenance. Stock and AIR integrations are future adapters; Version 1 permits manual batch entry and clearly labelled export preparation only. An adverse event can create a task or clinical follow-up without mutating the vaccination fact.

## Permissions

Clinical viewing follows record permissions. `immunisation.record` requires practitioner/nurse scope configured by the practice; historical recording and administration may be separately restricted by policy. Entered-in-error uses clinical correction authority. Appointment/billing access does not grant vaccine clinical detail.

## Screen contracts

### Screen contract: Immunisation editor

#### Purpose and actors

Records an administered-here or historical vaccination with provenance and batch safety information.

#### Regions/information

Patient/allergy banner; source choice; vaccine/antigen/brand; batch/lot and dose number; administration/history date/time precision; route/site/dose; administering practitioner/location; consent/pre-assessment reference; funding/program label if recorded; AEFI/future reminder links; save/history.

#### Behaviour

Administered-here requires current identity, practitioner, batch, time and configured administration details. Historical mode removes “administerer = current user” assumptions and requires source/confidence. Duplicate date/vaccine prompts comparison but does not auto-delete. Next-dose reminder is a separate explicit action.

#### States/failure

Draft, recorded, amended/entered-in-error. Failed save preserves data and creates no “administered” record. AIR panel states “not connected in Version 1” and never shows submitted/accepted.

#### Permissions

Clinical/immunisation recording permission and scope; reception may view appointment fact, not clinical administration details by default.
