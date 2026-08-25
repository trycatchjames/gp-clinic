# Patient Record Lifecycle: Merge, Transfer, Inactivate, Deceased

**Status:** `specified`

## Purpose

The unglamorous workflows that determine whether a practice's data is trustworthy in five years.

## Merging duplicates

Duplicates happen: married names, transposed dates of birth, "Bill" vs "William", a patient who
registered online and again at the desk.

1. Duplicates are detected automatically (name + DOB fuzzy match, exact Medicare number match) and
   listed in a **potential duplicates** queue for the practice manager.
2. Merging is a **clinical decision**, so it requires a clinical role to confirm — a receptionist
   can flag, not merge.
3. The merge screen shows both records side by side, field by field, with the surviving value
   selectable per field.
4. On merge: all clinical records, appointments, invoices, results, recalls and documents move to
   the surviving record. The merged record becomes a tombstone that redirects, so any external
   reference (a pathology result arriving under the old ID) still lands correctly.
5. The merge is **reversible** for 30 days and permanently audit-logged with both source records
   preserved.

## Transfer of care (GP2.4)

When a patient moves to another practice:

1. A request for records arrives (or the patient requests a transfer).
2. Identity and authority to release are verified and recorded.
3. A **health summary** is generated: current problems, current medicines, allergies,
   immunisations, recent results, care plans, relevant correspondence.
4. The release is logged: what was released, to whom, when, under what authority.
5. The patient is marked `transferred_out` with a date and destination, but **the record is
   retained** — transfer is not deletion.

When a patient arrives from another practice, the inbound summary is filed as a document, and the
practice nurse or GP reconciles it into the structured health summary. Reconciliation is an
explicit step with its own screen, because "PDF in the file" is not a health summary.

## Inactivating

A patient with no contact for a configurable period (default 3 years) is proposed for
inactivation. Inactive patients are excluded from recall/reminder runs and from denominator
counts in practice reporting, but remain fully searchable and readable.

## Deceased

1. Recorded with date of death and source (family, hospital notification, RIP-notification).
2. All open recalls, reminders and future appointments are cancelled — and the system **must** do
   this reliably, because a recall letter to a deceased patient is one of the most distressing
   errors a practice can make.
3. The record becomes read-only except for administrative correction and for filing correspondence
   (death certificates, coronial requests).
4. Family members linked as relationships are not automatically notified of anything.

## Retention and destruction

Retention is calculated per patient (7 years from last entry for adults; until age 25 for
children). The system reports on records past retention; it never destroys automatically.
Destruction is a deliberate practice-manager action, recorded permanently.

## Rules and constraints

1. Merges require a clinical role and are reversible for 30 days.
2. Deceased marking cascades to recalls, reminders and appointments in a single transaction.
3. Nothing clinical is ever hard-deleted by the application.
4. Every record release is logged with recipient, authority and content manifest.

## Data touched

`patients`, `patient_merges`, `record_releases`, `recalls`, `reminders`, `appointments`,
`documents`, `audit_log_entries`.

## Offline behaviour

Online-only. All of these are irreversible or near-irreversible operations that must not be
queued.

## Standards mapping

C6.1 Patient identification · C6.2 Patient health record systems · C6.3 Confidentiality and
privacy · GP2.4 Transfer of care · QI2.1 Health summaries

## Feature files

`features/patient-management/duplicate-merge.feature`,
`features/patient-management/transfer-of-care.feature`,
`features/patient-management/deceased-patient.feature`
