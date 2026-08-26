# Accessibility requirements

Core web UI MUST meet WCAG 2.2 Level AA. [WCAG22] Conformance testing includes automated checks, keyboard-only use, screen readers, zoom/reflow and users of assistive technology; automated checks alone are insufficient.

## Workflow requirements

- All functionality is keyboard-operable with visible, unobscured focus and logical order.
- Drag operations have an equivalent select-and-move workflow; rescheduling never requires fine pointer control.
- Status, urgency, selection and errors use text/icon/structure as well as colour.
- Dynamic save, validation, queue and appointment-state messages are programmatically announced without disruptive focus theft.
- Tables/grids expose names, headers, selected cell/row and actions. Calendar slots have accessible date, time, practitioner, availability and appointment summaries.
- Dense views support zoom/reflow and alternative list presentation without losing actions or safety context.
- Target sizes, contrast, labels, headings, error association and accessible authentication meet AA criteria.
- Time limits warn users and allow extension where security permits; clinical draft recovery protects work when a session locks.

## Clinical visualisation

Charts provide textual values/tables, units and dates. Warnings do not flash. Truncated clinical text has an accessible full-content path. Abbreviations have expanded labels or glossary access where ambiguity matters.

## Evidence

Every significant capability's `review.yaml` identifies accessibility evidence. Known exceptions require an explicit, time-bound remediation decision; there is no blanket “clinical software” exemption.
