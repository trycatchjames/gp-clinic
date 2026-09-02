# Documents

## Dependencies

- Domains: [correspondence](../../domain/correspondence.md), [document](../../domain/document.md), [patient](../../domain/patient.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Authorised staff store, classify, match and safely view files/renditions that belong to patient or practice workflows.

## Primary tasks

Upload/scan; malware/quality check; match patient; classify; assign review; view/download/print within permission; replace with linked version; quarantine/entered-in-error; locate unmatched work.

## Inputs and outputs

Consumes files, patient identifiers, user permission and source metadata. Produces immutable Document versions and links to Correspondence/Result/Referral/Encounter.

## Constraints

Hash/provenance/version, legibility confirmation, safe rendering, no delete-as-review, unmatched queue, minimum-access content. Filing does not equal clinical review.

## Out of scope

External scanners/mailboxes/secure messaging, OCR-based clinical decisions and general-purpose file storage.

## Rules

- Every document records patient, category, title, source/provenance, author/uploader, relevant dates, sensitivity and integrity metadata.
- Upload does not equal clinical review; review responsibility is explicit where needed.
- Final clinical documents are versioned and cannot be destructively replaced.
- An entered-in-error version remains discoverable to authorised users and states why it is excluded from ordinary use.
- Download, print and export are permission checked and audited.

## Interactions

Documents may support correspondence, referrals, results or consultations while retaining one canonical document identity. Manual intake enters an unmatched or patient-matched work queue. A document can create a review task but does not itself complete that task. Timeline display uses metadata and sensitivity rules; access to a parent patient record does not automatically grant every restricted document.

## Permissions

Ingest, view content, match, classify, move wrong-patient, download/print and clinical action are independent. A metadata processor need not see the body. Wrong-patient correction and quarantine/entered-in-error require elevated reasoned authority. Direct file access must enforce the same permissions as the UI.

## Screen contracts

### Screen contract: Document inbox

#### Purpose and actors

Lets authorised users safely process uploaded/scanned/generated documents and resolve unmatched or review-required items.

#### Regions/information

Queue filters (quarantine, unmatched, unclassified, review required, filed); list with source/date/type/patient match/owner/age; safe viewer; identity match/classification/linking actions; provenance/version/history.

#### Behaviour

Upload enters scanning/quarantine before display. Matching shows at least three source identifiers against candidate details and requires deliberate choice. Classification selects owning workflow (correspondence/result/other) and does not mark reviewed. Legibility must be confirmed or flagged. Moving from wrong patient requires elevated reason and audit.

#### States/failure

Scanning, quarantined, unmatched, matched, classified, review required/file ready/filed. Viewer failure blocks “legible/file” and retains queue item. Malware content is never rendered ordinarily. Delete is unavailable; entered-in-error/quarantine retains history.

#### Permissions/accessibility

Metadata, content, match and clinical-review permissions are separate. Viewer has accessible text alternative where available but OCR is not treated as authoritative content.
