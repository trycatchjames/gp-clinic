# Clinical correspondence

## Dependencies

- Domains: [correspondence](../../domain/correspondence/overview.md), [document](../../domain/document/overview.md), [patient](../../domain/patient/overview.md), [practitioner](../../domain/practitioner/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians and authorised staff create, receive, route and action care-related communication while retaining it in the patient record.

## Primary tasks

Author letter from reviewed template; select recipients/content; issue and record manual dispatch; ingest inbound communication; match patient; assign clinical owner; record action/no-action; link to referral/result/encounter.

## Inputs and outputs

Consumes Patient, Practitioner, Documents, local directory and templates. Produces Correspondence, immutable issued documents and tasks/clinical actions.

## Constraints

Clinical communication is part of record; template fields require review; unmatched and failed-dispatch queues; admin metadata access is separated from clinical content.

## Out of scope

Email/secure messaging integration, eFax and automated inbound classification decisions.

## Rules

- Incoming and outgoing correspondence retain direction, author/sender, recipient, subject, service date, provenance and patient match.
- Draft, final, sent/received and entered-in-error are distinct states; Version 1 never claims external delivery.
- Final content is immutable; correction creates a superseding version with reason.
- Sensitive or misdirected correspondence follows restricted-access and incident workflows.
- Unmatched incoming correspondence remains in an owned queue until resolved.

## Interactions

Correspondence can be drafted from a consultation, referral or patient record using a versioned template. Finalisation creates a document snapshot and timeline entry. Version 1 records manual print, handover or other delivery outcome without performing it. Incoming correspondence uses the same identity-matching safeguards as results and may create a task, recall or clinician review obligation.

## Permissions

`correspondence.view` is scoped to clinical/administrative classification. `document.match/classify` may route metadata; clinical action requires clinical-entry/result authority; outbound issue requires the relevant clinical author permission; `correspondence.dispatch_record` records manual attempts only. Sensitive content and patient disclosure/export remain separate.

## Screen contracts

### Screen contract: Correspondence workspace

#### Purpose

Manages inbound/outbound clinical communication from unmatched receipt through clinical action or issued dispatch.

#### Layout

Queue/filter; correspondence list; safe preview/document viewer; patient/recipient matching panel; owner/action/status history. In patient context the same content appears in timeline with source state.

#### Required information/actions

Direction, sender/recipient snapshot, received/authored/effective times, patient/match state, owner, category/sensitivity, linked source and processing/delivery state. Actions: match/reassign/classify, record clinical action/no action, link task/result/referral, author/preview/issue outbound, record manual dispatch/failure, supersede.

#### States/failure/privacy

Unmatched/unassigned remain prominent. Filing does not equal review. Unsafe document is quarantined. Partial viewer failure leaves metadata and prevents clinical action that requires content. Admin routing view masks clinical body. Delivery status is user-recorded in Version 1.
