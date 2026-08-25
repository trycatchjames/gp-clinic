# Infection Control, Equipment and Facilities

**Status:** `specified`

## Purpose

RACGP **GP4.1** (infection prevention and control, including sterilisation), **GP5.1** (practice
facilities), **GP5.2** (practice equipment) and **GP5.3** (doctor's bag) are all assessed at
accreditation, and all of them are register-and-log workflows that software handles well.

## Sterilisation (GP4.1)

Practices that reprocess reusable instruments must be able to trace a sterilised instrument to the
patient it was used on.

### The workflow

1. **Load record**: autoclave, load number, date, contents, cycle parameters.
2. **Cycle validation**: printout or data log attached, chemical indicator result, and periodic
   biological indicator results.
3. **Batch labelling**: each pack carries the load identifier.
4. **Use recording**: when a pack is used, the load identifier is recorded against the patient's
   procedure.
5. **Failed cycle workflow**: quarantine the load, identify any items already used from it,
   identify affected patients, and follow the practice's response protocol.

The traceability chain — patient → procedure → pack → load → cycle validation — is the whole point.

### Other infection control

- Cleaning schedules and completion logs
- Sharps injury and blood/body fluid exposure reporting with the post-exposure protocol
- Staff immunisation status (hepatitis B, influenza, others) with currency tracking
- Personal protective equipment stock
- Spills management
- Single-use item compliance

## Equipment (GP5.2, GP5.3)

A register with: item, location, serial number, purchase date, service schedule, last service,
next service due, calibration where applicable, and expiry for consumables.

Tracked specifically because accreditation asks:
- Defibrillator, with pad and battery expiry
- Oxygen, with cylinder levels
- Emergency drugs, with expiry
- **Doctor's bag** contents and expiry (GP5.3) — per practitioner, since each GP has their own
- Sphygmomanometers, spirometers, ECG, scales — calibration
- Vaccine refrigerators — see [immunisation](../40-clinical/09-immunisation.md#cold-chain-gp61)
- Autoclave — validation and service

Overdue services and approaching expiries generate tasks and appear on the practice dashboard.

## Facilities (GP5.1)

Recorded per location: consulting rooms, treatment room, procedure room, accessible entry and
toilet, private reception area for confidential conversations, waiting area, secure record
storage, hand hygiene facilities in every consulting room. Maintained as an accreditation evidence
record with a review date.

## Rules and constraints

1. Sterilisation loads must be traceable to the patients whose procedures used them.
2. A failed cycle triggers the quarantine and patient-identification workflow automatically.
3. Equipment with an overdue service is flagged, and safety-critical equipment overdue is
   escalated.
4. Staff immunisation and training currency is tracked with expiry alerts.
5. Sharps injuries create both an incident record and a staff health record.

## Data touched

`sterilisation_loads`, `sterilisation_cycles`, `sterilisation_usage`, `equipment`,
`equipment_checks`, `equipment_services`, `doctors_bags`, `cleaning_logs`,
`staff_immunisations`, `exposure_incidents`, `facility_records`, `tasks`.

## Offline behaviour

Load records, cycle results and equipment checks can be recorded offline — the treatment room is
often the worst-connected part of a practice.

## Standards mapping

GP4.1 Infection prevention and control, including sterilisation · GP5.1 Practice facilities ·
GP5.2 Practice equipment · GP5.3 Doctor's bag · C3.5 Work health and safety ·
QI3.1 Managing clinical risks

## Feature files

`features/practice-operations/sterilisation-traceability.feature`,
`features/practice-operations/equipment-register.feature`,
`features/practice-operations/sharps-injury.feature`
