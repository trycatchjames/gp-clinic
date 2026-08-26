# Patient relationships

```text
Practice 1 ── * Patient
Patient 1 ── * PatientName / Address / ContactPoint
Patient 1 ── * RepresentativeAuthority ── 1 Person/Patient (optional)
Patient 1 ── * Appointment ── 0..1 Encounter
Patient 1 ── 1 ClinicalRecordView (composition, not stored owner)
Patient 1 ── * ClinicalEntry / Document / Obligation / Invoice
Patient * ── 0..1 surviving Patient (merge lineage)
```

Family links, next-of-kin links and shared contact details do not permit cross-record access. The same natural person may be both a patient and a representative; the relationship is explicit and does not merge the two records.

The Clinical Record capability composes linked domains at read time. No “patient blob” may bypass domain permissions or mutation rules.
