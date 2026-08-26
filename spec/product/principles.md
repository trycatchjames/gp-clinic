# Product principles

1. **Clinically safe by default.** Prevent wrong-patient and wrong-context action, surface verified allergy and follow-up information, and require deliberate override where a safe hard stop is impossible.
2. **Fast at the point of care.** Common consultation actions must be available without leaving patient context or traversing configuration screens.
3. **Reception is a first-class workflow.** Scheduling, identity checking, arrivals, waiting, calls and billing are high-throughput coordinated work, not simple CRUD.
4. **Information-dense, not indiscriminate.** Show decision-relevant summary first; make provenance and detail available on demand.
5. **Clear system state.** Selected patient, location, practitioner, date, record status, save status and queue responsibility must not be inferred.
6. **Never silently lose clinical information.** Draft recovery, explicit save outcomes and conflict handling are mandatory.
7. **Preserve the record.** Completed clinical entries are amended by attributable additions; they are not rewritten to erase history.
8. **Permission follows authority and scope.** Capabilities check granular permissions and care relationships, not job-title strings alone.
9. **Explicit destructive actions.** Consequences, affected records and alternatives are shown before confirmation; clinical deletion is tightly constrained.
10. **Audit important access and change.** Auditability is part of the operation, not an afterthought.
11. **Predictable and keyboard-friendly.** Similar actions behave alike. Keyboard flows cover repeat, high-volume work without hidden arbitrary shortcuts.
12. **Multi-practitioner and multi-location by design.** Timezone, provider-at-location, resources and delegated responsibility are never treated as singletons.
13. **Minimise duplicate entry.** Reuse verified internal information with provenance, but never propagate stale or incorrect data silently.
14. **No unsupported clinical intelligence.** Version 1 may present recorded facts and user-authored warnings; it must not invent diagnosis, interaction or dosing advice without a validated knowledge source.
15. **External systems remain outside the core.** Internal clinical and financial work is complete and testable without any external service.
