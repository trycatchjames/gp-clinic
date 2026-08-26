# ADR-002: Completed clinical records are amended additively

**Status:** accepted  
**Date:** 26 August 2026

## Context

Australian professional guidance requires accurate, timely records and dates additions/changes. Continuity and medico-legal integrity require the original to remain intelligible. [MBA-GMP; RACGP-RECORDS; AVANT-RECORDS]

## Decision

Draft clinical content is editable. Completion fixes an authored version. Later correction/addition creates a timestamped amendment linked to the original. Entered-in-error status suppresses ordinary current use but retains the source and reason. Issued artefacts are versioned/superseded, never regenerated in place.

## Alternatives considered

- Edit in place with an audit diff: rejected because ordinary views/exports can conceal the original and downstream artefacts drift.
- Make all entries immutable from first keystroke: rejected because clinicians need drafts and correction before signing.
- Permit clinical delete by practice manager: rejected because administrative authority is not clinical correction authority.

## Consequences

Timeline/export must present amendment lineage clearly. Summaries derive current meaning while retaining history. Storage and migration must preserve every version.
