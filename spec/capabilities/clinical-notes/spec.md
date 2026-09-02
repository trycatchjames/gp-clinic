# Clinical notes

## Dependencies

- Domains: [clinical record](../../domain/clinical-record.md), [consultation](../../domain/consultation.md), [patient](../../domain/patient.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinical notes let authorised clinicians create an intelligible, timely account of the consultation that supports continuity while accommodating individual documentation styles.

## Primary tasks

Enter free text with optional sections/templates; record reason, history/findings, assessment and plan/review; link structured actions; autosave/recover; sign with encounter; add late entry or amendment; mark entered in error with authority.

## Inputs and outputs

Consumes patient/encounter context, templates and author identity. Produces draft/completed ClinicalEntry versions and amendments. Structured diagnoses/medicines/orders remain owned by their domains.

## Constraints

RACGP C7.1 content expectations guide completeness without requiring irrelevant fields. Author/time/mode and relevant findings/management are retained. Templates cannot insert unreviewed stale clinical content. No background autosave is represented as signature/completion.

## Out of scope

Speech transcription/AI generation, clinical coding service and medico-legal reports as a special product.

## Rules

Notes support free text and optional structure. Templates insert only reviewed boilerplate/placeholders and retain template version. Meaningful consultation content follows RACGP C7.1 but the UI does not require irrelevant normal findings. Autosave is draft; complete/sign is explicit. Late entry and amendment show effective versus recorded time. Entered-in-error retains source. Copy-forward, if later introduced, must identify provenance and require review; it is not in Version 1.

## Interactions

Starting an encounter creates the context for one or more attributed note entries. Autosave protects a draft but cannot complete it. Completion validates required elements and freezes the signed version; later change is an attributed amendment linked to the original. Problems, observations, medicines, investigations and plans entered during the encounter remain canonical domain records referenced by the note.

## Permissions

View, create, amend, entered-in-error and reopen are separate. Authors ordinarily amend their own entries; delegated/supervisory amendment policy retains both actor and original author. No administrative role can edit clinical prose. Sensitive-note restrictions add to, not replace, ordinary clinical permission.

## Screen contracts

### Component contract: Clinical note editor

#### Purpose

Supports rapid, intelligible clinical narrative with optional structure and safe draft/version behaviour.

#### Content and behaviour

The editor may offer labelled sections for reason, history, examination/findings, assessment and plan/review/safety-netting, plus a continuous free-text mode. Practice templates insert a clearly previewed starting structure and never overwrite existing text. Structured records created elsewhere appear as links/actions, not pasted opaque text.

Always show author, patient context, draft/completed state and last server/local save. Undo/redo and keyboard navigation work predictably. Pasting preserves text without executing active content. Empty sections are not automatically populated as normal/negative.

#### Conflict/recovery

Concurrent edits create a comparison/reconciliation state with both versions; no automatic free-text merge. Crash/navigation/session-lock recovery binds draft to patient, encounter and author and shows its timestamp before restore.

#### Completion/amendment

Completed note renders read-only with author/effective/recorded times and amendment chain. Amendment editor cannot alter original text and requires reason/context.
