# ADR-001: Separate appointment flow from encounter and billing state

**Status:** accepted  
**Date:** 26 August 2026

## Context

Australian products commonly move a booking through booked/arrived/waiting/with practitioner/billing states, but accreditation guidance does not prescribe an enum. Treating the appointment as the consultation or invoice creates false completion and makes preview/add-on care unsafe. [BP-WAITING; BP-VISIT; MD-APPTS]

## Decision

Appointment owns reservation and operational flow with canonical states in [`../domain/appointment.md`](../domain/appointment.md). Encounter and Invoice have independent lifecycles linked by explicit transitions. Reschedule is history, not a terminal current state.

## Alternatives considered

- One universal visit state: rejected because clinical, reception and financial completion differ.
- Practice-defined arbitrary states only: rejected because permissions, analytics and acceptance need stable semantics.
- Derive status from timestamps: rejected because ambiguity and corrections require explicit user intent.

## Consequences

UI may show a combined journey but commands route to owners. Configuration may rename display labels, not semantic values. Cross-domain transitions need atomic orchestration and failure handling.
