# Appointment Types, Books and Session Templates

**Status:** `built`

## Purpose

Define what can be booked, for how long, with whom, and what it will probably be billed as. This
is where scheduling and billing are wired together — the appointment type carries a default MBS
item suggestion so that billing at the end of the consultation is one click, not a lookup.

## Who does it

Practice Manager or Practice Owner.

## The workflow

### Appointment types

Each type has: name, short code, default duration, colour, description shown to online bookers,
which practitioner kinds may be booked into it, whether it is online-bookable, whether it requires
a specific practitioner competency, and a **default MBS item**.

Seeded defaults are listed in
[01-practice-registration-and-onboarding.md](01-practice-registration-and-onboarding.md#step-6--appointment-types-and-books).

Rules a type can carry:

- `min_notice_minutes` for online booking (e.g. no online bookings within 2 hours)
- `max_advance_days` (e.g. no online bookings more than 90 days out)
- `new_patients_allowed`
- `requires_triage_prompt` — presents the red-flag prompt to reception at booking
- `double_booking_allowed`

### Session templates

A practitioner's recurring availability at a location: day of week, start, end, appointment types
allowed in that session, slot size, and whether the session is online-bookable.

A session is not a list of pre-cut slots — it is a window with a slot size, so a 30-minute
appointment consumes two 15-minute slots. This keeps double-booking and overrun handling sane.

### Session overrides

Leave, conference, public holiday, an extra Saturday morning. An override either removes
availability or adds it, for a date range, with a reason. Removing availability that already has
appointments in it surfaces them for rebooking.

### Book display configuration

Per location: which practitioners appear in the book by default, column order, day/week view
default, slot height, and whether nurse and GP books are shown side-by-side.

## Rules and constraints

1. Appointment types are practice-scoped and shared across locations; availability is
   location-scoped.
2. Deleting a type in use deactivates rather than deletes it.
3. A session cannot extend outside the location's opening hours without an override.
4. Slot size must divide evenly into the session length.
5. The default MBS item on a type is a *suggestion only*. It never bills automatically — the
   practitioner confirms at the point of billing, because billing an item not clinically supported
   is a compliance breach and the software must not nudge people into one.

## Data touched

`appointment_types`, `session_templates`, `session_overrides`, `location_book_settings`.

## Offline behaviour

Read-only offline — the appointment book needs types and availability to render and to allow
offline booking.

## Standards mapping

GP1.1 Responsive system for patient care · C1.5 Costs associated with care initiated by the
practice

## Feature files

`features/practice-setup/appointment-types.feature`,
`features/practice-setup/session-templates.feature`
