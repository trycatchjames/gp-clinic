# Screen contract: Patient registration

## Purpose and actors

Allows authorised staff to create a full or explicitly provisional patient record with safe identity, communication and privacy context.

## Entry points and regions

Patient-search no-match path or appointment editor. Regions: duplicate review banner; identity/names/DOB; contact/address; sex/gender/pronouns and culturally relevant information in a privacy-respecting section; next of kin/emergency contact/representative; Medicare/concession/payer facts; language/interpreter; communication safety/consent; privacy notice; review/save.

## Required/optional semantics

The practice defines a minimal ordinary registration set (normally name used/legal identity as available, DOB/precision, and a contact/address path), but a privileged provisional workflow can record unknown/incomplete values with reason. Medicare, mobile, email, binary gender, exact DOB and fixed address are never universal requirements. Optional sensitive questions include purpose and prefer-not-to-say where appropriate.

## Interaction

Before first entry and again on save, duplicate candidates are searched from supplied facts. Selecting a candidate returns to it without creating. Save shows a human-readable identity summary; success opens the new record/booking flow with its immutable ID. Concurrent same-person registration produces potential-duplicate review, not automatic merge.

## States/failure

Draft input survives validation/infrastructure failure and is clearly uncommitted. Privacy-sensitive fields can be completed away from reception. Field errors do not clear other sections. A failed save cannot yield a usable-looking patient number.

## Permissions

Separate permissions govern registration/edit, representative authority, lifecycle and merge. Staff see only the fields required for their role.
