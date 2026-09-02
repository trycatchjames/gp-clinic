# Patient

## Purpose

Patient owns the stable identity and administrative context for a person receiving or seeking care. Clinical facts are owned by their respective domains and linked to the patient; Patient does not own copies of allergies, medicines or consultations.

## Core attributes

- stable internal patient identifier and human-readable local record number;
- legal/current family and given names, names used, previous names, title where supplied and pronouns;
- date of birth with precision/source, and death status/date with source;
- assigned sex at birth, current gender and variations of sex characteristics recorded separately; optional sexual orientation where clinically relevant and voluntarily provided;
- self-described Aboriginal and/or Torres Strait Islander status, cultural background, preferred language and interpreter requirement;
- residential/postal addresses and contact points with type, preference, verification and do-not-use flags;
- next of kin, emergency contacts, carers and authorised representatives, with relationship, authority scope and dates;
- Medicare card number, individual reference number and expiry; optional IHI when supplied with provenance; concession/DVA or other payer facts as administrative attributes, never primary identity;
- usual practitioner/location, communication consents/preferences and privacy/safety restrictions;
- active, inactive, deceased, potential-duplicate and merged lineage status;
- provenance and verification history for material demographics.

RACGP requires three approved identifiers and treats a Medicare number as ineligible for that verification. [RACGP-SGP5, C6.1] Sex/gender-related attributes must be collectable separately and privately. [RACGP-SEX-GENDER]

## Relationships

Patient has many appointments, encounters, observations, problems, allergies/adverse reactions, medication records, prescriptions, investigations, results, referrals, documents, correspondence, tasks, recalls, reminders, immunisations, invoices and audit events. A patient may have many contacts/representatives and exactly one surviving patient after a completed merge.

## Rules

- Search MUST occur before registration and duplicate risk MUST be assessed again on save.
- A patient may exist without Medicare, concession, mobile, email, binary sex/gender or fixed address.
- A newborn, unknown person or lawful pseudonymous patient can be registered with incomplete facts when the omission and follow-up need are explicit.
- Contact preference is not consent for every message purpose. Clinical, appointment, preventive and account communications are separately governed.
- Sensitive values are shown only when needed for the current task; identity and wrong-patient safety cannot depend on hiding the record completely.
- The patient record remains a distinct individual record even when family members share contact, Medicare card, address or payer.

## Ownership boundary

Patient owns demographic truth, merge lineage and representative authority. Appointment owns visit scheduling. Clinical Record composes the health record view. Billing owns payer decisions and balances. External identifiers are attributes with provenance, not foreign-system ownership.

## Patient relationships

```text
Practice 1 ── * Patient
Patient 1 ── * PatientName / Address / ContactPoint
Patient 1 ── * RepresentativeAuthority ── 1 Person/Patient (optional)
Patient 1 ── * Appointment ── 0..1 Encounter
Patient 1 ── 1 ClinicalRecordView (composition, not stored owner)
Patient 1 ── * ClinicalEntry / Document / Obligation / Invoice
Patient * ── 0..1 surviving Patient (merge lineage)
```

Family links, next-of-kin links and shared contact details do not permit cross-record access. The same natural person may be both a patient and a representative; the relationship is explicit and does not merge the two records.

The Clinical Record capability composes linked domains at read time. No “patient blob” may bypass domain permissions or mutation rules.

## Patient invariants

1. Every patient has one immutable internal identifier. Local record numbers are unique within a practice and never reused.
2. No two active records may knowingly represent the same person after a confirmed merge; potential duplicates remain separate until authorised resolution.
3. A merge never deletes source history or rewrites authorship. Every linked record can be traced to its pre-merge patient identifier.
4. The surviving patient in a merge cannot itself be a non-surviving merged record.
5. A patient cannot be both operationally active and merged. A deceased patient may be retained as inactive/deceased but never deleted merely because of death.
6. Medicare card number is optional and never counts as one of the minimum approved identifiers used to record identity verification.
7. Date of birth supports exact, estimated/partial or unknown states; display must not fabricate missing day/month.
8. Name used, legal/current name, previous name, assigned sex at birth, gender and pronouns are not derived from one another.
9. Aboriginal and/or Torres Strait Islander status, gender and cultural attributes are self-described; the system must not infer them from appearance, name, address or payer data.
10. A contact marked unsafe or do-not-use cannot be selected by automated/default communication.
11. A representative's access/consent authority is scoped and time-bounded; relationship alone does not confer authority.
12. Updating a mutable demographic fact preserves its change history, source, actor and time.
13. Inactivation, deceased marking and merge are lifecycle operations, not deletion operations.
14. Clinical and financial records linked to a patient remain accessible according to retention and authorisation policy after inactivation, death or merge.
15. Any screen from which clinical, prescription, result, referral or billing action can occur displays enough identity context to distinguish similar patients.

## Patient alerts and restrictions

Alerts are high-salience facts, not a generic replacement for structured clinical records.

### Types

- **operational safety alert:** reception-safe information needed to interact safely, such as interpreter required, unsafe contact method, identity risk, behavioural safety procedure or access need;
- **clinical alert:** clinician-authored information that must be considered during care, linked where possible to Allergy, Problem, Medication, Result or another source;
- **access/privacy restriction:** sensitive-record or representative/contact restriction enforced by authorisation, not merely displayed text.

### Attributes and rules

Every alert has type, concise actionable text, source, author, effective/review/expiry dates, audience, status and linked structured record. Active alerts appear only to intended audiences. Clinical detail cannot leak through an operational alert. Expiry makes an alert review-due/inactive according to policy; it does not delete history.

Alerts must not duplicate allergies or recalls as the sole record. Dismissal by a viewer is not deactivation. Creating, changing, overriding or entering an alert in error is audited. Administrators cannot author clinical alerts without clinical authority.

## Patient lifecycle

### Canonical states

`provisional` → `active` → `inactive`

`provisional|active|inactive` → `deceased`

`provisional|active|inactive|deceased` → `merged`

Potential duplicate is a review flag, not a lifecycle state.

| From | To | Who/permission | Preconditions and side effects |
|---|---|---|---|
| provisional | active | `patient.demographics.edit` | Minimum locally required identity/contact review completed; audit activation. |
| active | inactive | `patient.lifecycle.manage` | Reason required; future appointments and open obligations are shown and must be resolved or explicitly retained; no history deleted. |
| inactive | active | `patient.lifecycle.manage` | Reason required; previous status remains in history. |
| any non-merged | deceased | `patient.lifecycle.manage` | Source and known/estimated death date recorded; future routine communications/bookings are blocked; open clinical obligations require clinician review. |
| any non-merged | merged | `patient.merge` plus second-person confirmation | Duplicate confidence reviewed; target survivor active/not merged; merge preview accepted; identifiers/contact/alerts conflicts resolved or explicitly deferred. |

`deceased` is not normally reversible. A mistaken deceased status may be corrected only by a privileged entered-in-error operation that retains the original event and requires reason. A completed merge cannot be undone as an ordinary user action; support may perform a governed lineage-preserving unmerge only if downstream records can be deterministically restored.

Invalid transitions return a business-rule conflict and make no partial changes.
