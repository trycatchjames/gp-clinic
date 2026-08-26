# Consultation and encounter

## Purpose

Encounter is an episode of care; Consultation is the principal Version 1 workflow for recording it. It binds patient, responsible practitioner, location, mode, actual times and the clinical entries created in that episode.

## Core attributes

- patient, responsible practitioner, participating practitioners and location;
- optional appointment; encounter type/mode; actual start/end;
- lifecycle state, owner, lock/version and completion details;
- reason for encounter, authored clinical note(s), linked diagnoses, observations, medication changes, prescriptions, investigations, referrals, recalls, tasks, documents and billing handoff;
- third-party presence/consent where relevant and supervision/co-sign facts where required by practice policy.

## Rules

- Opening or previewing a patient record does not create or start an encounter. [BP-VISIT]
- Starting requires explicit patient/practitioner/location context confirmation.
- Structured actions create records in their owning domains and are linked to the encounter; they are not embedded only in note text.
- Completion does not require every optional field, but it checks record sufficiency and unresolved drafts/errors.
- One encounter can include contributions by multiple authorised users; each entry retains its own author.
- Billing data may reference encounter facts but cannot alter the clinical record.
