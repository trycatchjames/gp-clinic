# Clinical-record invariants

1. A completed/signed clinical entry is never overwritten or hard-deleted through normal operation.
2. Correction is an additive, dated, authored amendment that leaves the original intelligible. [MBA-GMP; AVANT-RECORDS]
3. Entered-in-error status hides an item from ordinary current summary only after privileged reasoned action; history and audit remain visible to authorised reviewers.
4. Authorship, clinical effective time, recorded time and provenance cannot be removed by amendment.
5. “No known allergy”, “no current medication” and “no active problem” are assessed statements with actor/time, not defaults inferred from an empty list.
6. Data imported or manually transcribed retains source and must not appear clinician-authored unless the clinician explicitly verifies it.
7. A late entry is marked as late and records both event time and entry time.
8. Every clinically related communication retained by the practice is linkable in the patient record.
9. Patient merge changes retrieval linkage, not original record authorship, times or source identifiers.
10. A failed mutation leaves no UI state that implies the record was committed.
11. Audit/history is not editable by ordinary clinical or administrative permissions.
12. Sensitive classification can restrict content, but emergency/break-glass use and safety summary behaviour are explicit and audited.
