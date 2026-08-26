# Medication lifecycle

`proposed → active → ceased|completed|on_hold → active`; any state may become `entered_in_error` by authorised correction.

- `proposed`: suggested/imported and not confirmed current.
- `active`: recorded as currently taken/intended.
- `on_hold`: temporarily paused, with reason and review date where known.
- `completed`: finite course recorded complete.
- `ceased`: intentionally stopped.

Transitions retain actor, date, clinical reason and source. Time passing never automatically completes a course without an explicit rule reviewed for safety; Version 1 defaults to manual confirmation.
