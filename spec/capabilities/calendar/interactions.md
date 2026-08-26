# Calendar interactions

## Book from an empty slot

Activating an empty bookable slot opens the appointment editor prefilled with selected location, practitioner, date and start. Appointment type sets a default duration/resources but the user sees and may alter allowed fields. Patient search occurs inside the editor. Save runs conflict validation; success inserts the committed appointment and focuses it, while failure preserves the editor and calendar.

## Open and act

Selecting a card opens the appointment panel without navigating away. It shows identity, schedule, status history, reception-safe note, future/nearby bookings and permitted next actions. Opening the full patient administrative/clinical record is a separate permission-aware action.

## Reschedule

Drag or “Move” changes a proposal only. The target interval is highlighted with availability/conflict explanation. Drop/confirm opens a concise review when practitioner/location/date or conflict changes. Successful save records old/new schedule. Failure snaps visually to the committed slot and explains why; it never duplicates the appointment.

## Arrival and waiting

Mark Arrived prompts/records required identity verification and actual arrival. The appointment appears in waiting-room read model. Starting consultation is a clinical action and creates/links an encounter. Completion may move to billing handoff only after encounter completion succeeds.

## Multiple edits

If another user changes the selected appointment, the panel shows a version-conflict banner and refresh option while preserving any unsaved editor input. Calendar live updates never steal focus or close an editor.
