# Version 1 scope

## In scope

- multi-practice tenancy, multi-location configuration, practitioners, users, roles and rooms/resources;
- patient search, registration, identity verification, demographics, alerts, representatives, duplicate review, merge lineage, inactive and deceased records;
- practitioner availability, appointment types, calendar, booking, rescheduling, cancellation, arrival, waiting room, consultation and completion states;
- longitudinal clinical record, health summary, notes, problems/diagnoses, allergies/adverse reactions, medications, prescriptions, observations, immunisations and care plans;
- internal pathology/imaging requests, manual/fixture results, result inbox, review, patient notification and follow-up;
- referrals, inbound/outbound correspondence, files and document classification;
- staff tasks, clinical recalls, preventive reminders and appointment reminders as distinct concepts;
- local billing catalogue, fee schedules, private/bulk-billing arrangements, invoices, adjustments, payments, balances and internal claim tracking;
- reporting needed for operational, clinical-safety and financial oversight;
- authentication, granular authorisation, privacy, audit, accessibility, resilience, export and error handling.

## Explicitly out of scope

- every live external integration, including Medicare/Services Australia/PRODA/HPOS, prescription exchanges, My Health Record, AIR, pathology, radiology, secure messaging, booking platforms, payments, accounting, hospitals, pharmacies, identity providers and terminology or prescribing knowledge APIs;
- protocol, message, certificate, vendor or conformance design for those integrations;
- patient portal, consumer app, online self-booking and automated outbound delivery;
- dispensing, pharmacy stock, hospital admission/bed management and specialist-theatre workflows;
- automated diagnosis, dosing, interaction checking or clinical recommendation without a validated maintained knowledge base;
- a universal Australian legal-retention schedule; jurisdiction and organisational policy remain configurable pending legal review;
- implementation technology decisions.

## Version 1 simulation rule

An external-facing concept may be represented internally only when ordinary practice work needs it. A user may manually record an external reference, mark a claim as manually submitted, attach a received result or record that a prescription was printed. The UI MUST label simulated/manual status and MUST NOT imply that an external party received, accepted or paid anything.

## Success boundary

Version 1 is complete when a practice can exercise the core workflows with local/manual data while every safety obligation, state transition and financial consequence remains internally consistent, attributable and testable.
