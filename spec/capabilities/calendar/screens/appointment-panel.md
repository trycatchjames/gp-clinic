# Screen contract: Appointment panel

## Purpose

Shows enough detail and history to coordinate one appointment and offers only valid next actions.

## Required information

Patient/hold identity and status; three-identifier verification state (not the identifiers spoken aloud); date/start/duration/timezone; practitioner/location/type/mode/resources; current state and actual transition times; reception-safe notes/flags; linked recall indicator without protected reason; created/last changed metadata and reschedule/cancel history; nearby/future bookings warning.

## Actions

Edit allowed fields, move, cancel, arrive, waiting-flow change, DNA, start consultation, billing handoff open, copy a new booking, open permitted patient view. Invalid transitions are absent or disabled with reason—not offered to fail mysteriously.

## States/failure

Loading retains selected card highlight. If deleted-like correction/merge redirect occurred, show historical status/redirect. Concurrent change displays latest committed version and preserves any local edit in the editor. Save/cancel confirmation names the appointment and consequence.

## Privacy

Clinical reason/results/recall details never appear merely because a recall is linked. Contact details are masked until needed and permitted.
