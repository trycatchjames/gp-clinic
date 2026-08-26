# Screen contract: Calendar day

## Purpose and actors

Helps reception and clinical staff answer: who is booked, what capacity exists, who has arrived/waited, and what action is next for one day.

## Entry points

Primary navigation, waiting room return, patient future appointment, find-next-available result and appointment link.

## Layout regions

1. Context header: location, working date, today, timezone and refresh/freshness.
2. Filters: practitioner/group, appointment type/status and optional resource.
3. Practitioner headers: name used, working/absence indicator and book visibility.
4. Time grid: labelled intervals, session/blocked/unavailable backgrounds, current-time marker and appointment cards.
5. Appointment/context panel: selection details and actions.

## Required information

Grid/card requirements are in [`../rules.md`](../rules.md). Practitioner header must show when no session, on leave or partially unavailable. Current date/time and selected slot/card are unambiguous. Location/timezone remain visible during actions.

## Actions and behaviour

Navigate previous/next/today or choose date; add from slot; open; move; resize only through an explicit duration proposal; cancel; arrive; DNA; start consultation when authorised; open patient; add block when authorised. Filters do not mutate. Scroll position/focus remain stable on background refresh.

## Screen states

- **initial/loading:** skeleton retains grid geometry and labelled context; actions disabled until conflicts can be checked;
- **empty:** sessions and bookable slots remain, with “no appointments” not “no availability”;
- **populated/busy:** overlapping permitted appointments render side-by-side/stacked with accessible list alternative;
- **partial failure:** failed practitioner column is marked unavailable/stale; unsafe mutations for it disabled;
- **full failure:** no empty-looking calendar; explicit failure/retry and last-known data labelled read-only if shown;
- **no permission/no location:** explain unavailable scope without patient data.

## Visual/accessibility semantics

Duration is spatially proportional within the visible scale. Availability, appointment status and warnings are not colour-only. Grid cells/cards have accessible names including date/time/practitioner/status. Drag has menu/keyboard equivalent.

## Failure behaviour

Editor input is preserved. Conflict names current blocking interval/resource and offers refresh or authorised override. Success toast/message names patient, time, practitioner and action.
