# Consultation invariants

1. Every encounter has exactly one patient, one responsible practitioner, one practice/location context and a positive or open actual time interval.
2. Actual encounter start is not inferred from appointment start or record preview.
3. Every clinical entry identifies its author, recorded time and clinical effective time where different.
4. Completing an encounter makes its signed note immutable except through amendment; linked domain records follow their own lifecycles.
5. An encounter cannot be completed while its required note save has failed or a prescription/referral/investigation remains ambiguously half-issued.
6. Completion cannot silently discard empty-looking but edited drafts.
7. Reopening is a privileged workflow with reason and audit; an amendment is preferred for post-completion additions.
8. An encounter without an appointment remains valid and auditable; an appointment without an encounter remains an operational record only.
9. Changing the appointment after encounter start does not change encounter patient or authorship.
10. A user cannot sign as another practitioner. Co-sign records both original author and co-signer.
