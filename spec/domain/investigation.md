# Investigation

## Purpose

Investigation represents a clinician's request for pathology or diagnostic imaging and the obligation to track expected results. Version 1 produces an internal/printable request and accepts manual/fixture results only.

## Core attributes

Patient, ordering practitioner/location, type, requested tests/studies as authored, clinical indication/question, priority, request date, requested provider text/local directory snapshot, copy-to recipients, fasting/preparation instructions as authored, expected/target date where set, responsibility/cover, status and related encounter/results.

## Rules and invariants

- An issued request has at least three patient identifiers in its rendered artefact, ordering practitioner/contact, requested investigation and clinical information needed for the recipient. [RACGP-SGP5, GP2.3 and C6.1]
- The ordering practitioner is initially responsible; reassignment records handover without changing authorship.
- Issued content is a snapshot. Amend/cancel creates a new version/status; it cannot assert an external provider received the change.
- A request may have zero, one or many partial/final/corrected results.
- “No result received” remains observable after the expected date and may create a task; it is not automatically closed.
- Printing/manual dispatch is distinct from external delivery confirmation.

## Investigation lifecycle

`draft → issued → awaiting_result → partially_resulted → resulted → closed`

Alternatives: `draft → discarded`; `issued|awaiting_result → cancelled`; any issued state → `superseded`.

Issue fixes the request snapshot. A manual dispatch fact may move `issued` to `awaiting_result`. Result matching advances partial/final receipt but only a clinician or governed policy closes the investigation after review/follow-up. Cancellation after dispatch is internal and displays that external cancellation is unconfirmed.
