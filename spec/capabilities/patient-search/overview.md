# Patient search

## Purpose and actors

All authorised practice staff locate the correct patient quickly without creating or acting on a duplicate/wrong record.

## Primary tasks

Search multiple identifiers; compare similar candidates; open an administrative or clinical view according to permission; include inactive/deceased/provisional records; follow merge redirect; start registration only after broader duplicate review.

## Inputs and outputs

Consumes Patient identity/contact indexes, access restrictions, status and permission. Outputs a selected patient context or a registration/duplicate-review decision; it does not mutate patient data.

## Constraints

Medicare number is a search key, not an approved verification identifier. Similarity ranking never auto-selects. Restricted records expose only a safe stub. Search logging must be proportionate but record opens and sensitive attempts are audited.

## Out of scope

Clinical full-text search, cross-practice identity federation and external identifier lookup.
