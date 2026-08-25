# Correspondence and Document Management

**Status:** `specified`

## Purpose

Everything that arrives at a practice from outside: specialist letters, discharge summaries,
pathology and imaging reports, allied health reports, hospital notifications, insurer requests,
legal correspondence. If it lands in a shared inbox nobody owns, patients get hurt.

## Who does it

Reception and administrative staff sort and file; clinicians action.

## The workflow

### Inbound

1. Documents arrive (secure messaging, fax, email, post scanned in).
2. **Match** to a patient and, where relevant, to an open referral or investigation request.
   Auto-matching where the identifiers permit; a manual queue otherwise.
3. **Route** to the correct clinician: the ordering practitioner, the referring practitioner, or
   the patient's usual GP.
4. **Categorise**: specialist letter, discharge summary, result, allied health report,
   administrative.
5. **Action** — the clinician records what they are doing about it (see
   [clinical handover](../40-clinical/13-clinical-handover-and-continuity.md)). Documents are
   tracked to **actioned**, not to **read**.
6. **File** to the patient record with the category, date and source.

### The unmatched queue

Documents that can't be matched to a patient. Worked daily and never allowed to age — the oldest
unmatched document's age is on the practice dashboard. An unmatched pathology result is a result
nobody is looking at.

### Outbound

Referral letters, reports, health summaries, certificates. Every outbound item records recipient,
channel, timestamp, delivery status and content — so "did you send it?" always has an answer.

### Scanning

Paper arriving is scanned, categorised, matched and filed, then the paper is disposed of according
to the practice's policy. The scan is the record.

## Rules and constraints

1. Every inbound document is matched to a patient or sits in the unmatched queue — there is no
   third state.
2. Clinically significant documents are tracked to actioned.
3. Documents are never deleted; misfiled documents are re-filed with the correction logged.
4. Outbound delivery is logged with status.
5. Document access is audit-logged like any clinical data.

## Data touched

`documents`, `document_categories`, `document_actions`, `unmatched_documents`,
`outbound_communications`, `referrals`, `investigation_requests`, `tasks`.

## Offline behaviour

Documents cached for scheduled patients are readable offline. Actioning queues. Inbound receipt
and matching are online-only.

## Standards mapping

C5.3 Clinical handover · C6.2 Patient health record systems · C6.3 Confidentiality and privacy ·
GP2.2 Follow-up systems · GP2.3 Engaging with other services

## Feature files

`features/practice-operations/inbound-correspondence.feature`,
`features/practice-operations/unmatched-documents.feature`,
`features/practice-operations/outbound-communications.feature`
