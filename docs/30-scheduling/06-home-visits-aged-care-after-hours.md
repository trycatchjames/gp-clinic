# Home Visits, Residential Aged Care and After Hours

**Status:** `specified`

## Purpose

Care delivered away from the consulting room, which RACGP **GP1.2** (home and other visits) and
**GP1.3** (care outside normal opening hours) both require the practice to have systems for. It's
also the workflow with the hardest offline requirement in the product.

## Who does it

GP, Practice Nurse, and reception for coordination.

## Home visits (GP1.2)

### The workflow

1. A request arrives (patient, family, RACF, hospital discharge team).
2. **Triage the request**: is a home visit clinically appropriate and safe? Recorded with the
   decision and reason — including declines, because a declined home visit is a decision that may
   be reviewed later.
3. Assess **practitioner safety**: known risks at the address, whether a second person should
   attend, whether the visit should be daytime only. This is recorded on the patient/address, not
   passed around verbally.
4. Schedule as a `home_visit` appointment with travel time blocked either side.
5. **Prepare the visit pack** — this is the offline moment. Before leaving, the GP syncs: patient
   summary, current medicines, allergies, active problems, recent results, care plan, advance care
   directive, and the practice's own contact details.
6. Conduct the visit; write the note offline.
7. On return, sync. Billing (home visit MBS items with their own attendance structure) is
   completed then.

## Residential aged care

### The workflow

1. Patients are linked to a **facility** record: name, address, contact, nurse-in-charge phone,
   preferred fax/secure messaging, and after-hours arrangements.
2. RACF rounds are scheduled as a **list**, not individual appointments — the GP visits the
   facility and sees N residents. The software supports a "round" containing multiple encounters
   at one facility on one day.
3. Before the round, the whole list is made available offline in one action.
4. During the round, each resident's encounter is recorded, medications reviewed, and any
   facility-directed orders written.
5. After the round: notes sync, medication changes generate scripts and a facility medication
   chart update, and billing is completed for the whole round.

**MyMedicare matters here**: registration is a precondition for the General Practice in Aged Care
Incentive, so the round list shows registration status per resident and flags unregistered ones.

## After hours (GP1.3)

The practice's recorded after-hours arrangement (own practitioners / cooperative / deputising
service / hospital ED) drives:

- The message given to patients on the phone and on the website
- The patient-facing practice information sheet
- Whether the software supports an after-hours roster and after-hours MBS item suggestions

Where the practice uses a deputising service, the workflow that matters is **the return of
information**: the deputising service's report must land in the practice's inbox, be actioned the
next working day, and be filed to the patient record. An after-hours encounter the usual GP never
sees is a continuity failure (GP2.1, C5.3).

## Rules and constraints

1. A home visit cannot be scheduled without a recorded triage decision.
2. Practitioner safety flags on an address are shown at scheduling and again at departure.
3. The offline visit pack must be explicitly synced; the app shows how fresh the cached data is
   and warns if it is more than 24 hours old.
4. RACF rounds bill per resident, not per round.
5. After-hours reports from deputising services are tracked to acknowledgement, like results.

## Data touched

`appointments`, `encounters`, `facilities`, `facility_residents`, `visit_rounds`,
`address_safety_flags`, `documents`, `tasks`.

## Offline behaviour

**This is the primary offline use case.** The visit pack and the round list are fully cached;
encounters and notes are written offline and queued. Prescribing remains online-only, and the UI
says so before the GP leaves so they can print or pre-issue scripts if needed.

## Standards mapping

GP1.2 Home and other visits · GP1.3 Care outside of normal opening hours · GP2.1 Continuous and
comprehensive care · C5.3 Clinical handover

## Feature files

`features/scheduling/home-visits.feature`,
`features/scheduling/residential-aged-care-round.feature`,
`features/scheduling/after-hours-arrangements.feature`
