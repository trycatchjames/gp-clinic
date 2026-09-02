# Patient record

## Dependencies

- Domains: [allergy](../../domain/allergy.md), [clinical record](../../domain/clinical-record.md), [medication](../../domain/medication.md), [observation](../../domain/observation.md), [patient](../../domain/patient.md), [problem](../../domain/problem.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

The patient record gives clinicians a trustworthy health summary and longitudinal history while giving administrative users only the operational information needed for their work.

## Primary tasks

Confirm patient context; scan immediate safety summary; navigate timeline/categories; view provenance/amendments; access results, documents, referrals, recalls and tasks; start consultation; update domain facts through their owning capabilities; request export/correction through governed workflows.

## Inputs and outputs

Composes PatientAdministrativeSummary/PatientSummary and authorised domain records. It outputs commands to domains; it does not edit a monolithic record.

## Constraints

Banner and allergies remain visible during clinical actions. Unknown/unavailable is not rendered as empty/none. Timeline distinguishes effective and recorded time. Sensitive entries follow granular policy. Every view/action retains patient context and save state.

## Out of scope

Patient portal, My Health Record, cross-practice shared record and automated clinical recommendations.

## Rules

- Every open, switch and mutation is bound to one internal patient identifier and visible identity banner.
- Clinical summary data distinguishes absent, not assessed, none known and unknown states.
- Medicare details and IHI, when present, are attributes with provenance, not the product's patient identity key.
- Completed clinical content is amended additively; demographic corrections retain audit history.
- Restricted items apply field/item-level policy and do not make ordinary absence indistinguishable from hidden content.

## Interactions

Search or an explicit workflow opens patient context; the banner persists through consultation, prescribing, results and billing. Summary cards link to canonical domain records rather than local copies. Switching patient with unsaved work requires an explicit save, discard or cancel decision. Merge and unmerge are controlled identity operations that preserve both source identifiers and provenance.

## Permissions

The workspace assembles a field/section projection from permissions. `clinical.summary.view` gives current summary; `clinical.entry.view` gives timeline detail; sensitive, billing, correspondence and audit require separate grants. Reception receives PatientAdministrativeSummary and safe operational alerts. A hidden tab must also be inaccessible through direct link/export. Break glass follows the cross-cutting contract and is never silent.

## Screen contracts

### Component contract: Patient banner

#### Purpose

Prevents wrong-patient action and keeps lifecycle/contact restrictions visible on every patient-context screen.

#### Mandatory content

Name used prominently; family/given/legal or previous-name context sufficient for matching; DOB with age/precision; local record number; status (active/provisional/inactive/deceased/merged redirect); selected location/encounter context where relevant; sensitive/access restriction state; at least one further distinguishing field such as suburb/postcode, without exposing unnecessary full address in shared view.

Clinical variant adds compact allergy assessment and severe/current safety alerts. Administrative variant adds safe-contact warning but not clinical detail.

#### Behaviour

Banner is persistent during clinical composition, issue and result action. High-risk actions use it in confirmation. It does not rely on photo (optional) or Medicare. Similar-name warning is explicit. Screen readers encounter it near the start and patient switching announces the new identity.

#### Failure

If current identity cannot be loaded/verified, dependent patient mutations are disabled; stale banner is visibly stale, never blank.

### Screen contract: Patient record workspace

#### Purpose and actors

Provides the safest, fastest answer to “who is this patient, what matters now, and what happened?” for clinicians, with a restricted operational variant for administrative users.

#### Entry points and layout

Patient search, waiting room, appointment, inbox/work item and recent patients. Persistent regions:

1. patient banner;
2. clinical safety strip/summary (clinical viewers only);
3. navigation between Overview, Timeline, Problems, Medicines, Observations, Immunisations, Investigations/Results, Referrals/Documents, Recalls/Tasks and Accounts where permitted;
4. main selected content;
5. contextual action/draft panel.

#### Required immediate information

Clinical viewers: allergy assessment/reactions, current medicines, active problems, critical operational/clinical alerts, age/DOB, name used/pronouns, relevant recent key observations and urgent/overdue result/recall indicators. During consultation this remains available without leaving the note. Reception sees identity/contact, lifecycle, safe contact and reception-safe alerts only.

#### History

Timeline shows effective date, recorded date when different, type, author/source, status/amendment and concise summary. Filters never hide active safety summary. An empty category says not recorded/not assessed as applicable; load failure says unavailable.

#### Actions and interaction

Start/preview consultation, use owner-domain add/edit actions, open work source, amend completed entry with permission, view issued artefact/provenance, request access/export/correction. Switching patient while a draft/action is open invokes the draft safety contract and shows both identities.

#### States/failure/accessibility

Skeletons preserve banner context; partial domain failures are named and affected actions disabled. Summary failure blocks prescribing/other dependent action and never appears “none known”. Keyboard skip links/regions and readable dense tables are required.
