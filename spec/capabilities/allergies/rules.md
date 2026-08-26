# Allergy and adverse reaction rules

- Status is `not_assessed`, `none_known`, or one or more active records; blank is never interpreted as none known.
- Each record identifies substance/category, reaction, severity when known, clinical status, source, recorder and recorded time.
- Inactivation or entered-in-error requires a reason and preserves the original record.
- A medicine order checks active allergy and adverse-reaction records before signing; an override requires reason and audit.
- Unverified or patient-reported information remains visibly qualified until clinically reviewed.
