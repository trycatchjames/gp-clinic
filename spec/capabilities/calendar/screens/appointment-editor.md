# Screen contract: Appointment editor

## Purpose and entry

Creates or proposes changes to an appointment. Entry from an empty slot pre-fills location/practitioner/date/time; entry from a card pre-fills committed values and expected version.

## Regions and fields

1. Patient/hold selection with embedded patient search and “register provisional” permission path.
2. Schedule: location, practitioner, date, start, duration/end and timezone.
3. Type/mode/resources: defaults visibly applied and editable within policy.
4. Operational detail: reception-safe booking reason/note, add-on/urgency/recall association.
5. Optional recurrence: finite pattern/end, occurrence preview and per-occurrence conflicts.
6. Validation/conflicts and cost/booking-policy information where configured.
7. Save/cancel actions with dirty/save state.

Patient, practitioner, location, start and positive duration are required for patient booking; structured purpose replaces patient for a hold. Changing type may propose duration/resource changes but never overwrites user changes without confirmation.

Recurring save creates separate occurrences and returns itemised conflicts before commit. Editing a series requires an explicit scope: this occurrence or this-and-future. Past/completed occurrences are immutable to the series edit.

## Behaviour

Patient candidates show distinguishing identity and require deliberate selection. Duplicate/future appointment warnings are non-destructive. Save rechecks all rules. Closing a dirty editor prompts keep editing/discard; autosaved draft is never shown on calendar as a booking.

## Failure/accessibility

Field validation is inline and summarised; conflict focuses the explanation, not the underlying page. Keyboard order follows regions, date/time inputs use Australian parsing, and a non-drag reschedule is complete.
