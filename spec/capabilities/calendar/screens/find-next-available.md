# Screen contract: Find next available

## Purpose

Finds explainable candidate slots matching patient/practice constraints without claiming a reservation.

## Inputs

Location(s), practitioner(s)/first available, appointment type/duration, earliest date/time, date range, visit mode and required resource. Patient is optional until booking but may supply practitioner/recall context.

## Results

Each result shows date in Australian format, local time/timezone, practitioner, location, duration/type fit and any policy caveat. Group by earliest time; do not rank on hidden clinical criteria. Show the exact search filters/range and a “searched through” empty result.

## Interaction/failure

Selecting opens Appointment Editor with the slot proposal. Saving revalidates; if taken, retain patient/editor details and offer refreshed nearby alternatives. Partial location/practitioner failures are named and excluded, not treated as no availability.
