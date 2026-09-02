# Consultations

## Dependencies

- Domains: [allergy](../../domain/allergy.md), [appointment](../../domain/appointment.md), [clinical record](../../domain/clinical-record.md), [consultation](../../domain/consultation.md), [investigation](../../domain/investigation.md), [medication](../../domain/medication.md), [observation](../../domain/observation.md), [patient](../../domain/patient.md), [prescription](../../domain/prescription.md), [problem](../../domain/problem.md), [recall](../../domain/recall.md), [referral](../../domain/referral.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Authorised practitioners conduct and complete an episode of care with relevant patient context and coherent linked clinical actions.

## Primary tasks

Preview without starting; start booked/unbooked consultation; review summary/open obligations; record note/diagnoses/observations; reconcile medicine/allergy facts; create prescription/investigation/referral/recall/task; record care plan activity; complete/sign; recover draft; amend later.

## Inputs and outputs

Consumes patient summary, encounter/appointment context, permissions and linked domain commands. Creates Encounter, clinical entries and explicitly linked records in owner domains, plus billing handoff.

## Constraints

Explicit patient/practitioner/location; no silent draft loss; authored contributions; durable completion only; no completion with ambiguous half-issued artefacts; signed content amended additively; preview is not start.

## Out of scope

Automated coding/item suggestion, AI scribe, external prescribing/results/referral delivery and hospital encounter workflows.

## Rules

- Preview and start are distinct; start fixes patient/practitioner/location/mode and actual time.
- Each clinical contribution keeps its author; signing as another is prohibited.
- Note and linked commands show durable/draft/failed state independently.
- Completion requires a durable note appropriate to the encounter and no ambiguous partially issued action.
- Appointment handoff occurs only after encounter completion commits.
- Completed notes are amended, not rewritten. Reopen is exceptional and reasoned.
- Encounter completion never implies result, referral, care plan or recall completion.

## Interactions

An arrived appointment may be used to start a consultation, but the encounter has its own lifecycle and identifier. The workspace composes patient summary, notes and related clinical actions without copying their ownership rules. Completion checks unresolved drafts and safety-critical actions, records participants and outcome, and may hand off to billing. Ending or cancelling an appointment never silently completes an encounter.

## Permissions

Starting, writing, completing, reopening and domain actions use independent permissions and scope. A participant may add an attributed observation/note without owning completion when policy allows. Co-sign never changes original authorship. Reception can see operational encounter/appointment state but not note content. Managers/administrators have no default clinical-note access.

## Screen contracts

### Dialog contract: Complete consultation

#### Purpose

Confirms that the clinical record can be signed/completed and makes downstream handoff explicit.

#### Required information

Patient, responsible practitioner, location/mode, encounter start/duration, note save state, list of linked actions by committed/draft/failed status, unresolved warnings, follow-up/recall/task summary, billing handoff choice and co-sign requirement.

#### Behaviour

Completion is blocked for unsaved note, unresolved failed/ambiguous issued artefact or missing required co-sign. Optional completeness prompts may be overridden with reason when no invariant is violated. Confirming performs one authoritative completion; double activation/retry is idempotent.

#### Outcome/failure

Success shows completion time and advances appointment to the applicable flow state. Failure keeps consultation in progress and all work available; appointment/billing do not advance. Closing the dialog does not complete. After success, note is read-only and amendment is the ordinary post-completion path.

### Screen contract: Consultation workspace

#### Purpose and actors

Lets an authorised practitioner understand patient context, document care and create linked actions without losing patient, author or save state.

#### Entry points and layout

Start from appointment/waiting room, patient record or authorised unbooked encounter. Regions: persistent Patient Banner; compact health summary/open obligations; encounter header (practitioner/location/mode/actual time); note editor; structured action palette; created-actions list with states; completion area.

#### Required information

Encounter owner/participants, start status, draft last-save state, allergy assessment, current medicines, active problems, relevant recent results/observations, open urgent follow-up, appointment context and any supervision/co-sign requirement. Collapsed summary still exposes safety indicators.

#### Actions

Save note; add diagnosis/problem, allergy, medication/reconciliation, observation, prescription, investigation, referral, recall, task, care-plan activity or document; preview issued artefacts; hand over/assign where permitted; complete; abandon with reason; recover conflict/draft.

#### Interaction and save

Note editing autosaves a recoverable draft and announces server/local state. Structured actions show `draft`, `issued/committed` or `failed`; a failed action remains visible and cannot be mistaken for committed. Completion checks durable note, unresolved action drafts/failures, required co-sign and warnings.

#### States/failure

Preview (no encounter), draft, in progress, completion validation, completed read-only, reopened/amendment. Partial summary failure is prominent and blocks dependent actions; note failure preserves text. Session lock preserves draft and hides content until same user reauthenticates.

#### Keyboard/accessibility

Logical regions/shortcuts are discoverable; no shortcut issues/signs without confirmation. Focus remains in editor on autosave and moves to specific error on completion failure.
