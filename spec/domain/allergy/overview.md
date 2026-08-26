# Allergy and adverse reaction

## Purpose

This domain represents reported or observed allergies and adverse reactions so clinicians can assess medicine and care risk. It does not provide an automated clinical interaction knowledge base.

## Core attributes

- category (`allergy`, `adverse_reaction`, `intolerance`, `uncertain`);
- substance/agent text and optional local coded identity/version;
- one or more reaction manifestations, severity, onset/date precision and notes;
- verification/certainty and source (patient, carer, practitioner, external document);
- status (`active`, `inactive`, `resolved`, `entered_in_error`), author/reviewer and review time;
- evidence/related encounter and sensitivity flag.

The domain also represents an assessment statement: `not_assessed`, `asked_none_known`, or `known_reactions_present` with actor/time.

## Rules

- Allergy/ADR information is immediately visible in clinical patient context and while authoring a prescription. [RACGP-SGP5, QI2.1; ACSQHC-MEDICATION]
- “None known” requires an explicit assessment; an empty list means not assessed.
- Free text remains available for unknown substances/reactions but is visibly uncoded.
- The system may warn on an exact locally linked substance only if the maintained local relationship is known; Version 1 MUST NOT claim class/ingredient/interaction checking from unsupported inference.
- An authorised prescriber can proceed after reviewing an allergy warning only through a reasoned, auditable override; the record is not altered by the override.
- Reception has no access to clinical reaction content by default.

## Invariants

1. Every recorded reaction has an agent description, status, source and author/recorder.
2. “Asked; none known” cannot coexist as the current assessment with an active known reaction.
3. Deactivation/resolution/entered-in-error never removes the historical reaction.
4. Severity and certainty are not inferred from reaction text.
5. A prescription issue flow always receives the current allergy assessment state and active reactions, including “not assessed”.
