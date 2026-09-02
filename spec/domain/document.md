# Document

## Purpose

Document stores a file or rendered artefact plus provenance, integrity and classification. It does not by itself mean the content has been clinically reviewed.

## Core attributes

Stable identifier, patient/practice context, filename/display title, media type, size, content hash, source, received/created times, author/sender, category, sensitivity, legibility/quality status, related domain records, versions, processing status and retention/legal-hold metadata.

## Rules and invariants

1. Content bytes are immutable per version and verified by hash; replacement creates a new linked version.
2. A document can be unmatched, matched or quarantined; unmatched clinical material remains on a monitored queue.
3. Patient matching uses approved identifiers and records the evidence/actor.
4. Scans/images must be viewable and legibility confirmed or explicitly flagged before filing. [RACGP-SGP5, C7.1]
5. Classification, matching and clinical review are separate operations.
6. Malware/unsafe content is quarantined without exposing it to ordinary viewers; metadata remains.
7. A generated referral, prescription or letter retains its exact issued rendition even if its template changes.
8. Removal from ordinary view requires entered-in-error/quarantine authority and does not erase content or audit while retention applies.

## Document lifecycle

`received → scanning/quarantine → unmatched → matched → classified → review_required|file_ready → filed`.

Generated documents use `draft → rendered → issued → superseded`. Failure at any processing stage leaves a visible retry/recovery state. `filed` means organised in the record, not clinically actioned; the linked Correspondence/Result controls that obligation.
