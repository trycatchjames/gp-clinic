# Web interaction patterns

Use this page when designing or changing a web screen. It records interface guidance for the
current app; a capability's `spec.md` still decides what a person may see and do. Revise this page
when real screens expose a better pattern, and name the screen that first used it.

Lists of records have their own page: [list views](list-views.md).

## Building a screen

- Compose screens from the shadcn components in `apps/web/src/components/ui` with Tailwind
  utilities. When a component is missing, install it from `apps/web` with
  `pnpm exec shadcn add <name>`; never write a look-alike or edit an installed file. The
  `registry:check` script fails when an installed file differs from the registry.
- The brand lives in `apps/web/src/index.css`. Use the semantic colours (`primary`, `muted`,
  `success`, `warning`, `info`, `destructive` and their `-subtle` backgrounds); never raw palette
  colours such as `sky-100`. When no colour fits, add a semantic variable to the theme first.
- Keep the registry's default sizes. Controls are compact by design (32px); do not enlarge
  buttons or inputs on one screen. Use `size="sm"` only inside dense rows and toolbars.
- Keep layout that serves one screen in that screen's file. Extract an app component only when a
  second screen needs the same thing, and keep it free of API calls and permission checks.
- Use the formatters in `apps/web/src/lib/formatters.ts` for money, dates, times, phone numbers
  and counts. Never create a local `Intl` instance for the same value type.

## Page chrome

- Start each page with its title and, when it helps, one line saying what the page is for. Put the
  page's own primary action at the right of the title row.
- Keep the main content near the top. Do not reserve an empty bar for actions or status that are
  not there.
- At narrow widths keep the navigation opener in a compact row above the content. The desktop
  sidebar carries the navigation and the practice context without a second header.
- Use `Card` for a bounded section of a page, with a `CardTitle` naming it. Do not nest cards.

## Viewing and editing records

- Keep the record's current values readable on the page. Give each bounded section a clearly named
  **Edit** action, shown only when the session grants the permission. The API checks the same
  permission and practice scope.
- Prefer a right-side `Sheet` to edit one section of an existing record, so the person keeps sight
  of the page they came from. Keep the sheet to one task: a specific title, short context, fields,
  validation, then Cancel and Save.
- Give a sheet a distinct header, a scrolling field area and a footer anchored at the bottom. Put
  **Cancel before the primary action**, with the primary action at the right edge, in every sheet
  and dialog.
- Use a full page for a long or multi-step workflow, a broad comparison, or anything that needs
  more room than a sheet. Never nest sheets or put unrelated sections in one sheet.
- Use a `Dialog` for a brief, self-contained action that ends in a clear result and leaves the page
  intact on Cancel.
- Show a value the person may not change as a read-only fact with the reason, not as a disabled
  input.
- At narrow widths sheets use the full width and scroll. Keep the title and close action
  reachable, return focus to the control that opened them, and check long names for overflow.

## Forms and fields

- Build every field from `Field`, `FieldLabel`, the control, `FieldDescription` and `FieldError`,
  and group related fields with `FieldGroup` or `FieldSet` and `FieldLegend`. Set `data-invalid` on
  the `Field` and `aria-invalid` on the control when it has an error, and connect the description
  and error to the control with `aria-describedby`.
- Mark required fields in the label. Put a hint only where a person would otherwise get the value
  wrong, such as the format of a provider number.
- Lay short related fields side by side from `sm` upwards and stack them at narrow widths.

## Validation and save feedback

For a short create or edit form:

- Validate known constraints in the browser before sending. Mark each invalid field, put a helpful
  error under it, focus the first one and keep the person's input. The API still checks every
  constraint, permission and practice scope.
- While saving, keep the form's values, disable the submit action and show the action's progress
  in its label ("Saving…"). Never claim success before the API confirms it.
- On success, show one `sonner` toast naming what was saved and close the sheet or dialog. Do not
  also add a success panel to the page.
- On a `422`, keep the form open with its values and map every error to its field by the
  response's field pointer, using an explicit allowlist. Errors with no visible field go in an
  `Alert` at the top of the form; never discard them. Treat an expected `409` conflict the same
  way and show what changed.
