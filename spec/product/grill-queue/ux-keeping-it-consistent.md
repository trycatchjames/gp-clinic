---
area: ux
blocked-by: [ux-surfaces, ux-save-feedback, ux-form-validation]
needs-review: []
---

# Keeping it consistent

## Decide

- Whether [`experience/`](../experience/) splits into one page per topic (surfaces, forms,
  actions, states, records, lists, navigation, formatting), with an index starting from a
  "which surface?" table.
- Which pattern rules the slice review checks on every UI pull request.
- Which shared app components back the patterns, such as a form sheet or a save helper, and when
  one is extracted.
- How a screen that breaks a pattern is handled: fix the screen, change the pattern, or record
  an exception.

## Why we're asking

Written patterns drift unless something checks them. Agents read the pages, but a review that
asks "does this screen follow the surface table?" and shared components that make the right
way the easy way are what keep screens consistent. This topic comes last because the shape
depends on what the earlier topics decide.

## Examples

- A new pull request opens a dialog for a long edit form. Does the review catch it?
- Three screens hand-roll the same sheet layout. When does it become a shared component, and
  where does it live?
- A screen genuinely needs a different pattern. Where is that recorded so the next agent does
  not copy it by mistake?

## Starts from

- [Web interaction patterns](../experience/web-patterns.md) and
  [list views](../experience/list-views.md).
- The `reviewing-slice` skill and `pnpm registry:check`.

## Blocks

Agents applying the patterns without needing to ask.
