# Screen contract: Prescription editor

## Purpose and actors

Allows an authorised prescriber to draft, review and issue an internal/manual prescription in the correct patient/prescriber/location context.

## Layout regions

1. Persistent patient banner and prominent allergy assessment/reactions.
2. Prescriber/location/jurisdiction and authority status.
3. Prescription items: medicine display/local code, strength/form, directions, quantity, repeats and optional indication.
4. Medication-list update choice.
5. Validation/warnings and rendered preview.
6. Draft/issue actions and save state.

## Behaviour

Medicine selection never auto-generates a clinical dose. Free-text/uncoded selection is visibly distinct and governed by practice policy. Adding the same local medicine prompts comparison. Issue reviews patient, prescriber, location, active allergies and not-assessed status; exact locally supported match warning requires reasoned override. Issue fixes content/rendition and optionally performs the explicitly selected medication update atomically.

## States/failure

Draft, validating, ready, issued read-only, cancelled/superseded and failed. If summary/allergy/authority is unavailable, issue is blocked though safe draft recovery continues. A failed issue remains draft and produces no issued document. Reprint/cancel are explicit audited actions with Version 1 external-limitation message.

## Permissions/accessibility

Draft and issue permissions are separate. Only the authenticated authorised prescriber can issue as themselves. Warnings are read before issue in keyboard order and no shortcut bypasses confirmation.
