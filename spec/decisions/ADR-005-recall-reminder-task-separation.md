# ADR-005: Recall, preventive reminder, appointment reminder and task are separate

**Status:** accepted  
**Date:** 26 August 2026

## Context

RACGP follow-up guidance distinguishes active pursuit of clinically significant results from preventive reminders whose non-response need not be followed. Vendor terminology varies and may use “reminder” broadly. A generic to-do cannot express clinical closure responsibility. [RACGP-SGP5, GP2.2; BP-REMINDERS]

## Decision

Recall owns the clinical pursuit obligation and clinician closure. Preventive Reminder owns routine due prompts. Appointment Reminder communicates an existing booking. Task coordinates assigned staff work. Links are explicit; completion never cascades by inference.

## Alternatives considered

- One configurable activity entity: rejected because status/permissions/closure invariants become optional metadata.
- Recall as appointment type: rejected because cancellation/DNA must leave the obligation open.
- Task as source of truth: rejected because administrative completion could falsely close clinical responsibility.

## Consequences

Unified worklists are read models only. Migration must map source meaning carefully. UI terminology needs explanation during onboarding.
