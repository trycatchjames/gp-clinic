# Patient registration and identity management

## Dependencies

- Domains: [patient](../../domain/patient/overview.md), [practice](../../domain/practice/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Receptionists, nurses and authorised managers create/maintain a safe, respectful patient identity and resolve lifecycle/duplicate issues.

## Primary tasks

Search before create; register full or provisional patient; record names, DOB precision, contacts/address, self-described demographic/cultural attributes, Medicare/concession facts, safe contact and representatives; activate/inactivate/deceased-correct; review potential duplicates and merge with privilege.

## Inputs and outputs

Consumes privacy notice/policy, canonical identifiers, user permission and duplicate candidates. Creates/updates Patient, contact/representative facts, verification history, alerts and merge lineage.

## Constraints

No Medicare requirement; no forced binary gender; private optional collection; approved-identifier verification; change history; two-person/high-risk merge confirmation; open appointments/obligations considered before lifecycle change.

## Out of scope

External Medicare/IHI verification, patient self-service portal and cross-practice master patient index.

## Rules

- Search-before-create and save-time duplicate check are mandatory.
- Requiredness supports provisional/unknown/estimated states; no Medicare or binary identity assumption.
- Names used, legal/previous names, sex assigned at birth, gender and pronouns are independent.
- Aboriginal and/or Torres Strait Islander status, cultural background and other sensitive demographics are self-described, optional where lawful and privately collectable.
- Contact points record purpose/preferences/safe-to-use separately from message-purpose consent.
- Representative authority records evidence, scope and expiry; kinship alone is insufficient.
- Inactivation/deceased/merge previews open appointments, clinical obligations and routine communications.
- Merge is atomic, lineage-preserving and second-person confirmed.

## Interactions

Registration can be launched from search or booking and returns to the initiating task with the committed patient only. Potential duplicates can be deferred to a governed queue while a provisional record is used, but both records are visibly flagged. Demographic change can invalidate a contact method or reminder destination and triggers review rather than retroactive rewriting. Deceased marking suppresses future routine reminders/appointments and creates clinician review for open results/recalls; it never closes them.

## Permissions

Registration and demographic edit use `patient.demographics.edit`; representative authority and lifecycle use separate permissions. Duplicate comparison requires access to each displayed data class, and merge requires `patient.merge`, elevated confirmation and a second authorised reviewer. Clinical conflicts require a clinical reviewer. No receptionist role grants clinical content by implication.

## Screen contracts

### Screen contract: Duplicate review and merge

#### Purpose

Lets a privileged reviewer compare potential duplicate patient identities, choose “not duplicates” or perform a safe lineage-preserving merge.

#### Layout and information

Side-by-side identity/contact/demographic/provenance comparison; record status; counts and date ranges for appointments, encounters, allergies, medications, results, recalls, documents, invoices and restrictions; conflicting high-risk summary facts; candidate match reasons; proposed survivor and field resolution; downstream impact/redirect; second-person confirmation.

Clinical content is shown only to reviewers with corresponding access; otherwise a clinician reviewer is required. Merge must never expose one record to a purely administrative reviewer through comparison counts/content beyond permission.

#### Actions

Mark not duplicates with reason; defer/assign review; choose survivor; resolve safe demographic fields or keep both sources; acknowledge unresolved clinical conflicts; run preview; confirm merge. No automatic “best record” selection.

#### States/failure

Loading keeps both IDs visible; changed-version conflict forces a refreshed preview. Merge is atomic. Failure leaves both records separate and active as before. Success shows survivor, merged source IDs and audit reference; ordinary search redirects source safely.

#### Safety

Patient names/DOBs and restriction status remain pinned. Merge requires `patient.merge`, reauthentication or equivalent elevated confirmation, reason, and second authorised person. Unmerge is not offered in ordinary UI.

### Screen contract: Patient registration

#### Purpose and actors

Allows authorised staff to create a full or explicitly provisional patient record with safe identity, communication and privacy context.

#### Entry points and regions

Patient-search no-match path or appointment editor. Regions: duplicate review banner; identity/names/DOB; contact/address; sex/gender/pronouns and culturally relevant information in a privacy-respecting section; next of kin/emergency contact/representative; Medicare/concession/payer facts; language/interpreter; communication safety/consent; privacy notice; review/save.

#### Required/optional semantics

The practice defines a minimal ordinary registration set (normally name used/legal identity as available, DOB/precision, and a contact/address path), but a privileged provisional workflow can record unknown/incomplete values with reason. Medicare, mobile, email, binary gender, exact DOB and fixed address are never universal requirements. Optional sensitive questions include purpose and prefer-not-to-say where appropriate.

#### Interaction

Before first entry and again on save, duplicate candidates are searched from supplied facts. Selecting a candidate returns to it without creating. Save shows a human-readable identity summary; success opens the new record/booking flow with its immutable ID. Concurrent same-person registration produces potential-duplicate review, not automatic merge.

#### States/failure

Draft input survives validation/infrastructure failure and is clearly uncommitted. Privacy-sensitive fields can be completed away from reception. Field errors do not clear other sections. A failed save cannot yield a usable-looking patient number.

#### Permissions

Separate permissions govern registration/edit, representative authority, lifecycle and merge. Staff see only the fields required for their role.
