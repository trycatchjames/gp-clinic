# Screen contract: Duplicate review and merge

## Purpose

Lets a privileged reviewer compare potential duplicate patient identities, choose “not duplicates” or perform a safe lineage-preserving merge.

## Layout and information

Side-by-side identity/contact/demographic/provenance comparison; record status; counts and date ranges for appointments, encounters, allergies, medications, results, recalls, documents, invoices and restrictions; conflicting high-risk summary facts; candidate match reasons; proposed survivor and field resolution; downstream impact/redirect; second-person confirmation.

Clinical content is shown only to reviewers with corresponding access; otherwise a clinician reviewer is required. Merge must never expose one record to a purely administrative reviewer through comparison counts/content beyond permission.

## Actions

Mark not duplicates with reason; defer/assign review; choose survivor; resolve safe demographic fields or keep both sources; acknowledge unresolved clinical conflicts; run preview; confirm merge. No automatic “best record” selection.

## States/failure

Loading keeps both IDs visible; changed-version conflict forces a refreshed preview. Merge is atomic. Failure leaves both records separate and active as before. Success shows survivor, merged source IDs and audit reference; ordinary search redirects source safely.

## Safety

Patient names/DOBs and restriction status remain pinned. Merge requires `patient.merge`, reauthentication or equivalent elevated confirmation, reason, and second authorised person. Unmerge is not offered in ordinary UI.
