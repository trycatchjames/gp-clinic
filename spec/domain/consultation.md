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

## Consultation invariants

1. Every encounter has exactly one patient, one responsible practitioner, one practice/location context and a positive or open actual time interval.
2. Actual encounter start is not inferred from appointment start or record preview.
3. Every clinical entry identifies its author, recorded time and clinical effective time where different.
4. Completing an encounter makes its signed note immutable except through amendment; linked domain records follow their own lifecycles.
5. An encounter cannot be completed while its required note save has failed or a prescription/referral/investigation remains ambiguously half-issued.
6. Completion cannot silently discard empty-looking but edited drafts.
7. Reopening is a privileged workflow with reason and audit; an amendment is preferred for post-completion additions.
8. An encounter without an appointment remains valid and auditable; an appointment without an encounter remains an operational record only.
9. Changing the appointment after encounter start does not change encounter patient or authorship.
10. A user cannot sign as another practitioner. Co-sign records both original author and co-signer.

## Consultation lifecycle

```text
draft → in_progress → completed
draft/in_progress → abandoned
completed → amended (repeatable amendment events; completed source remains)
completed → reopened → completed   (exceptional, privileged)
```

| Transition | Actor | Preconditions | Effect |
|---|---|---|---|
| create draft | clinical writer | correct patient context | records creator/context; not yet appointment “in consultation” until start |
| draft → in_progress | responsible/participating clinician | identity/context confirmed | sets actual start; appointment may advance atomically |
| in_progress → completed | author with `encounter.complete` | durable note; required actions resolved; warnings acknowledged | signature/completion instant; appointment billing handoff |
| draft/in_progress → abandoned | owner or privileged supervisor | reason; no issued artefact left ambiguous | retains drafts/audit, reverses operational status safely |
| completed → amended | authorised clinical author | reason/link to source | append-only correction/addition, notification review if external artefact affected |
| completed → reopened | `encounter.reopen` | exceptional correction policy | logs reason; original completion remains; downstream effects reviewed |

Automatic timeout may release an edit lock but never abandons or completes an encounter.
