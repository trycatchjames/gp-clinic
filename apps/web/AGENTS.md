# Web rules

Read [web interaction patterns](../../spec/product/experience/web-patterns.md) before changing a
screen, and [list views](../../spec/product/experience/list-views.md) before building or changing a
screen that lists records.

- Build for the actor and task named by the delivery slice. Do not expose controls merely because
  the API can perform an operation.
- Build screens from the shadcn components in `src/components/ui`, composed with Tailwind
  utilities. When one is missing, run `pnpm exec shadcn add <name>` from this directory. Never edit
  an installed file or write a look-alike; `pnpm registry:check` fails when a file differs from the
  registry. The brand lives in `src/index.css`.
- Keep layout for one screen in that screen. Add an app component under `src/components` only when
  a second screen needs it, and keep API calls, permissions and domain state out of it.
- Implement loading, empty, failure, offline, unavailable and permission-restricted states required
  by the screen contract. A failure must never look like an empty successful state.
- Give feature components a Storybook story for each meaningful state they have.
- Keyboard operation and visible focus are mandatory. Drag, hover and colour cannot be the only
  way to understand or perform an action.
- Use the generated SDK for API calls. Do not duplicate backend validation as the authoritative
  rule, and never rely on frontend checks for access control.
- UI PRs must include deterministic screenshots named by the slice plus a Playwright trace/video
  for the primary flow, using synthetic demo fixtures only.
