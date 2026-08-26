# Screen contract: Practice settings

## Purpose and actors

Allows authorised managers to inspect and change effective-dated practice configuration with impact preview and history.

## Layout

Navigation for practice, locations/hours/timezones, rooms/resources, appointment types/policies, communication/recall/result policy, templates, billing items/fees, teams/roles and jurisdiction/safety configuration. Main panel shows current effective version, draft changes, validation, affected-record preview and change history.

## Behaviour

Edits are draft until reviewed/activated. Effective-date changes show future appointments, practitioner books, fee uses or issued template dependencies affected. Hard invariants cannot be disabled. Sensitive policy changes may require second approval.

## States/failure

Read-only/loading/draft/validation/active/historical. Failed activation leaves prior version active and draft recoverable. Partial impact analysis blocks activation when affected records cannot be safely enumerated.

## Permissions

Configuration areas use separate permissions. Technical administrator can manage infrastructure/auth settings but receives no clinical content. Audit/history is read-only.
