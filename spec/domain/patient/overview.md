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
