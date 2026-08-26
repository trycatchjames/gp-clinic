# Internal API principles

This is not an endpoint catalogue. It defines stable semantics for any UI-to-core or module-to-module interface.

## Resource and command style

- Queries retrieve versioned resources/read models and never mutate.
- Commands express intent (`reschedule appointment`, `review result`, `complete encounter`) rather than generic field patches for lifecycle entities.
- Every command includes practice context, actor/session context supplied by the trusted boundary, target identifier, expected version where mutable and idempotency key for retriable operations.
- Responses return committed resource/version and domain outcome; asynchronous/manual state is explicit.
- Bulk commands return per-target outcomes unless all-or-nothing safety is required.

## Errors

Stable error categories: `validation`, `business_rule_conflict`, `concurrency_conflict`, `permission_denied`, `not_found_or_hidden`, `temporarily_unavailable`, `unexpected`. Details include safe field/path, current version/allowed transitions where authorised, retryability and correlation ID.

## Compatibility

- Identifiers/enums follow [`../schemas/identifiers.md`](../schemas/identifiers.md) and [`../schemas/enums.md`](../schemas/enums.md).
- Additive optional fields are minor-compatible. Removing/renaming/changing meaning or tightening accepted enum semantics requires a major version and migration.
- Unknown response fields are ignored; unknown command enum values are rejected safely.
- Contract timestamps are ISO 8601 instants with timezone offsets; date-only/partial dates use explicit shapes, never midnight timestamps.

## Security/privacy

Authorisation occurs per operation and item. List/search filters cannot be manipulated to reveal hidden counts or content. Responses contain only fields required by the capability/permission. Audit and idempotency are part of command processing.
