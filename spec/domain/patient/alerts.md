# Patient alerts and restrictions

Alerts are high-salience facts, not a generic replacement for structured clinical records.

## Types

- **operational safety alert:** reception-safe information needed to interact safely, such as interpreter required, unsafe contact method, identity risk, behavioural safety procedure or access need;
- **clinical alert:** clinician-authored information that must be considered during care, linked where possible to Allergy, Problem, Medication, Result or another source;
- **access/privacy restriction:** sensitive-record or representative/contact restriction enforced by authorisation, not merely displayed text.

## Attributes and rules

Every alert has type, concise actionable text, source, author, effective/review/expiry dates, audience, status and linked structured record. Active alerts appear only to intended audiences. Clinical detail cannot leak through an operational alert. Expiry makes an alert review-due/inactive according to policy; it does not delete history.

Alerts must not duplicate allergies or recalls as the sole record. Dismissal by a viewer is not deactivation. Creating, changing, overriding or entering an alert in error is audited. Administrators cannot author clinical alerts without clinical authority.
