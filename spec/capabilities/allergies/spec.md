# Allergies and adverse reactions

## Dependencies

- Domains: [allergy](../../domain/allergy/overview.md), [clinical record](../../domain/clinical-record/overview.md), [consultation](../../domain/consultation/overview.md), [patient](../../domain/patient/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians and appropriately scoped nurses document and review allergy/ADR risk; prescribers see it at the point of issue.

## Primary tasks

Record asked-none-known; add agent/reaction/severity/certainty/source; update status; mark entered-in-error; review staleness; view history; respond to a locally supported exact-match warning.

## Inputs and outputs

Consumes patient context and optional local substance catalogue. Produces assessment state and reaction records used by Patient Summary and Prescribing.

## Constraints

Empty is not none-known; allergy and adverse reaction remain distinguishable; provenance/uncertainty visible; Version 1 offers no unsupported class/interaction knowledge; warning override is reasoned and audited.

## Out of scope

External medicines terminology/allergy decision support and adverse-event reporting.

## Rules

- Status is `not_assessed`, `none_known`, or one or more active records; blank is never interpreted as none known.
- Each record identifies substance/category, reaction, severity when known, clinical status, source, recorder and recorded time.
- Inactivation or entered-in-error requires a reason and preserves the original record.
- A medicine order checks active allergy and adverse-reaction records before signing; an override requires reason and audit.
- Unverified or patient-reported information remains visibly qualified until clinically reviewed.

## Interactions

Allergy status is available from the patient banner, consultation workspace and prescribing flow. Recording or changing it updates the longitudinal record and emits an auditable event. A prescribing warning links back to the source record; overriding the warning does not alter that source. Patient merge reconciles, but never silently collapses, conflicting allergy assertions.

## Permissions

`clinical.summary.view` exposes current assessment; `allergy.manage` creates/changes clinical reactions. `clinical.entry.entered_in_error` is required for correction. Prescribing receives a safety projection but cannot mutate it. Reception/administration have no default reaction-content access.

## Screen contracts

### Screen contract: Allergy/adverse-reaction editor

#### Purpose and actors

Lets authorised clinical users record an assessed none-known state or a reaction with uncertainty/provenance.

#### Regions and required fields

Patient banner/current assessment; choice “record reaction” or “asked—none known”; agent/substance (authored text plus optional local code); category; reaction manifestation; severity and certainty as explicit optional/unknown values; onset/date; source; clinical notes; status; save/history.

Agent description, category/source and actor/time are required for a reaction; reaction detail SHOULD be prompted but may be unknown. None-known requires confirmation that the patient/source was asked and clears no historical records.

#### Behaviour and safety

Adding a reaction while current assessment is none-known atomically changes assessment to known-present. Recording none-known while an active reaction exists is blocked and offers review of active entries. Entered-in-error/status changes show downstream prescription warning impact and retain history.

#### Failure/permissions

Save failure preserves fields and summary remains unchanged. Only clinical permissions mutate. Reception cannot open this screen.
