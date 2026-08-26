# Notifications and communications

## Concepts

An in-app notification draws a user's attention; a work queue owns actionable responsibility; a patient communication records content, purpose, recipient and delivery attempt. Notifications never replace tasks, recalls or result responsibility.

## Rules

- Every notification links to its source object and opens only if the user is authorised.
- Dismissing a notification does not complete its source work.
- Priorities are `information`, `attention`, `urgent` and `critical`, assigned by domain/practice policy; visual semantics are distinct and accessible.
- Patient communications validate recipient/contact safe-to-use state, purpose-specific consent/policy and minimum necessary template at send/record time.
- Version 1 records manual delivery/attempts. It does not claim SMS/email delivery.
- Communication history stores recipient destination snapshot in protected form, actor, time, channel, template/version, purpose, source and outcome.
- Quiet hours/preferences apply to routine communication, but urgent clinical contact follows approved policy and lawful safe-contact restrictions.
- Bulk reminders provide preview, counts, exclusions, duplicate suppression and itemised outcomes; no clinical reason appears in routine message content.

## Failure

Failed/unknown communications remain linked to their source and actionable. Retry is idempotent and creates a new attempt. The UI never reports “patient notified” from “message prepared” or “manual attempt recorded”.
