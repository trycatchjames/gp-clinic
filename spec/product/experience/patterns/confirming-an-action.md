# Confirming a consequential action

## The problem

A confirmation exists to make someone understand a consequence, not to make them click twice. A
dialog that asks "are you sure?" without saying what will happen, what will be kept, and what
else changes has added friction and bought no safety.

## Rules

- Name the object and the consequence. "Delete?" is not a confirmation.
- Show what is retained as well as what changes. Clinical history is not erased; say what happens
  to it.
- Name downstream effects, and the safer alternative where one exists.
- The final consequential action is visually distinct from an ordinary primary action.
- A destructive action may be visually subordinate before confirmation. Its consequence is
  explicit regardless.
- Follow the destructive-action contract in
  [../../../cross-cutting/clinical-safety/destructive-actions.md](../../../cross-cutting/clinical-safety/destructive-actions.md);
  it, not this page, decides when reauthentication or a second person is required.

## First reference

None on real data. `ConsequenceConfirmation` was specified and demonstrated by DS-015. The first
capability with a destructive or corrective action becomes this page's first reference.

## Settled by

Specified by DS-015, under the
[destructive-action](../../../cross-cutting/clinical-safety/destructive-actions.md) and
[record-integrity](../../../cross-cutting/clinical-safety/clinical-record-integrity.md)
requirements.

## Contracts

### DS-PAT-013 Consequence Confirmation

- **Need:** Make a destructive or corrective action explain its exact target, consequence, retained
  history, downstream effects, and safer alternative in one reviewed structure, so no capability has
  to re-derive the shape of a safe confirmation.
- **Owner:** `apps/web/src/components/patterns/consequence-confirmation.tsx`.
- **Semantics:** Composes the Dialog atom. The title names the action, the description carries the
  consequence, and the disclosures are a definition list so an omitted disclosure is visible rather
  than silently absent. A required reason uses the Field contract; a required acknowledgement uses
  the Checkbox contract. Failure carries alert semantics inside the retained dialog.
- **Public contract:** Requires open state, an action title, an exact target, a consequence
  statement, a confirm label, and a confirm callback. Accepts the operating context, retained
  history, downstream effects, a safer alternative, a controlled required reason, a controlled
  required acknowledgement, submitting and failure state, and a corrective or destructive severity.
  The caller owns the mutation, the permission decision, and every word of consequence copy.
- **States:** Ready, blocked by an unmet precondition, submitting, and failed. Submitting disables
  the consequential action without hiding the disclosures. Failure keeps the dialog, the entered
  reason, and the acknowledgement recoverable, and never reports partial success. Dismissal by
  Escape, overlay, close, or cancel MUST NOT confirm. A blocked confirm names the unmet precondition
  at the point of need rather than presenting an unexplained disabled control.
- **Keyboard and focus:** Opening moves focus to the reason field when one is required and otherwise
  into the disclosure body; it MUST NOT open with focus on the consequential action. Cancel precedes
  confirm in the tab order. Escape closes only while not submitting. Focus returns to the invoking
  control on dismissal, and moves to the failure message when a submission fails.
- **Responsive/content:** Disclosures stack and wrap without truncation; a long target, reason, or
  downstream list scrolls inside the dialog while the title, consequence, and final actions stay
  visible, clear of the scrollbar. Narrow layout stacks the two actions with visible separation and
  the consequential action furthest from the thumb-resting position, while the tab order still
  reaches cancel first. Severity is carried by wording and structure as well as colour.
- **Required stories:** `Default`, `Corrective`, `WithReason`, `WithAcknowledgement`, `Blocked`,
  `Submitting`, `FailedSubmit`, `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `confirmation-disclosures`, `confirmation-blocked`, `confirmation-failure`,
  `confirmation-narrow`, and `confirmation-keyboard`.
- **Used by:** [Patient search](../../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [complete consultation](../../../capabilities/consultations/spec.md#dialog-contract-complete-consultation),
  and [calendar day](../../../capabilities/calendar/spec.md#screen-contract-calendar-day).
- **Excludes:** Deciding that an action is destructive, consequence and recovery wording, permission
  and elevation checks, reauthentication, proving that a second authorised person acknowledged,
  mutation, idempotency, retry safety, and audit.
