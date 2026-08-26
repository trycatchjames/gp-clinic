# ADR-006: Version 1 core is complete without external integrations

**Status:** accepted  
**Date:** 26 August 2026

## Context

Australian GP work involves Medicare, e-prescribing, AIR, My Health Record, pathology/radiology and secure messaging. Binding core state to those systems before stable internal ownership makes outages and vendor protocols define patient care.

## Decision

Version 1 stores internal concepts and immutable issue/receipt snapshots. External-facing actions are manual/fixture and explicitly labelled. Future adapters consume/produce versioned envelopes and delivery/outcome facts but never directly own core clinical/financial state.

## Alternatives considered

- Specify integrations now: rejected by Version 1 scope and because each requires separate conformance/safety research.
- Omit external-facing concepts entirely: rejected because clinicians still create prescriptions, requests, referrals, invoices and claims internally.
- Pretend manual action is external success: rejected as operationally and clinically misleading.

## Consequences

Every screen separates authored/prepared, manually attempted, delivered-recorded and accepted/paid states. Future integration work requires new specifications and ADRs.
