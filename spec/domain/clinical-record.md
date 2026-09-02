# Clinical record

## Purpose

The clinical record is the authoritative longitudinal composition of health information held by the practice for a patient. It is a view across owned clinical domains, not a mutable monolithic object.

## Required composition

- patient identity/banner and alerts appropriate to the viewer;
- current health summary: allergies/adverse reactions, current medicines, active problems, relevant past history, key observations and immunisation context;
- encounters and clinical communications;
- investigations/results and their review/follow-up status;
- referrals, documents and correspondence;
- recalls, clinical tasks and care-plan obligations;
- provenance, authorship, effective/recorded times and amendments.

RACGP requires an individual record containing all practice-held health information, consultation/clinical communication content and documented follow-up. [RACGP-SGP5, C7.1]

## Record entry model

Every clinical entry has a stable identifier, patient, owning domain/type, author, recorder if different, clinical effective time, recorded time, status, source/provenance, encounter link where applicable, sensitivity classification, version and amendment lineage.

## Rules

- Summary is derived from active domain records and must expose when information is unassessed, uncertain, historical or entered by another source.
- Timeline ordering uses clinical effective time while visibly retaining recorded time for late entries.
- Reception-safe views expose only operational alerts and minimum identity/contact information.
- Clinical record access and sensitive-entry access are audited under [`../../cross-cutting/audit/requirements.md`](../cross-cutting/audit/requirements.md).
- Export produces an attributable snapshot and must support redaction/third-party review workflow; it is not an unlogged database dump.

## Clinical-record invariants

1. A completed/signed clinical entry is never overwritten or hard-deleted through normal operation.
2. Correction is an additive, dated, authored amendment that leaves the original intelligible. [MBA-GMP; AVANT-RECORDS]
3. Entered-in-error status hides an item from ordinary current summary only after privileged reasoned action; history and audit remain visible to authorised reviewers.
4. Authorship, clinical effective time, recorded time and provenance cannot be removed by amendment.
5. “No known allergy”, “no current medication” and “no active problem” are assessed statements with actor/time, not defaults inferred from an empty list.
6. Data imported or manually transcribed retains source and must not appear clinician-authored unless the clinician explicitly verifies it.
7. A late entry is marked as late and records both event time and entry time.
8. Every clinically related communication retained by the practice is linkable in the patient record.
9. Patient merge changes retrieval linkage, not original record authorship, times or source identifiers.
10. A failed mutation leaves no UI state that implies the record was committed.
11. Audit/history is not editable by ordinary clinical or administrative permissions.
12. Sensitive classification can restrict content, but emergency/break-glass use and safety summary behaviour are explicit and audited.
