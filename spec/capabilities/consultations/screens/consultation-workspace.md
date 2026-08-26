# Screen contract: Consultation workspace

## Purpose and actors

Lets an authorised practitioner understand patient context, document care and create linked actions without losing patient, author or save state.

## Entry points and layout

Start from appointment/waiting room, patient record or authorised unbooked encounter. Regions: persistent Patient Banner; compact health summary/open obligations; encounter header (practitioner/location/mode/actual time); note editor; structured action palette; created-actions list with states; completion area.

## Required information

Encounter owner/participants, start status, draft last-save state, allergy assessment, current medicines, active problems, relevant recent results/observations, open urgent follow-up, appointment context and any supervision/co-sign requirement. Collapsed summary still exposes safety indicators.

## Actions

Save note; add diagnosis/problem, allergy, medication/reconciliation, observation, prescription, investigation, referral, recall, task, care-plan activity or document; preview issued artefacts; hand over/assign where permitted; complete; abandon with reason; recover conflict/draft.

## Interaction and save

Note editing autosaves a recoverable draft and announces server/local state. Structured actions show `draft`, `issued/committed` or `failed`; a failed action remains visible and cannot be mistaken for committed. Completion checks durable note, unresolved action drafts/failures, required co-sign and warnings.

## States/failure

Preview (no encounter), draft, in progress, completion validation, completed read-only, reopened/amendment. Partial summary failure is prominent and blocks dependent actions; note failure preserves text. Session lock preserves draft and hides content until same user reauthenticates.

## Keyboard/accessibility

Logical regions/shortcuts are discoverable; no shortcut issues/signs without confirmation. Focus remains in editor on autosave and moves to specific error on completion failure.
