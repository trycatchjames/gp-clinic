# Clinical-safety principles

## Safety case expectations

Every material feature change identifies hazards, controls, residual risks and evidence. At minimum consider wrong patient, wrong practitioner/location, missing/stale summary, incomplete save, responsibility orphaning, ambiguous state, inappropriate permission, destructive correction and misleading external-status claims.

## System rules

- Maintain persistent patient/practitioner/location context on clinical screens and re-confirm identity at high-risk transitions.
- Make unknown/unassessed states explicit; absence of data is not negative evidence.
- Separate source data, user interpretation and system-computed status.
- Preserve original clinical information and provenance; corrections are additive.
- Do not infer clinical decisions from administrative events or time passing.
- Never permit a queue item or responsibility to disappear without an accountable destination/outcome.
- Use hard stops only for invariant/legal/identity failures; use warnings with reasoned override for context-dependent risk.
- A warning's severity, trigger, evidence and override rules are versioned and reviewable.
- Version 1 does not provide diagnosis, dose, interaction or guideline decision support unless explicitly validated and separately specified.

## Human factors

Warnings are rare, specific, actionable and placed at the decision point. Repeated low-value alerts are treated as a safety defect. Keyboard acceleration cannot bypass required review; destructive buttons are not adjacent to routine primary actions without separation/confirmation.

## Validation

Before clinical production, practising GPs, nurses, receptionists and managers test representative normal/busy/failure scenarios. A qualified clinical-safety reviewer accepts residual risks for patient identity, record mutation, prescribing, results, recalls and migration.
