# Patient Registration and Identification

**Status:** `modelled`

## Purpose

Create and maintain the patient record, and — critically — make sure the person in front of you
is the person whose record is open. RACGP **C6.1 (Patient identification)** requires the practice
to use at least **three approved patient identifiers** whenever it accesses or updates a record.

## Who does it

Receptionist (most registrations), Practice Nurse, GP, or the patient themselves via a pre-visit
online form.

## The workflow

### New patient registration

1. **Search first, always.** Before creating anything, search by surname + date of birth, then by
   Medicare number, then by phone. Duplicate patient records are the most persistent data quality
   problem in general practice and the cheapest fix is to make searching unavoidable.
2. Capture identity: family name, given names, preferred name, date of birth, sex assigned at
   birth, gender identity, pronouns, title.
3. Capture contacts: mobile, home phone, work phone, email, residential address, postal address.
4. Capture **cultural identity**: Aboriginal and/or Torres Strait Islander status (the question is
   asked of every patient — it must be, both for equity and because it drives item 715, the ATSI
   immunisation schedule, and PIP Indigenous Health Incentive), country of birth, preferred
   language, **interpreter required** flag (C1.4, C2.1).
5. Capture entitlements:
   - Medicare card number, individual reference number (IRN), expiry
   - DVA file number and card colour (Gold / White / Orange)
   - Healthcare card / pension concession card, number, expiry
   - Private health fund and membership number
   - Safety net registration
6. Capture next of kin, emergency contact, and — separately — **carer**, **guardian**, **power of
   attorney** and **nominated representative**. These are four different things with four
   different legal meanings, and lumping them into "emergency contact" causes real harm.
7. Nominate a **usual GP** (drives continuity reporting under GP2.1 and MyMedicare).
8. Record the **privacy collection statement** consent and communication preferences (SMS/email
   consent per channel).
9. Offer **MyMedicare** registration — see
   [03-mymedicare.md](03-mymedicare.md).

### Patient identification at each contact (C6.1)

Three identifiers, verified aloud, before opening or updating a record:

- Full name
- Date of birth
- One of: address, Medicare number, or a practice-assigned patient identifier

The clinical record header displays all three and the UI requires confirmation before the first
write of the day on a patient. Not on every click — that trains people to click through.

### Alerts and flags

Two categories, deliberately separated by who can see them:

| Category | Visible to | Examples |
|---|---|---|
| **Clinical alerts** | Clinical roles | Anaphylaxis, anticoagulated, immunosuppressed, pregnancy, cognitive impairment |
| **Administrative / front-desk alerts** | All staff including reception | Interpreter required, wheelchair access needed, requires female practitioner, aggression risk, outstanding account, third party present |

An alert has an author, a date, a severity, and an optional review date. Alerts without review
dates rot; the system surfaces stale ones.

## Rules and constraints

1. Search before create is enforced by the UI flow; the create form is only reachable from a
   search that returned no match.
2. Potential duplicates are detected on save (name + DOB fuzzy match, exact Medicare number match)
   and shown before the record is committed.
3. ATSI status is asked of every patient; "not stated" is a valid recorded answer, blank is not.
4. Medicare card number is validated by checksum. It is **not** verified online in the prototype.
5. A patient can be `active`, `inactive`, or `deceased`. Deceased patients are never deleted and
   their record is read-only except for administrative corrections.
6. A patient belongs to one practice (tenant). Cross-practice sharing is a transfer, not a link.

## Data touched

`patients`, `patient_contacts`, `patient_entitlements`, `patient_relationships`,
`patient_alerts`, `consents`, `audit_log_entries`.

## Offline behaviour

Patients scheduled today/tomorrow are cached. New registrations can be queued offline with a
client-generated UUID; duplicate detection re-runs on sync and flags conflicts for review rather
than auto-merging.

## Standards mapping

C1.4 Interpreter and other communication services · C2.1 Respectful and culturally appropriate
care · C6.1 Patient identification · C6.2 Patient health record systems · C6.3 Confidentiality
and privacy · GP2.1 Continuous and comprehensive care

## Feature files

`features/patient-management/patient-registration.feature`,
`features/patient-management/patient-identification.feature`,
`features/patient-management/patient-alerts.feature`
