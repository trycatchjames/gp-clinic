# Authentication requirements

## Identity

- Every human user has a unique internal identity; shared accounts are prohibited.
- Version 1 uses an internal authentication boundary. No third-party identity provider is required or specified.
- Authentication identity is separate from practice membership and practitioner identity. Successful sign-in alone grants no patient access.
- Account creation, recovery, credential change, MFA change, lock/unlock and deactivation are audited.

## Sessions

- Remote and privileged access requires MFA; production deployments SHOULD require MFA for all users. [ACSC-E8]
- Sessions use secure, rotating, revocable credentials and terminate on account/membership deactivation.
- The user must reauthenticate for security-critical operations such as changing MFA, bulk export, break-glass configuration or elevating permissions.
- Inactivity timeout is risk-based and practice-configurable within a secure product range. Clinical drafts are preserved locally/recoverably before lock; unlocking never reveals the prior patient's content to a different user.
- Concurrent sessions are visible to the user and revocable. Suspicious authentication attempts are rate-limited, logged and alerted without confirming whether an account exists.

## Recovery and service access

- Recovery verifies control through an approved internal process and invalidates prior recovery credentials. Help-desk staff cannot see or set a user's reusable password.
- Emergency/break-glass clinical access is an authorisation mode after authentication, not an authentication bypass.
- Service/background identities are non-human, least-privileged, rotated and cannot sign in through ordinary UI.

## Failure behaviour

Authentication infrastructure failure blocks new sessions and unsafe mutations; it never falls back to anonymous access. Existing session behaviour follows documented continuity policy and shows degraded state. Repeated failed attempts produce a generic response and an auditable security event.
