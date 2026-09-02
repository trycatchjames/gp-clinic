# Investigations

## Dependencies

- Domains: [consultation](../../domain/consultation/overview.md), [investigation](../../domain/investigation/overview.md), [patient](../../domain/patient/overview.md), [result](../../domain/result/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians request pathology/imaging and retain responsibility until expected results are accounted for. Administrative staff may record manual dispatch under policy.

## Primary tasks

Create request with indication/tests/recipient/priority; review patient/referrer identifiers; issue/render/print; record manual dispatch; track outstanding/partial/final results; cancel/supersede with limitation notice.

## Inputs and outputs

Consumes patient summary, practitioner/location, local test/directory concepts and encounter. Produces Investigation and issued Document; Result links on receipt.

## Constraints

At least three patient identifiers on issued request; immutable issue snapshot; responsibility and expected-result tracking; print is not delivery; no external lab/radiology protocol.

## Out of scope

Provider compendia, e-ordering, specimen collection workflow and electronic result interfaces.

## Rules

- A request records patient, requesting clinician, request time, test/service, clinical information, intended recipient and expected follow-up owner.
- Draft, ordered, performed/collected, partially resulted, resulted, cancelled and entered-in-error are distinct.
- Version 1 produces a printable/manual request artefact and never claims electronic transmission.
- Cancellation does not delete the request or any received result.
- Outstanding-request tracking never substitutes for review of a received result.

## Interactions

A clinician creates a request from a consultation or patient record. The printed/manual artefact uses the request snapshot current at finalisation. Manually entered or uploaded results link to the request when confidently matched, while unmatched items remain queued. A result can fulfil all or part of a request and independently starts the results-review lifecycle.

## Permissions

`investigation.issue` is clinical and fixes the ordering practitioner's identity. Draft assistance may be allowed under clinical-entry scope but another user cannot issue as the practitioner. Administrative staff may record manual dispatch or manage routing through correspondence permissions without changing indication/tests/priority.

## Screen contracts

### Screen contract: Investigation request editor

#### Purpose and actors

Lets an authorised clinician create and issue a pathology or imaging request with enough identity, clinical question and responsibility context.

#### Regions/information

Patient banner; ordering practitioner/location/contact; request kind; requested tests/studies; clinical indication/question; priority; local recipient snapshot; copy-to; relevant attachments/instructions; responsible practitioner/coverage; expected result date; preview and draft/issue state.

#### Behaviour

Selecting favourites/templates adds editable items and never inserts unreviewed clinical indication. Preview shows at least three patient identifiers and exact recipient/referrer snapshot. Issue is atomic and creates immutable rendition. “Print/record manual dispatch” is a separate fact. Cancel/supersede warns that external receipt/cancellation is unknown.

#### States/failure

Draft, issued, awaiting/partial/resulted/closed view. Missing identifiers/authority/request/indication required by policy block issue. Rendering/issue failure preserves draft and creates no tracking obligation as issued. Partial result receipt is visible from the request history.
