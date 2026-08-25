# Locations, Hours and Access to Care

**Status:** `built`

## Purpose

Model where the practice delivers care, when, and how patients reach it outside those times.
Almost everything operational hangs off the location: provider numbers, appointment books,
banking, fee schedules, cold chain, sterilisation.

## Who does it

Practice Owner, Practice Manager.

## The workflow

### Adding a location

1. Name, address (street, suburb, state, postcode), postal address if different.
2. Contact: phone, after-hours phone, fax, email, website.
3. **Timezone**, chosen explicitly.
4. Identifiers: HPI-O, Medicare Minor ID.
5. Facilities and accessibility (C2.3, GP5.1): wheelchair access, accessible toilet, parking,
   public transport, hearing loop, treatment room, procedure room, on-site pathology collection.
6. Default fee schedule for the location.
7. Whether the location is the practice's main site.

### Opening hours

Per day of week: open/closed, opening time, closing time, and optional break periods (many
practices close 12:30–14:00). Public holiday behaviour is set per location: `closed`,
`open_normal`, `open_reduced`.

Appointment books cannot be scheduled outside opening hours without an explicit override, and the
override is recorded — this is how "why was someone booked at 7pm on a Sunday" gets answered.

### After-hours arrangements (GP1.3)

Every location must record how patients get care outside opening hours:

| Arrangement | Additional data |
|---|---|
| `own_practitioners` | Roster reference, contact number |
| `cooperative` | Co-op name, contact number |
| `deputising_service` | Service name, contact number, hours covered |
| `hospital_ed_referral` | Named hospital, address |

The recorded text is exactly what is published on the practice information sheet and read out by
the answering message, so it is written once and reused.

### Temporary closures

Public holidays, Christmas shutdowns, renovations. A closure has a date range, a reason, and a
message shown to online bookers. Existing appointments inside the range are surfaced for
rebooking rather than silently cancelled.

## Rules and constraints

1. A practice must have at least one active location.
2. A location cannot be deleted once it has appointments or encounters — it is deactivated, and
   historical records keep pointing at it.
3. Deactivating a location requires resolving future appointments at it first.
4. Changing a location's timezone does not shift existing appointment times; stored times are UTC
   and only the display changes. The UI says so, because this scares people.
5. Every location must record an after-hours arrangement before the practice can be activated with
   "recommended" complete.

## Data touched

`practice_locations`, `location_business_hours`, `location_closures`, `location_facilities`.

## Offline behaviour

Read-only offline (the app needs the current location's hours and timezone to render the book).
Edits are online-only.

## Standards mapping

C1.1 · C2.3 Accessibility of services · GP1.1 Responsive system for patient care ·
GP1.3 Care outside of normal opening hours · GP5.1 Practice facilities

## Feature files

`features/practice-setup/locations.feature`, `features/practice-setup/business-hours.feature`
