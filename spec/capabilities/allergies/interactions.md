# Allergy and adverse reaction interactions

Allergy status is available from the patient banner, consultation workspace and prescribing flow. Recording or changing it updates the longitudinal record and emits an auditable event. A prescribing warning links back to the source record; overriding the warning does not alter that source. Patient merge reconciles, but never silently collapses, conflicting allergy assertions.
