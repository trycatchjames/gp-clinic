# Web rules

- Build for the actor and task named by the delivery slice. Do not expose controls merely because
  the API can perform an operation.
- Reuse accessible primitives from `components/ui`. Put reusable pure compositions in
  `components/patterns`; keep API calls, permissions and domain state in capability-owned feature
  code rather than the design-system layer.
- Implement loading, empty, normal, dense, failure, offline, unavailable and permission-restricted
  states required by the screen contract. A failure must never look like an empty successful state.
- Keyboard operation and visible focus are mandatory. Drag, hover and colour cannot be the only
  way to understand or perform an action.
- Use the generated SDK for API calls. Do not duplicate backend validation as the authoritative
  rule, and never rely on frontend checks for access control.
- UI PRs must include deterministic screenshots named by the slice plus a Playwright trace/video
  for the primary flow, using synthetic demo fixtures only.

