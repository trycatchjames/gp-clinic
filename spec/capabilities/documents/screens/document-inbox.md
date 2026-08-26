# Screen contract: Document inbox

## Purpose and actors

Lets authorised users safely process uploaded/scanned/generated documents and resolve unmatched or review-required items.

## Regions/information

Queue filters (quarantine, unmatched, unclassified, review required, filed); list with source/date/type/patient match/owner/age; safe viewer; identity match/classification/linking actions; provenance/version/history.

## Behaviour

Upload enters scanning/quarantine before display. Matching shows at least three source identifiers against candidate details and requires deliberate choice. Classification selects owning workflow (correspondence/result/other) and does not mark reviewed. Legibility must be confirmed or flagged. Moving from wrong patient requires elevated reason and audit.

## States/failure

Scanning, quarantined, unmatched, matched, classified, review required/file ready/filed. Viewer failure blocks “legible/file” and retains queue item. Malware content is never rendered ordinarily. Delete is unavailable; entered-in-error/quarantine retains history.

## Permissions/accessibility

Metadata, content, match and clinical-review permissions are separate. Viewer has accessible text alternative where available but OCR is not treated as authoritative content.
