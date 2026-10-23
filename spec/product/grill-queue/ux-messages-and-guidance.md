---
area: ux
blocked-by: [ux-save-feedback]
needs-review: []
---

# Messages and standing guidance

## Decide

- When to use a toast, an inline `Alert`, a field message or a status badge.
- Whether permanent banners stay on a page or move to the point of decision.
- How long each kind of toast stays, and which stay until dismissed.
- How warnings, failures and information are worded, and how short they must be.

## Why we're asking

The copy rules in [`AGENTS.md`](../../../AGENTS.md) say safety guidance belongs at the point of
need, not as persistent prose. Settings › Team shows a standing "Every clinical record view is
audit-logged" alert, and the hours step shows a standing "Care outside opening hours" alert.
Without a rule, each screen decides for itself, and people learn to ignore banners.

## Examples

- Settings › Team: does the audit-log notice stay as a banner, move into the role-change dialog,
  or go?
- A practitioner is added successfully. Toast only, or also a line on the page?
- A list fails to load. Inline alert in place of the rows, or a toast as well?
- A patient record has a restricted section. Badge, alert, or an empty state?

## Starts from

- [States](../experience/web-patterns.md#states) and
  [Status and meaning](../experience/web-patterns.md#status-and-meaning).
- `apps/web/src/routes/settings/team.tsx` and `onboarding/step-hours.tsx`.

## Blocks

Consistent copy across screens.
