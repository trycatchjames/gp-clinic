# Privacy specification

Australian private health service providers are subject to the Privacy Act and APPs, with additional state/territory requirements in some jurisdictions. [OAIC-HEALTH; OAIC-JURISDICTIONS] This is a product behaviour specification, not legal certification.

## Collection and notice

- Collect health/personal information only for a documented practice purpose and record source/provenance.
- Registration makes the practice privacy notice available and records when/how it was provided; consent is captured only where it is the applicable authority.
- Optional sensitive demographic questions explain purpose, allow non-response where lawful and can be answered privately.
- Reuse of information for reporting, quality improvement or research requires a separately approved purpose, minimum necessary dataset and authorisation/de-identification review.

## Use, access and disclosure

- The UI and exports apply least privilege and minimum necessary content. A staff member's curiosity is never a valid purpose.
- Clinical, appointment, preventive, account and marketing communication permissions are separate; marketing is outside Version 1.
- Every disclosure/export records recipient, authority/consent, purpose, scope, actor, time and exact export version.
- Third-party information in the patient's record is considered during access/export/redaction; the system supports review rather than automatic blanket release.
- Representatives access only within verified authority scope and dates.

## Patient access and correction

- The practice can register and track a patient access request, identity/authority verification, scope, due date, review/redaction, delivery method, outcome/refusal reason and correspondence. OAIC considers 30 days generally reasonable, but jurisdiction policy controls the deadline. [OAIC-HEALTH]
- Factual demographics can be updated with history. Completed clinical content is corrected by additive amendment or patient statement/dispute; it is not silently rewritten.
- Refusal or alternate access method is recorded with reasons and complaint information according to policy.

## Sensitive and safe contact

- Contact points carry safe-to-use, purpose, consent/preference and verification states. Do-not-use overrides ordinary preference.
- Messages use minimum necessary content. No result, recall reason or sensitive clinical detail appears in an unsecured notification preview by default.
- Domestic/family violence or other confidentiality risks can restrict representatives, contact methods and record access without relying on free-text alerts alone.

## Retention, deletion and breach

- Retention/destruction is jurisdiction- and policy-driven. The system preserves legal holds, inactive/deceased records and audit, and provides a governed destruction workflow only after policy approval.
- Account/practice closure does not erase health records.
- Suspected breaches support containment, assessment, notification-decision evidence and review consistent with the NDB scheme. [OAIC-NDB]

## Privacy failure behaviour

When authority or safe recipient is uncertain, disclosure/communication fails closed and records a resolvable work item. Privacy denials do not reveal hidden clinical content.
