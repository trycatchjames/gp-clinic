# Immunisation

**Status:** `specified`

## Purpose

Deliver vaccines safely, record them completely, report them to the Australian Immunisation
Register, and keep the vaccines potent — the last of which is its own RACGP standard (**GP6.1**).

## Who does it

Practice Nurse (most), GP, Aboriginal Health Practitioner.

## The workflow

### Before

1. Check the patient's immunisation history — practice record plus AIR (an integration; recorded
   manually in the prototype).
2. Determine what is due against the **National Immunisation Program** schedule, using the
   appropriate schedule: standard, **Aboriginal and Torres Strait Islander**, or medical risk
   group.
3. Screen for contraindications and precautions: acute illness, allergy including anaphylaxis to
   a previous dose or component, immunosuppression, pregnancy.
4. Obtain and record **informed consent**, including for whom (parent/guardian for a child).

### Administering

Record, without exception:

- Vaccine (brand and antigen), **batch number**, expiry
- Dose number in the schedule
- Route and **site** (left/right deltoid, vastus lateralis)
- Date and time
- Administering practitioner
- Any pre-existing conditions relevant to the dose

Batch number and site are not optional. When a batch is recalled, the practice must be able to
identify every patient who received it within minutes.

### After

1. **Observation period** — 15 minutes minimum, recorded as started and completed. Anaphylaxis
   management must be immediately available (C3.3 Emergency response plan; GP5.3 Doctor's bag).
2. Provide aftercare advice.
3. **Report to AIR** — mandatory for NIP vaccines.
4. Schedule the next dose in the schedule as a reminder.
5. Record any **adverse event following immunisation (AEFI)**: what happened, when, severity,
   outcome, and report to the state adverse events system. An AEFI is also recorded as an allergy/
   adverse reaction on the patient record so it surfaces before the next dose.

## Cold chain (GP6.1)

Vaccine potency is a standard in its own right because a break in the cold chain silently makes
every dose useless.

- **Twice-daily temperature recording** for every vaccine refrigerator: minimum, maximum, current,
  recorded by a named person
- Data-logger download and review at the configured interval
- **Cold chain breach** workflow: record the excursion (duration, temperature range), quarantine
  affected stock, contact the state immunisation program for advice, record the disposition
  (use / discard), and — where doses were already given from affected stock — identify and recall
  those patients for revaccination
- Vaccine stock: batch, expiry, quantity received and used, with expiry alerts

## Rules and constraints

1. A vaccine cannot be recorded without batch number, site and administering practitioner.
2. The observation period must be recorded as completed, or an exception reason given.
3. Cold chain temperature must be recorded twice daily on days the practice is open; missed
   readings are flagged.
4. A cold chain breach quarantines affected stock immediately in the system.
5. AEFIs are recorded on the patient record as adverse reactions and surface at every future dose.
6. Consent is recorded for every administration.

## Data touched

`immunisations`, `immunisation_schedules`, `vaccine_stock`, `vaccine_batches`,
`cold_chain_readings`, `cold_chain_breaches`, `adverse_events`, `allergies`, `reminders`,
`consents`.

## Offline behaviour

Administration can be recorded offline (batch and site captured on the device). AIR reporting
queues. Cold chain readings can be recorded offline.

## Standards mapping

GP6.1 Maintaining vaccine potency · C4.1 Health promotion and preventive care ·
C3.3 Emergency response plan · GP5.3 Doctor's bag · QI3.1 Managing clinical risks

## Feature files

`features/clinical/immunisation-administration.feature`,
`features/clinical/cold-chain-monitoring.feature`,
`features/clinical/cold-chain-breach.feature`,
`features/clinical/adverse-event-following-immunisation.feature`
