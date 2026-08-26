# ADR-004: Audit is append-only, least-content and atomic for high-risk mutation

**Status:** accepted  
**Date:** 26 August 2026

## Context

Health information needs controlled access and accountable handling. Audit containing excessive clinical text creates another privacy risk; audit that can be edited or lost during a mutation is not evidence. [RACGP-SGP5, C6.3–C6.4; OAIC-HEALTH]

## Decision

Audit uses immutable events with actor, patient/target, action, time, outcome and necessary reason. High-risk mutation and its required audit commit atomically. Clinical free text and secrets are excluded by default. Audit access is scoped and audited.

## Alternatives considered

- Application logs as audit: rejected because retention, schema and access purpose differ.
- Full before/after record copies: rejected as disproportionate duplication of sensitive data.
- Best-effort asynchronous mutation audit: rejected for high-risk operations; limited read audit may buffer only with loss detection.

## Consequences

Domains still keep semantic history. Implementations need tamper evidence, restricted tooling and failure monitoring. Audit reports must avoid becoming clinical back doors.
