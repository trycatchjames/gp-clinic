# Privacy, Security and Record Keeping

**Status:** `built` (audit log, RBAC, consent model) / `specified` (retention automation)

## Obligations this software has to make achievable

Australian general practice sits under the **Privacy Act 1988** and the **Australian Privacy
Principles**, state health records legislation, and RACGP Standards C6 (Information management)
and C7 (Content of patient health records). Practically, the practice must be able to answer:

- Who has looked at this patient's record, and when? (C6.3, C6.4)
- Is the record complete enough to hand over safely? (C7.1, C5.3)
- Has the patient consented to what we're doing with their information? (C1.3)
- Can we produce the record when the patient asks for it? (APP 12)
- Can we correct it when it's wrong, without destroying the original? (APP 13)

## Access control

Three layers, all enforced server-side:

1. **Tenancy** — every query is scoped by `practice_id`. There is no cross-practice read path.
2. **Role** — see [01-personas-and-roles.md](01-personas-and-roles.md). Reception cannot read
   clinical notes; the API returns 403, and the UI never renders the affordance.
3. **Purpose** — a "break glass" access to a record outside the user's normal scope (e.g. an
   after-hours GP covering another site) requires a stated reason, is permitted, and is flagged
   for review. Blocking emergency access is dangerous; unlogged emergency access is negligent.

## Audit log

Every one of these produces an `audit_log_entry`:

- Viewing a patient's clinical record (not just editing it)
- Any create/update/delete of clinical or financial data
- Printing, exporting or emailing anything containing patient data
- Login, logout, failed login, password change, role change
- Break-glass access, with the stated reason

Entries are append-only, carry `actor_user_id`, `patient_id`, `practice_id`, `action`,
`entity_type`, `entity_id`, `ip`, `user_agent`, `occurred_at`, and a `context` JSON blob.
Nothing in the application deletes or updates an audit entry.

## Consent

Consent is modelled explicitly rather than assumed, because different consents have different
lifetimes:

| Consent type | Scope | Typical lifetime |
|---|---|---|
| `privacy_collection_statement` | Collection and use of health information | Once at registration, re-affirmed on material change |
| `my_health_record_upload` | Uploading shared health summaries and event summaries | Standing, withdrawable |
| `sms_email_communication` | Appointment reminders, recalls by SMS/email | Standing, withdrawable, per channel |
| `mymedicare_registration` | Voluntary registration with this practice | Until withdrawn or moved |
| `procedure_specific` | A named procedure, after explanation of risks | Per event, recorded in the encounter |
| `third_party_disclosure` | Insurer, employer, lawyer | Per request, scoped and time-limited |
| `research_or_qi_data_use` | De-identified extraction for QI/research (C3.6) | Standing, opt-out |

Withdrawal is a first-class action: it is recorded with a timestamp, and downstream systems
(recall SMS, MHR upload) check current consent at send time, not at creation time.

## Record content (C7.1)

The system enforces that a signed clinical note contains at minimum:

- Date, time and the identity of the practitioner
- Reason for the encounter
- Relevant history and examination findings
- Assessment / problem
- Management plan, including any medicines prescribed and investigations ordered
- Any advice given, including **safety-netting**
- Any referral made

Health summaries (QI2.1) must maintain current: allergies and adverse reactions, current
medicines, active problems, immunisations, family history, social history, risk factors.
Completeness is measured and surfaced on the practice dashboard because that's what accreditation
asks for.

## Amendments and corrections

A signed note is immutable. Corrections are recorded as a `note_amendment` linked to the original,
with author, timestamp and reason. The original text remains readable. This satisfies APP 13
(correction) without destroying the evidentiary record.

## Retention

- Adults: at least **7 years** from the date of last entry
- Patients under 18: until the patient turns **25**
- Retention is calculated per patient and surfaced as a report; nothing is auto-destroyed by the
  application. Destruction is a deliberate, logged, practice-manager action.

## Security controls in the prototype

| Control | Status |
|---|---|
| Argon2id password hashing | Built |
| Short-lived access token, rotating refresh token with reuse detection | Built |
| Server-side tenancy and role enforcement on every route | Built |
| Full audit log on clinical access and all mutations | Built |
| Rate limiting on auth endpoints | Built |
| Field-level encryption of Medicare/DVA numbers at rest | Specified |
| MFA (TOTP) | Specified |
| Session/device management with remote revoke | Specified |
| At-rest encryption of the offline cache | Specified |

The "specified" items are deliberate prototype omissions, listed so they are not mistaken for
oversights.
