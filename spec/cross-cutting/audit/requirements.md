# Audit requirements

## Events that MUST be recorded

- authentication success/failure, session/recovery/MFA events;
- patient search resulting in record open, clinical record/entry view, sensitive-record attempt and break-glass access;
- patient creation, demographic/representative/contact change, inactive/deceased correction and duplicate merge/unmerge;
- appointment creation, move, override, cancellation, arrival, DNA and lifecycle correction;
- encounter start/completion/reopen, signed note, amendment and entered-in-error;
- allergy, medication, problem, immunisation and observation safety-relevant changes;
- prescription issue/cancel/reprint; investigation/referral issue/amend/cancel;
- result match/reassign/review/disposition/closure and recall contact/closure;
- document import/match/reclassification/quarantine and correspondence dispatch outcome;
- task/clinical responsibility reassignment, particularly offboarding/absence cover;
- invoice issue/void/credit, fee override, payment/reversal and claim status change;
- role/permission/user/practice configuration changes;
- export, print/bulk download where technically observable, audit access and retention/legal-hold action.

## Event content

Events use the conceptual shape in [`../../contracts/events/domain-events.md`](../../contracts/events/domain-events.md). Before/after details are field-level or structured safe summaries; high-risk operations include reason/override and affected linked identifiers. Clinical free text is excluded unless essential to the audit purpose and specifically protected.

## Reliability and review

- Required audit and domain mutation are atomic. Read-audit may be asynchronously durable only if loss detection, local buffering and failure alerting exist; otherwise sensitive read fails closed.
- Events are ordered per aggregate/correlation where possible and use tamper-evident storage and restricted retention.
- Practice managers/privacy officers receive reports for break glass, bulk access/export, repeated denial, sensitive-record access and permission escalation. They do not receive clinical content unnecessarily.
- Audit search supports actor, patient, action, target and date range with timezone shown. Exports are watermarked/attributed and audited.
- Retention is set by approved jurisdiction/practice policy and legal hold. Ordinary support staff cannot shorten it.
