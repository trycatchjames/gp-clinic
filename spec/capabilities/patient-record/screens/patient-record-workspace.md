# Screen contract: Patient record workspace

## Purpose and actors

Provides the safest, fastest answer to “who is this patient, what matters now, and what happened?” for clinicians, with a restricted operational variant for administrative users.

## Entry points and layout

Patient search, waiting room, appointment, inbox/work item and recent patients. Persistent regions:

1. patient banner;
2. clinical safety strip/summary (clinical viewers only);
3. navigation between Overview, Timeline, Problems, Medicines, Observations, Immunisations, Investigations/Results, Referrals/Documents, Recalls/Tasks and Accounts where permitted;
4. main selected content;
5. contextual action/draft panel.

## Required immediate information

Clinical viewers: allergy assessment/reactions, current medicines, active problems, critical operational/clinical alerts, age/DOB, name used/pronouns, relevant recent key observations and urgent/overdue result/recall indicators. During consultation this remains available without leaving the note. Reception sees identity/contact, lifecycle, safe contact and reception-safe alerts only.

## History

Timeline shows effective date, recorded date when different, type, author/source, status/amendment and concise summary. Filters never hide active safety summary. An empty category says not recorded/not assessed as applicable; load failure says unavailable.

## Actions and interaction

Start/preview consultation, use owner-domain add/edit actions, open work source, amend completed entry with permission, view issued artefact/provenance, request access/export/correction. Switching patient while a draft/action is open invokes the draft safety contract and shows both identities.

## States/failure/accessibility

Skeletons preserve banner context; partial domain failures are named and affected actions disabled. Summary failure blocks prescribing/other dependent action and never appears “none known”. Keyboard skip links/regions and readable dense tables are required.
