# Recalls and reminders

## Dependencies

- Domains: [patient](../../domain/patient.md), [recall](../../domain/recall.md), [result](../../domain/result.md), [task](../../domain/task.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [clinical-record integrity](../../cross-cutting/clinical-safety/clinical-record-integrity.md), [clinical safety](../../cross-cutting/clinical-safety/principles.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Clinicians create/close clinical follow-up obligations; authorised staff pursue contact; nurses/reception manage routine preventive reminders within permission; managers monitor overdue work.

## Primary tasks

Create recall from result/consultation; assign clinician/admin owner; record contact attempts; arrange/link appointment; handle cancellation/DNA; escalate under policy; clinically resolve/cease; create/send-record preventive reminder; recur/decline/opt out; distinguish appointment reminder.

## Inputs and outputs

Consumes source clinical records, patient safe contacts/consent, practice policies, appointments and tasks. Produces Recall/Reminder/contact history and notifications.

## Constraints

Recall pursued to clinical closure; preventive non-response does not imply pursuit; message content minimised; admin cannot see protected reason/close clinically; linked appointment is not completion.

## Out of scope

SMS/email delivery, external screening registries and automated clinical eligibility/guideline engines.

## Rules

Recall, preventive reminder and appointment reminder obey the [recall domain](../../domain/recall.md). Recall closure is clinical; failed contact/DNA/cancellation never closes. Preventive non-response does not create pursuit. Contact attempts use safe destinations, minimise content and retain exact outcome. Priority/escalation is policy/clinician assigned. Recurrence creates linked cycles. A task supports but cannot own clinical closure.

## Interactions

Result/consultation creates a recall with accountable clinician. Recall may create contact tasks and appointments; appointment events update but do not close it. Clinician resolves after the required clinical event or records cessation decision. Preventive reminder may create an appointment and later be marked complete from a qualifying clinical event only through an explicit reviewed link. Appointment reminders arise from Appointment and are not displayed as clinical due care.

## Permissions

Clinicians with source access create and clinically close. `recall.contact` allows delegated contact/history with protected reason hidden. Team managers reassign/monitor without gaining report/note content. `reminder.manage` covers routine preventive cycles/opt-out. Communication/template/bulk action permissions remain separate.

## Screen contracts

### Screen contract: Recall worklist

#### Purpose and actors

Coordinates clinical recall pursuit while exposing protected reason only to authorised clinical users and safe contact instructions to delegated staff.

#### Layout/information

Queues by owner/team/priority/due/overdue/unable-to-contact/appointment arranged; patient identity and safe-contact restriction; due/priority; responsible clinician and admin assignee; source type; last/next contact; attempts count/outcomes; linked appointment status; clinical closure status. Clinical view additionally shows reason/source content.

#### Actions

Record contact attempt and destination snapshot/outcome; create/link appointment; reassign coverage; escalate under policy; open source; clinician records resolved or ceased-with-reason. Preventive reminders are a separate tab/entity with visibly different closure semantics.

#### States and safety

Failed contact remains open. Appointment cancellation/DNA returns to pursuit and is prominent. “Unable to contact” remains open, never a green/completed state. Only clinician closure actions close; admin completion of a contact task does not. Priority comes from clinician/policy and is not inferred by the UI.

#### Failure/privacy/accessibility

Contact save failure preserves notes and does not increment attempt count. Unsafe/no usable contact blocks automated/default channel and offers clinician review. Messages preview minimum necessary content. Keyboard flow covers patient → contact → outcome → next action.
