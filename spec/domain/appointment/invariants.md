# Appointment invariants

1. An appointment has exactly one start instant, one positive duration, one practitioner and one location.
2. A patient appointment has exactly one patient. A non-patient hold has a structured hold purpose and no invented patient.
3. An appointment interval is interpreted in its location timezone and stored as an unambiguous instant range.
4. Two active appointments cannot occupy a hard-exclusive practitioner/resource interval unless an authorised, reasoned overbook policy allows it.
5. Cancelled, did-not-attend and entered-in-error appointments are retained and excluded from active capacity calculations according to their state.
6. Rescheduling never erases the preceding schedule; actor, time, old/new values and reason are auditable.
7. Appointment state cannot be used as proof that clinical documentation or billing is complete.
8. Arrival, consultation-start and completion timestamps reflect actual transitions, not scheduled time.
9. A completed appointment cannot be dragged or casually edited; correction requires a privileged reasoned operation and cannot alter linked clinical history.
10. A failure to save a booking or reschedule leaves the original calendar unchanged.
11. A patient cannot be marked DNA before the appointment's configured eligibility time without an authorised exception.
12. Cancelling or marking DNA on an appointment linked to an open recall leaves the recall open and emits a follow-up signal.
13. Every recurring occurrence is a first-class appointment. The series rule cannot be used to reconstruct and overwrite historical occurrences.
