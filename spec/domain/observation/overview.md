# Observation

## Purpose and attributes

Observation records a dated clinical measurement or assertion: value, unit, method/site/position where relevant, reference/context, clinical effective time, author/performer, source, encounter and status. Examples include blood pressure, pulse, temperature, height, weight, waist, BMI (derived with inputs), smoking status and patient-reported measures.

## Rules and invariants

- Numeric value and unit are a pair; display/conversion never loses the originally entered value/unit.
- Derived values identify formula/version and source observations; editing an input creates a new derived version or marks it stale rather than rewriting history.
- Reference ranges or “abnormal” flags from a source are provenance-bearing data, not a system diagnosis.
- Implausible values may prompt confirmation but an override retains the value and reason; thresholds are configuration/validated content, not invented clinical truth.
- Corrections use amendment/entered-in-error semantics.
- Graphs make unit changes, missing data, source and effective date clear and do not connect incomparable observations.
