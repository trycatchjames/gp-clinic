# Problem and diagnosis

## Purpose

A Diagnosis records a clinician's assessment in an encounter. A Problem represents a longitudinal health issue considered relevant to ongoing care. They may link but are not interchangeable.

## Attributes and relationships

Problem: patient, authored description, optional code/system/version, clinical status (`active`, `inactive`, `resolved`, `entered_in_error`), verification/certainty, onset/abatement dates with precision, significance/display priority, author/source and supporting encounters. Diagnosis: encounter, assessment text/code, certainty and author.

## Rules and invariants

- Adding a diagnosis does not silently create an active problem; promotion is explicit or a clearly confirmed combined action.
- A problem may be free text when no suitable maintained local code exists; coding provenance is retained.
- Resolution means no longer active, not deletion or proof of cure. Reactivation preserves earlier episodes.
- `entered_in_error` requires clinical permission/reason and preserves history.
- Problem summary shows certainty and status; suspected/provisional items cannot appear equivalent to confirmed diagnoses.
- Changing a terminology display does not rewrite the clinician's original text or historical code/version.
- Administrative staff cannot add, resolve or recode clinical problems.
