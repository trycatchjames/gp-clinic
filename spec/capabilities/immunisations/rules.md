# Immunisation rules

- A vaccination record captures vaccine/antigen, brand where applicable, batch, dose, route, site, administration date/time, administering practitioner and source.
- Consent and relevant screening are recorded as performed assertions, never inferred from administration alone.
- AEFI details and actions are linked without changing the original administration record.
- Correction is additive and preserves the original value, actor, time and reason.
- AIR status in Version 1 is `not_submitted`; no upload or acknowledgement is simulated as real.
