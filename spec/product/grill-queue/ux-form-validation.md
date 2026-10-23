---
area: ux
blocked-by: [ux-save-feedback]
needs-review: []
---

# Form validation

## Decide

- When a field is checked: when the person leaves it, when they save, or both.
- Whether to mark required fields or optional ones, and how.
- How errors are worded: what was wrong and how to fix it, in one line under the field.
- Whether invalid fields animate (a brief wiggle) and how reduced motion is respected.
- Whether every form uses one form library and a shared helper, instead of each keeping its own
  error state.

## Why we're asking

With close-on-save, the browser's checks are the last chance to catch a mistake before the form
disappears, so they matter more than before. Today every form hand-rolls its own error state
and calls `fieldErrors` and `toast.error` itself; only two forms use `FieldError`. That is how
one form validates as you type and another only on save.

## Examples

- A receptionist types a Medicare number with nine digits instead of ten and tabs to the next
  field. Do they see the error now or when they press Save?
- A practitioner form has fifteen fields and three are optional. Is it clearer to mark the
  twelve required ones or the three optional ones?
- An ABN fails its checksum. Is the error "Invalid ABN" or "Check the ABN: the digits don't
  form a valid ABN"?

## Starts from

- [Forms and fields](../experience/web-patterns.md#forms-and-fields).
- `apps/web/src/routes/register.tsx` and `onboarding/step-identity.tsx`, the forms that use
  `FieldError` today.

## Blocks

A shared form helper; editing many rows at once; consistent forms everywhere.
