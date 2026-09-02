# Referral

## Purpose

Referral records a request for another practitioner/service to assess or manage the patient and the information transferred to support continuity. Version 1 authors, prints/exports and tracks manually; it does not deliver through secure messaging.

## Core attributes

Patient; referrer and location; recipient directory snapshot; specialty/service; reason/clinical question; urgency as selected by clinician; relevant history, problems, medicines, allergies, results and attachments chosen for inclusion; issue date; validity/review dates where relevant; consent/authority; dispatch attempt and response/outcome tracking; version/status.

## Rules and invariants

- The clinician chooses relevant content; templates cannot silently include the entire record.
- The rendered referral includes at least three approved patient identifiers, referrer identity/contact, recipient, date, purpose and clinically necessary information. A copy is retained in the patient record. [RACGP-SGP5, GP2.3]
- Recipient details and included clinical content are snapshotted at issue; directory/profile changes do not alter history.
- Issue is distinct from dispatch, delivery, acceptance, appointment and report received.
- An amendment after issue creates a new version linked to the prior version and requires review of whether redispatch is needed.
- Administrative staff may select/confirm a recipient and record dispatch under policy but cannot author clinical content or urgency.
- Sensitive information requires purpose-based inclusion and consent/authority review.

## Referral lifecycle

`draft → issued → dispatch_pending → dispatched → accepted|declined|awaiting_outcome → outcome_received → closed`.

Manual print/handover can record `dispatched` with method and actor but never “delivered” unless a user records evidence. Decline or failed dispatch leaves responsibility with the practice and creates/retains follow-up work. Cancellation/supersession preserves all versions and warns that an already dispatched copy cannot be withdrawn in Version 1.