- On a server or network failure, say what was not saved, keep the draft and offer to try again.
  Never retry a write automatically or show server internals.

## States

Each state answers a different question and must look different. Use `Empty` for empty and
restricted regions, `Skeleton` for loading and `Alert` for failures, unavailable and offline
content.

| State | Meaning | Show |
| --- | --- | --- |
| Loading | Not yet known | Skeleton in the shape of the content; dependent actions unavailable |
| Empty | Succeeded, and nothing is in this scope | What is empty and the next step, if any |
| Restricted | The person may not see this | That access is restricted, without leaking what is behind it |
| Unavailable | Could not be established | What is unknown; actions that depend on it disabled |
| Offline | No connection | Cached content labelled with when it was fetched; writes stopped |
| Failure | A load or save failed | What failed, what is unchanged and Try again in the same place |
| Conflict | A newer version prevents the change | The latest state and the person's own changes, neither discarded |

- A failure never looks like an empty result, and unavailable or restricted information never
  looks like none, zero or absent.
- Pending or locally recovered work never looks saved.
- Show one empty state per region; do not stack an icon, a heading and a paragraph that each say
  the same thing.

## Status and meaning

- Show a record's state with `StatusBadge` from `@/components/tone`, whose words carry the
  meaning. The tone only reinforces it:

  | Tone | Use for |
  | --- | --- |
  | `neutral` | Not started, inactive, no information yet |
  | `success` | Done, active, working as expected |
  | `warning` | Needs attention or incomplete |
  | `info` | Worth knowing but not a problem |
  | `danger` | Failed, blocked or unsafe |

- Give an `Alert` the same tones with `className={toneClasses.warning}`; use
  `variant="destructive"` for failures.

- Never let colour, an icon, hover or position alone carry a clinically consequential meaning.
- Put a decision-point message where the decision is made, as a short `Alert`. Do not turn safety
  guidance into persistent prose on a page.

## Actions and consequences

- Give each region at most one filled primary action. Secondary actions use `outline`, `ghost` or
  a `DropdownMenu`; never put a frequent or safety-relevant action only in an overflow menu.
- When an action is unavailable for a reason the person can act on, show it disabled with the
  reason beside it rather than hiding it.
- A destructive or corrective action names its target and consequence, confirms in a `Dialog`
  that shows what is retained and what changes downstream, and uses `variant="destructive"` for
  the final action only.

## Tables

- Every table header sits on the theme's primary surface. The theme styles `TableHeader` itself,
  so a screen never colours a header. Use `primary-surface` to paint any other element the same
  way.
- Line each heading up with the content beneath it. A cell holding a control removes its own
  padding so the control's text sits under the heading; never nudge a column with offsets.
- Right-align comparable numbers, dates and money, with the `tabular` class and visible units.
- A row with several actions ends with a **⋯** `DropdownMenu` named for the row ("Actions for Dr
  Tom Nguyen"), Edit first and archiving last after a separator. A row with one action ends with
  an icon-only ghost button named for the row, with a `Tooltip` saying what it does.
- Keep the row's name as a link or button to its own page, so a menu is never the only way in.

## Dates, times, identifiers and numbers

- Show dates in Australian order (`DD/MM/YYYY`), or written out where a misread would matter.
  Show the timezone when work crosses locations.
- Never fill in a missing day or month of a partial date.
- Use tabular figures for times, identifiers, counts, money, doses and measurements.
- Mask protected identifiers as the owning capability says; a screen does not choose the rule.
- Never treat a search match on an identifier as proof of identity.

## Keyboard and focus

- Keyboard order follows the visible task order. Focus is always visible and returns to the
  invoking control when a sheet, dialog or menu closes.
- Moving focus never selects, saves or marks something reviewed; only explicit activation does.
- Escape closes a transient surface only when that loses no work.
- Every drag, hover or icon-only interaction has a keyboard and labelled equivalent.

## Checking a screen

Check the owning capability and permission before choosing controls. Inspect the real screen at
desktop and narrow widths in each state it can reach: loading, empty, restricted, failure and
populated. Give feature components a Storybook story for each of those states that exists.
Browser tests select the same roles and accessible names a person uses. The
[accessibility requirements](../../cross-cutting/accessibility/requirements.md) apply to every
screen.
