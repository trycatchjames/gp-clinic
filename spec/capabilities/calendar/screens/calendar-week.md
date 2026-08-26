# Screen contract: Practitioner week

## Purpose and actors

Helps reception/practitioners assess one practitioner's capacity and future appointments across a week, and find/move bookings without pretending a multi-practitioner week is readable.

## Layout and required information

Header shows location, practitioner, week range/timezone and navigation. Columns are Monday–Sunday according to configured visible days; time rows show sessions, exceptions, blocks, current time and appointment cards with the day-card minimum. Summary counts never replace spatial duration.

## Actions

Filter appointment type/status, book from slot, open/move/cancel permitted appointment, navigate day detail and find next available. Changing practitioner preserves week/location when valid.

## States and failure

Closed days visibly say closed; no practitioner availability is distinct from no appointments. Partial-day load failure is labelled and not bookable. Dense overlap offers an accessible chronological list for the selected day.

## Permissions/accessibility

Same as day view. Keyboard movement announces day, time and availability. There is no month-view booking contract in Version 1.
