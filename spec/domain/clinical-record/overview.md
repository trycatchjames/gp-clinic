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
- Clinical record access and sensitive-entry access are audited under [`../../cross-cutting/audit/requirements.md`](../../cross-cutting/audit/requirements.md).
- Export produces an attributable snapshot and must support redaction/third-party review workflow; it is not an unlogged database dump.
