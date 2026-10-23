---
area: ux
blocked-by: [ux-navigation]
needs-review: []
---

# Setup steps

## Decide

- How Settings lists the practice's setup: numbered items, a one-line summary each ("3
  practitioners", "2 of 4 locations have hours"), and a status badge.
- Which statuses exist (Not started, In progress) and whether a finished item drops its badge.
- How the onboarding wizard relates to the same items afterwards: does a finished practice still
  see its steps, and where?
- How a later step that needs an earlier one says so.

## Why we're asking

Onboarding today is a wizard of eight steps (identity, location, hours, registrations, team,
booking, billing, review), and Settings has pages for the same things. Without a rule, a
practice manager returning to change something meets a different shape from the one they set
it up in, and each new setup page invents its own summary.

## Examples

- A practice manager finishes onboarding but skips billing. What does Settings show for billing
  a week later?
- The practice adds a second location. Does Settings show the hours step as incomplete for it?
- A new capability adds fee schedules, which need billing set up first. What does its empty
  state say?

## Starts from

- `apps/web/src/routes/onboarding/` and `apps/web/src/routes/settings/`.
- SmoothPay's setup steps, first used for its chart of accounts and account roles.

## Blocks

Settings once onboarding is finished; any new setup area.
