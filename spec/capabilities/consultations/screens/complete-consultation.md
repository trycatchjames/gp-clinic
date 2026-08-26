# Dialog contract: Complete consultation

## Purpose

Confirms that the clinical record can be signed/completed and makes downstream handoff explicit.

## Required information

Patient, responsible practitioner, location/mode, encounter start/duration, note save state, list of linked actions by committed/draft/failed status, unresolved warnings, follow-up/recall/task summary, billing handoff choice and co-sign requirement.

## Behaviour

Completion is blocked for unsaved note, unresolved failed/ambiguous issued artefact or missing required co-sign. Optional completeness prompts may be overridden with reason when no invariant is violated. Confirming performs one authoritative completion; double activation/retry is idempotent.

## Outcome/failure

Success shows completion time and advances appointment to the applicable flow state. Failure keeps consultation in progress and all work available; appointment/billing do not advance. Closing the dialog does not complete. After success, note is read-only and amendment is the ordinary post-completion path.
