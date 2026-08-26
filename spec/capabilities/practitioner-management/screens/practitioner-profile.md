# Screen contract: Practitioner profile and offboarding

## Purpose

Maintains a practitioner and safely manages location credentials, books, delegation and departure.

## Layout/information

Identity/type; credentials/effective dates; practitioner-location matrix with provider identifiers; linked user/membership (separate); book/availability eligibility; supervision/delegation; absence; responsibility inventory; audit/history.

## Actions

Create/edit effective facts, add/remove location, configure availability link, record cover/delegation, link/unlink user, suspend booking/prescribing according to policy, start offboarding, reassign future appointments/results/recalls/tasks/drafts, deactivate.

## Offboarding behaviour

Inventory lists each open obligation by domain, count/oldest/urgency and destination. Bulk reassignment previews conflicts and itemised results. Access deactivation is blocked until required work is accepted by named practitioners/team queues; authorship remains.

## States/failure

Active/restricted/inactive and credential expiry are distinct. Failed reassign leaves source owner for failed items and blocks deactivation. Provider identifier updates do not alter historical encounters/invoices.
