# Future integration boundaries

This document is informative. It identifies seams; it does not authorise or specify an integration.

| Future boundary | Why likely | Internal domains | Decoupling requirement |
|---|---|---|---|
| Medicare, Services Australia, PRODA/HPOS/Medicare Online | eligibility, patient claims, bulk-bill assignment, claim status | patient, practitioner-at-location, billing, invoice, claim | Keep payer submission references and external statuses as adapters around an immutable internal invoice/claim snapshot. |
| electronic prescribing exchange (for example eRx or future replacement) | transmit prescription tokens/records | prescription, medication, practitioner, patient | Prescription authorship and issue lifecycle must not depend on an exchange identifier or vendor. |
| My Health Record | retrieve/publish shared summaries and documents | clinical record, medication, allergy, problem, immunisation, document | The practice record remains authoritative for practice-held information; shared-record identifiers are external references. |
| Australian Immunisation Register | mandatory reporting and history retrieval | immunisation, patient, practitioner | Preserve complete local administration data and an independent reporting status; never make the local record disappear on rejection. |
| pathology and radiology providers | electronic requests/results and acknowledgements | investigation, result, document, recall | Ingestion normalises into a provenance-preserving envelope; matching and review remain internal responsibilities. |
| secure messaging (HealthLink, Argus or successors) | clinical correspondence delivery | correspondence, referral, document | Delivery attempts are separate from the authored clinical artefact and recipient directory entry. |
| online bookings (HotDoc, Healthengine or others) | patient-facing booking and reminders | availability, appointment, patient | External bookings use the same conflict and identity rules and cannot write calendar state directly. |
| payment processors and accounting | collect/reconcile funds and ledger export | invoice, payment, billing | Payment-provider transactions reference internal payment intents; financial history remains vendor-neutral. |
| pharmacies, hospitals and external directories | coordinated care and address resolution | referral, correspondence, prescription | Local directory snapshots retain the recipient used at issue time; no live dependency when reviewing history. |
| external clinical terminology and prescribing databases | coded data and safety knowledge | problem, medication, allergy, prescription, observation | Internal records retain code-system/version/display and authored text; adapters cannot silently recode historical entries. |
| third-party identity providers | workforce sign-in | user, authentication, audit | Internal user identity, membership and permissions remain separate from authentication assertions. |

Any future integration requires a new versioned specification, threat/privacy assessment, clinical-safety assessment, failure model, reconciliation design and ADR.
