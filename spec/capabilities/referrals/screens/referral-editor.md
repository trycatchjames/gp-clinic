# Screen contract: Referral editor

## Purpose and actors

Allows an authorised clinician to create a relevant referral and exact issued copy; staff may support recipient/dispatch within permission.

## Regions/information

Patient banner; referrer/location; recipient search/snapshot; reason/clinical question/urgency; selected health summary components; selected results/documents; consent/authority; preview; draft/issue/manual dispatch status.

## Behaviour

The editor proposes no blanket full-record inclusion. Each included item is visible and removable; allergy/current medicine/problem summaries show freshness/source. Template insertion is reviewed. Preview shows three patient identifiers, recipient/referrer and exact content. Issue fixes rendition. Recipient changes after issue require superseding version.

## States/failure

Draft, issued, dispatch pending, manually dispatched, failed/unknown, accepted/declined/outcome received. Rendering failure leaves draft. Failed dispatch remains actionable and cannot be marked delivered automatically. Sensitive-content permission/consent failure blocks issue and names the category without leaking it to unauthorised staff.
