# Saving work

## The problem

The question a person actually has after pressing save is "is it on the record?" Everything here
serves answering that honestly. A screen that says saved before the commit succeeded, or that
loses a draft on a failure, is not a cosmetic defect in a clinical system — it is a record that
says something different from what the clinician believes it says.

## The sequence

A short create or edit follows this order. A long workflow, or an operation whose draft cannot
safely be restored, may keep its form open while saving; say why in the pull request.

1. **Validate what the browser can, before sending.** Mark each invalid field, associate the
   message with its control, keep the person's input, and move focus to the error summary. The
   service still checks every constraint, permission and scope.
2. **Attempt.** Show the attempt as active. Prevent a second submission. Claim nothing.
3. **On durable success**, and only then, say so, naming what was saved. Success feedback before
   the commit and its required audit have succeeded is prohibited.
4. **On a validation failure from the service**, return the person to their input with the draft
   intact and every error mapped to its field. Errors with no visible field go in the form's
   summary; none is discarded.
5. **On a failure**, say what failed, say that the record is unchanged, and keep the work
   recoverable. Do not retry a write automatically.
6. **On a conflict**, show the newer authoritative version and the person's work. Discard
   neither silently.

## Rules

- Pending, queued, locally recovered or offline work MUST NOT render as durably saved.
- A dismissed notification is not completed work.
- Leaving a dirty or failed consequential editor follows the owning capability's recovery
  contract. A shared component decides nothing about whether discarding is safe.
- Save and validation messages are announced without stealing focus.
- A recovered draft is offered with its patient and context, its author and its timestamp, before
  anything is restored.

## First reference

None on real data. `SaveState` and `ActionBar` were specified and demonstrated by DS-020 and
DS-024. Onboarding saves through its own step handling and predates them. The first capability to
edit a saved record becomes this page's first reference.

## Settled by

Save state by DS-020 ("say whether the operator's work is durably on the record"), action bar by
DS-024. The sequence above was written 29 October 2026 from those two contracts plus the
save-and-recovery rules in [../rules.md](../rules.md); it records no new product decision.

## Contracts

### DS-PAT-015 Save State

- **Need:** Say whether the operator's work is durably on the record, beside the editor that
  produced it, so pending, locally held, failed and overtaken work are never mistaken for saved.
- **Owner:** `apps/web/src/components/patterns/save-state.tsx`.
- **Semantics:** A compact status line composing an icon, its own wording and an optional recovery
  action. The visible text may be abbreviated for a dense header; the announced form is a separate
  hidden line and is not abbreviated.
- **Public contract:** Requires the state and the IANA timezone any instant is shown in, and accepts
  a subject label and the recovery or reconciliation action the state offers. The caller owns the
  save, the autosave cadence, the draft's binding to patient, encounter and author, and the conflict
  resolution itself.
- **States:** Unsaved, saving, saved, held locally, failed and changed elsewhere. These MUST remain
  visibly distinct. Only a durable commit may use the word saved; locally recovered work states in
  its visible text that it is not on the record. A failure states what happened and never implies
  the entered text was lost. A newer version by another author is reported rather than merged.
- **Keyboard and focus:** The line never moves focus, because autosave that pulls the cursor out of
  a clinical note costs more than the message is worth. It announces politely. Any recovery action
  is a normal control in reading order after the state.
- **Responsive/content:** The state wraps rather than truncating, and stays legible beside a long
  subject label. Motion on the saving state is supplemental and honours reduced motion.
- **Required stories:** `Default`, `Saving`, `Saved`, `LocalOnly`, `FailedSave`, `Conflict`,
  `AllStates`, `Narrow`, and `InEditor`.
- **Evidence:** `save-state-kinds`, `save-state-local`, `save-state-failure`, `save-state-narrow`,
  and `save-state-editor`.
- **Used by:** [Clinical note editor](../../../capabilities/clinical-notes/spec.md#component-contract-clinical-note-editor),
  [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace),
  and [patient registration](../../../capabilities/patient-registration/spec.md#screen-contract-patient-registration).
- **Excludes:** Performing or scheduling the save, autosave cadence, draft storage and its binding to
  patient, encounter and author, conflict comparison and merge, completion rules, and permission.

### DS-PAT-019 Action Bar

- **Need:** End a form, a checkout or a completion area with one unmistakable primary action, its
  supporting choices still discoverable, and a plain reason when it cannot be taken.
- **Owner:** `apps/web/src/components/patterns/action-bar.tsx`.
- **Semantics:** A named region holding an optional status, visible secondary actions, an optional
  overflow menu composing the Dropdown Menu atom, and exactly one primary action. The primary is a
  single value rather than a list, so a region cannot acquire two filled actions by accident.
- **Public contract:** Requires the primary action and its callback, and accepts secondary actions,
  overflow actions, a blocking reason, a status slot and a region label. The caller owns
  availability, permission, whether an action is destructive, and every word.
- **States:** Ready, busy and blocked. A busy primary is disabled, keeps its accessible name and
  does not hide the other actions. A blocked primary names the failed precondition beside it and is
  described by that reason, rather than presenting an unexplained disabled control. Presence in the
  bar never implies the action is permitted.
- **Keyboard and focus:** Actions follow task order, with the primary last so a supporting choice is
  reached before the consequential one. The overflow trigger is a named control that returns focus
  to itself. Changing status does not move focus.
- **Responsive/content:** The actions wrap as one group so the primary is never stranded on a line
  away from the choice that avoids it, and the primary stays visible at narrow widths. A long status
  wraps above the actions rather than compressing them. The blocking reason is placed before the row
  so it is read before the control it explains.
- **Required stories:** `Default`, `WithStatus`, `Busy`, `Blocked`, `Destructive`, `WithOverflow`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `action-bar-states`, `action-bar-blocked`, `action-bar-narrow`, and
  `action-bar-keyboard`.
- **Used by:** [Billing checkout](../../../capabilities/billing/spec.md#screen-contract-billing-checkout),
  [patient registration](../../../capabilities/patient-registration/spec.md#screen-contract-patient-registration),
  and [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace).
- **Excludes:** Deciding availability, permission and elevation, whether an action is destructive,
  the consequence and its confirmation, the mutation and its retry safety, and keeping a frequent or
  safety-critical action out of the overflow, which remains the caller's duty.

