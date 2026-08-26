# Open questions requiring validation

These questions are deliberately unresolved. A product answer requires documented research or an explicit decision; implementation must not silently choose.

## Requires practising GP input

- What minimum structured consultation fields provide safety and reporting value without slowing diverse GP styles?
- Which health-summary items must remain visible at all times versus one interaction away for paediatrics, antenatal care, mental health and multimorbidity?
- Which result dispositions and urgency labels match real practice policy without implying unsupported clinical decision support?
- How should shared/delegated inbox cover work for part-time GPs, locums and registrars?
- When should a diagnosis entered in a consultation be proposed for the longitudinal problem list, and how explicit must that promotion be?
- Which internal prescription issue/cancellation states are required before an electronic prescribing integration exists?
- What care-plan structure is useful after the July 2025 chronic-condition changes without encoding mutable MBS eligibility rules?

## Requires receptionist input

- Which calendar density, practitioner grouping and keyboard flows work at 5, 15 and 50 concurrent books?
- How should urgent/add-on, walk-in, telehealth and interpreter/resource needs be communicated without clinical oversharing?
- Which demographic fields are safe to confirm audibly at a public desk, and when should private self-entry/rooming be offered?
- What is the least disruptive duplicate warning during a live call, especially for newborns, twins, aliases and family members sharing details?
- Which appointment changes require confirmation versus one-step action during peak call volume?

## Requires practice manager input

- Which fee-schedule inheritance and override model covers mixed billing, practitioner discretion, consumables and multiple locations?
- What reports are operationally essential on day one, and which pose unacceptable re-identification or staff-surveillance risks?
- How are rooms/equipment actually reserved across appointment types, and are resource conflicts hard or overridable?
- Which status names should be configurable for local language while preserving canonical analytics states?
- What retention and destruction policy applies for each intended state/territory deployment and practice ownership model?

## Requires clinical safety review

- Confirm every hard stop and override path for wrong-patient risk, allergy uncertainty, prescription issue, result closure and duplicate merge.
- Determine whether “no known allergies” requires a review date and when staleness should be shown.
- Define safe display and escalation of patient-authored versus clinician-authored alerts.
- Validate critical-result escalation timers and after-hours handover as practice policy rather than fixed software defaults.
- Define the safe representation of pregnancy, paediatric dosing context and high-risk medicines without a maintained decision-support database.
- Confirm the minimum structured handover package when responsibility for results, recalls or care plans changes.

## Requires legal/privacy/compliance review

- State/territory-specific record retention, correction, destruction and deceased-patient rules.
- Rules for minors, mature minors, guardians, substitute decision-makers, family access and separated-family risk.
- Lawful anonymous/pseudonymous service scenarios and billing limitations.
- Sensitive-record segmentation and whether hiding existence, content or both is lawful/safe in each context.
- Export/redaction rules for third-party information, subpoenas, insurers and patient access requests.
- Jurisdiction-specific prescription form, scheduled-medicine and real-time monitoring requirements.
- Whether each proposed audit event and monitoring report is proportionate under APP collection/use principles.

## Requires future integration research

- Medicare/AIR/electronic prescribing/My Health Record conformance and identifiers.
- Pathology/radiology message matching, correction, cancellation and acknowledgement semantics.
- Secure-message delivery, directory provenance and failed-delivery reconciliation.
- External terminology/version migration and validated medicine-safety knowledge bases.
- Online booking identity matching and concurrency.
- Payment reversal/chargeback and accounting export.
