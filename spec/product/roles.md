# Roles and permission model

Roles are configurable bundles of granular permissions. A job title never bypasses permission, patient-context, location or scope checks. See [`../cross-cutting/authorization/permissions.md`](../cross-cutting/authorization/permissions.md).

## Baseline role bundles

| Permission area | GP | Nurse | Receptionist | Practice manager | Administrator |
|---|---:|---:|---:|---:|---:|
| search/identify patients | yes | yes | yes | yes | limited operational need |
| view demographics and alerts safe for administration | yes | yes | yes | yes | no by default |
| view clinical summary and clinical entries | yes | yes, scope-based | no by default | no by default | no |
| create clinical observations/notes | yes | scope-based | no | no | no |
| complete/amend own clinical note | yes | scope-based | no | no | no |
| prescribe | when separately authorised | only where legally and organisationally authorised | no | no | no |
| manage appointments/arrivals | yes | yes | yes | yes | no |
| edit demographics | yes | yes | yes | yes | no |
| review/action results | yes | delegated, within scope | contact-only delegated actions | oversight only unless clinical authority | no |
| manage invoices/payments | optional | optional | yes | yes | no |
| configure practice/practitioners/fees | no by default | no | no | yes | technical settings only |
| manage users/roles | no | no | no | nominated only | yes |
| view audit metadata | own activity | own activity | own activity | nominated oversight | security metadata, not unrestricted content |

The table is a starting bundle, not a hardcoded matrix. Prescribing, sensitive-record access, clinical-note access, billing, audit review, user management, exports and break-glass use MUST be independently grantable.

## Contextual checks

Every decision combines: authenticated user; active practice membership; active location where relevant; permission; practitioner scope/credential where legally relevant; patient/record restriction; care or work relationship; and operation risk. Deactivated users lose new access immediately without losing authorship history.
