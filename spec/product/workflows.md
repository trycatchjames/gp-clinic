# End-to-end workflows

## Routine booked consultation

1. Reception searches before creating a patient or appointment and verifies the patient using approved identifiers.
2. An appointment is booked against location, practitioner, type, start and duration after availability/conflict checks.
3. On attendance, reception re-verifies identity, confirms contact details and marks the appointment arrived.
4. The practitioner starts the consultation from the waiting room; the system binds patient, practitioner, location and appointment context.
5. The practitioner reviews the health summary and open obligations, records the consultation and creates any problems, observations, medicines, prescriptions, investigations, referrals, recalls or tasks.
6. Completion validates unresolved safety-relevant items, fixes authorship/time, advances the appointment and exposes billing instructions without exposing clinical notes to reception.
7. Reception finalises the internal invoice/payment workflow. Later clinical work remains assigned and visible.

## Unplanned/add-on care

An authorised user may create an urgent/add-on appointment or start an unbooked encounter. The reason, actor and conflict override are recorded. Urgency is a workflow flag set according to practice policy; the software does not make a clinical triage decision.

## Investigation to result closure

The clinician records a request with indication, requested tests, responsible practitioner and intended follow-up. A result is manually created/received in Version 1, matched to patient/request and assigned. A clinician reviews and records a disposition. Any required contact, recall, task or referral is created atomically. A result is not “done” merely because it was opened.

## Recall and preventive reminder

A recall tracks a clinical obligation, contact attempts, bookings and clinical closure. A cancelled or missed recall-related appointment leaves the recall open. A preventive reminder records that a routine prompt was offered and may recur; failure to respond does not silently convert it into a recall. [RACGP-SGP5, GP2.2]

## Practitioner absence or departure

Open appointments, results, recalls, tasks, draft notes and other responsibilities are enumerated before absence cover or deactivation. Each is reassigned or explicitly accepted into a governed team queue. Account deactivation cannot orphan clinical obligations.

## Patient correction, inactivation or merge

Administrative facts can be updated with history. Completed clinical entries use an amendment. Inactivation/deceased status preserves the record and changes operational behaviour. Duplicate merge is a privileged, previewable, reversible-by-support lineage operation that produces one surviving patient identity without rewriting historical authorship.
