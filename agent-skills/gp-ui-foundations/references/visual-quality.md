# Visual-quality pass

Review the rendered interface, not only the component source.

## Task hierarchy

- The primary task and current context are apparent before decoration.
- Decision-relevant information leads; references and provenance remain secondary but available.
- Related controls share alignment and spacing. Unrelated regions have visibly stronger separation.
- Dense layouts preserve legibility, hit targets, focus rings, and safety context.

## System coherence

- Existing type, spacing, radius, colour, elevation, and motion tokens are reused.
- A new variant communicates a distinct semantic or interaction state, not a one-page preference.
- Containers establish hierarchy without unnecessary cards nested inside cards.
- Icons support concise labels; they do not replace unfamiliar actions or state text.

## Interaction and state

- Hover, focus, active, selected, disabled, loading, invalid, and failure states are visually
  distinct where applicable.
- Focus is visible and unobscured. Keyboard navigation and activation match the semantic control.
- Status and urgency do not rely on colour alone.
- Loading does not cause avoidable layout shifts, and reduced-motion users lose no information.
- Errors say what failed and preserve the user's recoverable work.

## Responsive and content stress

- Check a narrow viewport, 200% zoom/reflow, long names, missing optional data, and the densest
  expected content.
- No required action, status, label, or safety context is clipped or available only on hover.
- Text wraps deliberately; truncation has an accessible route to full content when meaning matters.

## Final critique

Remove explanatory copy that repeats headings or normal UI mechanics. Remove decoration that does
not improve grouping, hierarchy, affordance, or state recognition. If screenshots reveal a defect,
fix the code and recapture them; never edit evidence to conceal it.
