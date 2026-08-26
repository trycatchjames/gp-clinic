# Appointment-management rules

- Create/reschedule validates patient/hold, practitioner, location, start/duration, availability, resource and conflict policy in one commit.
- Type defaults are proposals; changing type never silently overwrites a user-set duration/resource.
- Arrival records that identity was verified using the practice's approved three-identifier process; it does not store secrets or require Medicare.
- Cancellation reason/category and actor are retained. DNA eligibility follows policy and is never inferred merely from elapsed time.
- Overbook/add-on requires policy, permission and reason and remains visibly flagged.
- Appointment history is never deleted by reschedule/cancel/DNA/entered-in-error.
- Recall association survives appointment changes; only clinical recall closure resolves the obligation.
- A recurring booking is finite and previewed with every occurrence/conflict before commit. The user explicitly chooses one occurrence or this-and-future for later edits; completed/past occurrences never move with a series edit.
