# ADR-003: Internal patient identity is independent of Medicare and uses active verification

**Status:** accepted  
**Date:** 26 August 2026

## Context

RACGP C6.1 requires patients to state three approved identifiers and explicitly excludes Medicare number as an approved identifier because people may not have one and families may share card numbers. Practices also need provisional, newborn, anonymous/pseudonymous and non-Medicare patients. [RACGP-SGP5]

## Decision

Each patient has an opaque internal ID and unique practice record number. Search may use Medicare/other identifiers, but identity verification records three approved identifiers. Registration searches for duplicates; merge is privileged and lineage-preserving. Separate sex/gender/name-used fields avoid identity and care errors. [RACGP-SEX-GENDER]

## Alternatives considered

- Medicare number as key: rejected for safety, coverage and shared-card reasons.
- Name plus DOB unique key: rejected due to collisions, changes and incomplete/estimated facts.
- Automatic fuzzy merge: rejected because a false merge is a high-severity wrong-patient event.

## Consequences

Duplicate candidates and restricted records require careful search UX. External identifiers are optional provenance-bearing attributes. Merge needs cross-domain orchestration and audit.
