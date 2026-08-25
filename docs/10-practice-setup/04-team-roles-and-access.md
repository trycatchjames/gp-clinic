# Team, Roles and Access

**Status:** `built`

## Purpose

Get people into the practice with exactly the access their job needs, and be able to prove it
later.

## Who does it

Practice Owner (all roles) and Practice Manager (all roles except Practice Owner).

## The workflow

### Inviting someone

1. Enter name, email, role, and the locations they work at.
2. If the role is clinical, either link an existing practitioner profile or create one.
3. An invitation is created with a single-use token, 14-day expiry, and sent by email.
4. The invitee sets a password, confirms their details, and lands in the practice.

Pending invitations are listed with resend and revoke actions. Revoking invalidates the token
immediately.

### Changing a role

Role changes take effect on next token refresh (within 15 minutes) or immediately if the user's
sessions are revoked. Both the change and the actor are audit-logged.

### Removing someone

Removal deactivates the membership; it does not delete the user or any record they authored.
Their name remains on every note they wrote — that is the whole point of a clinical record.
Active sessions are revoked immediately.

### Offboarding checklist

Removing a clinical team member surfaces a checklist rather than just doing it:

- Reassign or cancel future appointments
- Reassign the results inbox (unactioned results **must** have a new owner — this is the highest
  risk item in offboarding)
- Reassign open tasks and recalls
- Reassign patients who have them recorded as usual GP
- Note the last day for billing/reconciliation purposes

## Rules and constraints

1. A practice must always have at least one active `practice_owner`.
2. A user can hold exactly one role per practice, but may be a member of several practices.
3. Roles are practice-scoped; location scope narrows what they can see within it.
4. Reception-level roles receive no clinical data over the API at all — the restriction is
   server-side, not a hidden button.
5. Every membership change writes an audit entry.
6. Break-glass access outside normal scope is permitted, requires a reason, and is flagged for
   review.

## Data touched

`users`, `practice_memberships`, `invitations`, `user_locations`, `sessions`,
`audit_log_entries`.

## Offline behaviour

Online-only.

## Standards mapping

C3.2 · C3.4 Practice communication and teamwork · C6.3 Confidentiality and privacy ·
C6.4 Information security · C8.1 Education and training of non-clinical staff

## Feature files

`features/practice-setup/team-and-roles.feature`, `features/practice-setup/invitations.feature`,
`features/practice-setup/access-control.feature`, `features/practice-setup/offboarding.feature`
