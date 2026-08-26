# Patient lifecycle

## Canonical states

`provisional` → `active` → `inactive`  
`provisional|active|inactive` → `deceased`  
`provisional|active|inactive|deceased` → `merged`

Potential duplicate is a review flag, not a lifecycle state.

| From | To | Who/permission | Preconditions and side effects |
|---|---|---|---|
| provisional | active | `patient.demographics.edit` | Minimum locally required identity/contact review completed; audit activation. |
| active | inactive | `patient.lifecycle.manage` | Reason required; future appointments and open obligations are shown and must be resolved or explicitly retained; no history deleted. |
| inactive | active | `patient.lifecycle.manage` | Reason required; previous status remains in history. |
| any non-merged | deceased | `patient.lifecycle.manage` | Source and known/estimated death date recorded; future routine communications/bookings are blocked; open clinical obligations require clinician review. |
| any non-merged | merged | `patient.merge` plus second-person confirmation | Duplicate confidence reviewed; target survivor active/not merged; merge preview accepted; identifiers/contact/alerts conflicts resolved or explicitly deferred. |

`deceased` is not normally reversible. A mistaken deceased status may be corrected only by a privileged entered-in-error operation that retains the original event and requires reason. A completed merge cannot be undone as an ordinary user action; support may perform a governed lineage-preserving unmerge only if downstream records can be deterministically restored.

Invalid transitions return a business-rule conflict and make no partial changes.
