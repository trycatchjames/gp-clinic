# Practice

## Purpose

Practice is the tenant, governance and data-ownership boundary. It represents the organisation responsible for operating one or more locations and maintaining the patient records held in the system.

## Core attributes and relationships

Legal/trading names, ABN where held, contact details, default timezone, lifecycle status, privacy/security policies, jurisdiction configuration, numbering sequences and nominated governance roles. A practice owns locations, patients, memberships, practitioners, appointment types, fee schedules, local catalogues, templates and audit records.

## Rules and invariants

- Every operational and patient record belongs to exactly one practice; cross-practice access requires an explicit separate membership and never occurs by identifier guessing.
- A practice has at least one active location before routine bookings can be created.
- Practice suspension blocks new ordinary mutations but preserves emergency read access according to continuity policy and preserves audit.
- Legal/business identifiers do not serve as technical tenant identifiers.
- Policy configuration can strengthen but cannot weaken hard clinical-record, audit, identity or privacy invariants.
- Practice ownership transfer or closure requires an export/retention plan; data is not destroyed by account cancellation.
