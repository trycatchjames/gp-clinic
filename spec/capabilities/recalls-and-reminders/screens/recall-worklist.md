# Screen contract: Recall worklist

## Purpose and actors

Coordinates clinical recall pursuit while exposing protected reason only to authorised clinical users and safe contact instructions to delegated staff.

## Layout/information

Queues by owner/team/priority/due/overdue/unable-to-contact/appointment arranged; patient identity and safe-contact restriction; due/priority; responsible clinician and admin assignee; source type; last/next contact; attempts count/outcomes; linked appointment status; clinical closure status. Clinical view additionally shows reason/source content.

## Actions

Record contact attempt and destination snapshot/outcome; create/link appointment; reassign coverage; escalate under policy; open source; clinician records resolved or ceased-with-reason. Preventive reminders are a separate tab/entity with visibly different closure semantics.

## States and safety

Failed contact remains open. Appointment cancellation/DNA returns to pursuit and is prominent. “Unable to contact” remains open, never a green/completed state. Only clinician closure actions close; admin completion of a contact task does not. Priority comes from clinician/policy and is not inferred by the UI.

## Failure/privacy/accessibility

Contact save failure preserves notes and does not increment attempt count. Unsafe/no usable contact blocks automated/default channel and offers clinician review. Messages preview minimum necessary content. Keyboard flow covers patient → contact → outcome → next action.
