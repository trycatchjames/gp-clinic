# Appointment-management interactions

Booking may begin in Calendar or Patient Record and returns the committed appointment. Patient registration can return a new provisional/active patient to the same editor without losing slot context. Arrival adds the patient to Waiting Room. Start Consultation creates/links Encounter only after clinical context checks. Successful Encounter completion advances to billing handoff or completed according to policy. Billing failure leaves the appointment at billing, not clinically in consultation.

Cancellation/reschedule may make a previously recorded appointment-reminder attempt stale; Version 1 records the need but does not send an external update. A linked recall/task receives an event and remains independently open.
