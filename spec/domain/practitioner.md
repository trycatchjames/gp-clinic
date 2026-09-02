# Practitioner

## Purpose and attributes

A Practitioner is a person who provides care. It is distinct from User (who signs in) and from role/membership (what a user may do). Core attributes include name used and legal name, practitioner type/profession, registration/credential facts and validity dates, prescriber/provider identifiers where applicable, specialties/interests, appointment-book eligibility, active dates, locations, and a link to zero or one user.

A practitioner may hold a provider number per practice location; Services Australia instructs use of the provider number for the location where the service was rendered. [SA-MBS-BILLING]

## Relationships and rules

- Practitioner belongs to a practice and may practise at many locations through PractitionerLocation.
- Practitioner has availability, appointments, encounters, authored entries, responsibilities and billing attributions.
- PractitionerLocation owns location-specific operational/billing identifiers and effective dates.
- A user link does not grant access; membership and permissions do.
- A practitioner can exist without login (for historical authorship or directory purposes), and a user can exist without being a practitioner.
- Scope, prescribing authority, supervision and billing eligibility are separately represented. Practitioner type alone does not grant them.

## Invariants

1. Historical authorship remains linked after a practitioner leaves.
2. A location-specific identifier cannot be selected outside its effective location/date.
3. Deactivation cannot complete while open owned results, recalls, tasks, draft encounters or future appointments are unreviewed.
4. Credential expiry creates a visible restriction according to configured policy; it never silently rewrites past work.
5. A delegated covering practitioner is recorded as responsible without changing the original order/author.
6. The system never permits one practitioner to issue under another practitioner's prescribing identity.
