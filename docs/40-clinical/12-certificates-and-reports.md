# Certificates, Letters and Third-Party Reports

**Status:** `specified`

## Purpose

The paperwork that surrounds general practice. It is a real workload, a real revenue line, and a
real medico-legal exposure, and most software treats it as an afterthought.

## Who does it

GP, GP Registrar. Practice Manager for the administrative and billing side of third-party reports.

## Document types

| Document | Notes |
|---|---|
| **Medical certificate** (unfit for work/study) | Dates, capacity, and whether based on examination or on the patient's report |
| **Carer's certificate** | For someone caring for another person |
| **WorkCover Certificate of Capacity** | Jurisdiction-specific form, capacity for work, review date, claim number |
| **Fitness for work / return to work plan** | Often with restrictions listed |
| **Commercial drivers' / rail / aviation medical** | Standards-based (Assessing Fitness to Drive), usually non-Medicare |
| **Insurance report** | Requested by an insurer with patient consent; billed to the insurer |
| **Centrelink medical certificate** | |
| **NDIS supporting evidence** | |
| **Letter to a school, employer, airline, gym** | |
| **Advance care planning documents** | Advance care directive, appointment of a substitute decision-maker |
| **Death certificate / cause of death** | With coronial referral criteria surfaced |

## The workflow

1. Select the document type. Templates are practice-configurable and pre-populate patient details,
   practitioner details and practice details.
2. Record the **basis** of the certificate: examined today, examined on a prior date, or based on
   the patient's report. This distinction is required on medical certificates and is where most
   complaints originate.
3. Complete the content. The system enforces the required fields for the type.
4. **Sign and issue.** The document is stored in the patient record, immutable, with a copy
   available for reprint.
5. **Bill** — Medicare items where applicable; non-Medicare fee for insurance reports, commercial
   medicals and most third-party paperwork.

### Third-party requests (insurer, employer, lawyer)

These have a different shape, because the patient is not the requester:

1. The request arrives with (or without) patient authority.
2. **Verify consent and authority.** No records leave without it, and the scope of the consent is
   recorded — a consent to release information about a knee injury is not consent to release the
   whole record.
3. The GP reviews and prepares the report, releasing only what is within scope.
4. The release is logged: what, to whom, when, under what authority.
5. Invoice the requester.
6. Track it as an outstanding item until paid.

## Rules and constraints

1. Certificates record whether they are based on examination or on the patient's report.
2. Backdated certificates require a reason and are flagged.
3. No third-party disclosure without recorded, scoped patient consent.
4. Every release is logged with a content manifest.
5. Issued documents are immutable; a correction is a new document that references the original.
6. Non-Medicare items are billed from the practice's own fee schedule with the fee disclosed in
   advance (C1.5).

## Data touched

`documents`, `document_templates`, `certificates`, `record_releases`, `consents`, `invoices`,
`tasks`.

## Offline behaviour

Certificates can be created and printed offline. Third-party releases are online-only, because
they need consent verification and audit integrity.

## Standards mapping

C1.5 Costs associated with care · C6.3 Confidentiality and privacy · C7.1 Content of patient
health records · C3.1 Business operation systems

## Feature files

`features/clinical/medical-certificates.feature`,
`features/clinical/third-party-reports.feature`,
`features/clinical/document-templates.feature`
