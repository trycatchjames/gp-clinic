# Referrals

## Dependencies

- Domains: [consultation](../../domain/consultation/overview.md), [correspondence](../../domain/correspondence/overview.md), [document](../../domain/document/overview.md), [patient](../../domain/patient/overview.md), [referral](../../domain/referral/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians create a relevant, attributable referral and the practice tracks manual dispatch and response. Administrative staff may support recipient selection/dispatch.

## Primary tasks

Choose recipient snapshot; author reason/question/urgency; select relevant summary/results/attachments; review consent and identifiers; issue/render; record manual dispatch/failure/acceptance; supersede; track outcome/report.

## Inputs and outputs

Consumes patient/clinical summary, practitioner/location, local directory and Documents. Produces Referral, issued Document, Correspondence and possible task.

## Constraints

Minimum necessary relevant content; immutable recipient/content snapshot; issue not delivery; failed/declined referral leaves practice responsibility visible.

## Out of scope

Secure messaging, live directories, specialist booking and external response interfaces.

## Rules

- A referral records patient, author, intended recipient/service, clinical purpose, relevant content, creation date, validity details when applicable and status.
- Draft, final, manually issued, accepted/appointment known, completed, cancelled and entered-in-error are distinct assertions.
- Finalisation freezes a versioned clinical snapshot; later correction creates a superseding version.
- Version 1 never claims electronic delivery, receipt or appointment booking.
- Sensitive content follows minimum-necessary selection and restricted-access rules.

## Interactions

A clinician can create a referral from a consultation, problem or care plan and select relevant information deliberately. Finalisation produces correspondence/document provenance and may create a task or recall for expected follow-up. Manual issue and external response are recorded as user assertions. A received reply links back without closing clinical follow-up automatically.

## Permissions

`referral.issue` governs clinical authorship/issue. Administrative staff may select a directory recipient or record dispatch only through scoped correspondence permission; they cannot change reason, clinical question, urgency or included content. Sensitive-content view and export/disclosure authority are separately checked.

## Screen contracts

### Screen contract: Referral editor

#### Purpose and actors

Allows an authorised clinician to create a relevant referral and exact issued copy; staff may support recipient/dispatch within permission.

#### Regions/information

Patient banner; referrer/location; recipient search/snapshot; reason/clinical question/urgency; selected health summary components; selected results/documents; consent/authority; preview; draft/issue/manual dispatch status.

#### Behaviour

The editor proposes no blanket full-record inclusion. Each included item is visible and removable; allergy/current medicine/problem summaries show freshness/source. Template insertion is reviewed. Preview shows three patient identifiers, recipient/referrer and exact content. Issue fixes rendition. Recipient changes after issue require superseding version.

#### States/failure

Draft, issued, dispatch pending, manually dispatched, failed/unknown, accepted/declined/outcome received. Rendering failure leaves draft. Failed dispatch remains actionable and cannot be marked delivered automatically. Sensitive-content permission/consent failure blocks issue and names the category without leaking it to unauthorised staff.
