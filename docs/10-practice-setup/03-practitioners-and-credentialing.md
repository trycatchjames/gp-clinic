# Practitioners, Credentialing and Supervision

**Status:** `built`

## Purpose

Hold the credential and identifier data that determines (a) whether someone is legally allowed to
do what they're doing, and (b) whether the practice gets paid for it. RACGP **GP3.1** requires the
practice to hold evidence of qualifications, registration and training for its clinical team.

## Who does it

Practice Owner or Practice Manager creates the profile; the practitioner completes and maintains
their own.

## The workflow

### Creating a practitioner profile

1. Personal: name, preferred name, title, date of birth, contact, gender (for patient preference
   matching — some patients require a female GP and this must be bookable).
2. **Kind**: `gp`, `gp_registrar`, `nurse`, `nurse_practitioner`, `midwife`, `allied_health`,
   `practice_pharmacist`, `aboriginal_health_practitioner`.
3. **AHPRA registration**: number, profession, registration type (general/specialist/limited/
   provisional), specialty, conditions or undertakings, expiry date.
4. **Specialist recognition / vocational registration** for GPs — this gates the higher (A1) MBS
   fee tier, so it is a billing-relevant flag, not a vanity field.
5. **HPI-I**, **prescriber number**.
6. **Medicare provider numbers, one per location.**
7. Qualifications and training records, with evidence documents attached:
   - Fellowship (FRACGP / FACRRM)
   - **Mental Health Skills Training (GPMHSC-accredited)** — gates MBS 2715/2717
   - Focussed Psychological Strategies
   - CPR currency, expiry tracked
   - Immunisation provider accreditation
   - Cervical screening / IUD / implant / skin procedure competencies
8. Professional indemnity insurance: insurer, policy number, expiry.
9. Working arrangement: employee / contractor / partner; percentage split or salary reference.

### Expiry monitoring

Anything with an expiry date (AHPRA registration, indemnity, CPR, working with children check)
generates a task for the practice manager at 90, 30 and 7 days out, and an alert on the dashboard
once expired. An expired AHPRA registration blocks new appointments being booked to that
practitioner and flags existing ones.

### Registrar supervision (GP3.1)

A practitioner of kind `gp_registrar` must have:

- A nominated **supervisor** (a practitioner of kind `gp` with an active supervisor flag)
- A supervision level: `direct`, `indirect`, `remote`
- An effective date range
- The training term (GPT1/GPT2/GPT3/Extended Skills) and training organisation

The supervision record drives two runtime behaviours:

1. **Availability check** — if the registrar's supervision level requires a supervisor on site,
   the appointment book warns when the registrar has sessions with no supervisor rostered.
2. **Case escalation** — the registrar can flag an encounter `supervisor_review_requested`,
   which lands in the supervisor's task list with the note attached.

### Practitioner availability

Session templates per practitioner per location: recurring weekly sessions with start/end,
appointment types allowed, and online-bookable flag. Overrides handle leave, conferences, and
one-off extra sessions.

## Rules and constraints

1. A practitioner may exist without a user account (locums, visiting practitioners).
2. A practitioner cannot be booked at a location where they have no provider number, unless the
   appointment is explicitly marked non-billable.
3. MBS items flagged `requires_mental_health_skills_training` are not offered for practitioners
   without the MHST flag; selecting them anyway requires an override with a reason.
4. Vocational registration status determines which fee tier is applied by default.
5. A registrar cannot be activated without a supervisor record.
6. Deactivating a practitioner requires their future appointments to be reassigned or cancelled.

## Data touched

`practitioners`, `practitioner_locations`, `practitioner_qualifications`,
`practitioner_credentials`, `supervision_relationships`, `session_templates`,
`session_overrides`, `tasks`.

## Offline behaviour

Read-only offline (the book needs practitioner names, kinds and availability). Edits online-only.

## Standards mapping

GP3.1 Qualifications, education and training of healthcare practitioners · C3.2 Accountability
and responsibility · C5.2 Clinical autonomy for practitioners

## Feature files

`features/practice-setup/practitioner-profile.feature`
`features/practice-setup/provider-numbers.feature`
`features/practice-setup/credential-expiry.feature`
`features/practice-setup/registrar-supervision.feature`
