# List views

Use this page when a web screen lists records for a person to find, scan and act on: patients,
practitioners, fee items, appointments. It records interface guidance; the owning capability still
decides what a person may see and do. Patient search and the MBS reference are the first
references. Revise this page when a new list exposes a better pattern.

## Two kinds of list

- A **table** lists records to scan, compare and act on, such as practitioners, team members or
  fee items. Use `Table`.
- A **result list** lists candidates for one decision, such as choosing the right patient from a
  search. Use `ItemGroup` with one `Item` per candidate, rendered as a button. Keep each candidate
  to an identity line and one line of distinguishing facts.

## Anatomy

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Title                                                  [+ Primary]   │  page header
│ One line on what the list is for                                     │
├──────────────────────────────────────────────────────────────────────┤
│ [🔍 Search            ] [Filter ▾] [Chip ×]           12 results     │  toolbar
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Name ⇅              Fact            Status          Date ⇅    ⋯  │ │  table header
│ │ Record name         …               (Badge)         14/03/2022 ⋯ │ │  rows
│ │ secondary line                                                   │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ Showing 21–40 of 100                              [Previous] [Next]  │  footer
└──────────────────────────────────────────────────────────────────────┘
```

| Part | Build it from |
| --- | --- |
| Toolbar | A `role="search"` row with an accessible name that wraps at narrow widths; the list's own action sits at the right edge |
| Search | `InputGroup` with a search icon and a label naming what it searches; visually hidden only when the placeholder says the same |
| Views | `ToggleGroup type="single"` for lifecycle views, such as Active and Archived |
| Filters | `Popover` holding `Checkbox` or `RadioGroup` choices, and a removable `Badge` per applied value |
| Result count | Plain text at the right of the toolbar, announced with `aria-live="polite"` |
| Table | `Table` with a caption naming the view; the theme puts the header on the primary surface |
| States | `Skeleton` rows, `Empty` or `Alert`, in the place the rows would be |
| Footer | The visible range and total, then `Pagination` or Previous and Next buttons |

Compose these in the screen. When a second list needs the same composition, move it into an app
component under `apps/web/src/components` and update this page to name it.

## Finding

- Put search first and keep it visible. Scope it to the current view and label it for what it
  searches, such as "Search patients by name, phone or record number".
- Add lifecycle views only when each state answers a different question. Keep to four or fewer,
  label the selected one clearly and leave counts off the views.
- Keep filters optional and few. Values within a group broaden the result; separate groups narrow
  it. Show each applied value as a chip that clears it, and the applied count on the Filter button.
- When the view changes, keep the search term, clear filters whose meaning changes and reset the
  sort. Return to the first page on any change of search, filter, view or sort.
- Keep the query and scope while results load or refresh.

## Columns and rows

- Lead with what identifies the row, linking to the record's own page, with one secondary line for
  context. Put the most useful fact for the current view next; internal and external reference
  numbers stay secondary.
- Keep to about five data columns, and none that are mostly empty.
- Put dates, money and quantities at the right with the `tabular` class.
- Make a column sortable only when its order means something. A list the API pages is sorted by
  the API; a list the screen holds whole sorts in place. Keep sort state in `aria-sort`.
- Keep rows to one line plus a secondary line. Leave out avatars that add nothing beyond the name.
- Row actions follow [web interaction patterns](web-patterns.md#tables).

## Choosing from a result list

- Each candidate is a button with `aria-pressed` showing whether it is chosen. The list has an
  accessible name, such as "Matching patients".
- Arrow keys, Home and End move focus between candidates without choosing; Enter or Space chooses.
  Reaching a record never opens or selects it.
- Show the chosen candidate with a tick and a leading rule as well as the background tint, and a
  visually hidden "Selected".
- A new search clears the choice, so an earlier choice cannot be mistaken for a match against new
  details. Clearing the choice returns focus to the search field.
- Name records the person may not open once for the whole search, with what they can do instead,
  rather than mixing them into the candidates.

## Loading, empty and errors

- Show skeleton rows in place of the rows while the first page loads, and keep the toolbar usable.
- Distinguish an empty view ("No archived practitioners") from a search with no matches ("No
  patients match these details") and suggest the next step.
- When loading fails, say what could not load and offer Try again in the same place. A failed
  search is never "no matches": say plainly that a matching record may still exist.
- Under the table, give the visible range and the total, and disable Previous or Next when there
  is no page that way or a page is loading.

## Access

- Show an action, a selection column or a bulk action only when the session grants the permission
  it needs. The API checks every request regardless, and the list explains a refusal in words.

## Narrow widths and accessibility

- The toolbar wraps and search takes the full width. A table scrolls sideways inside its frame;
  the page itself never scrolls sideways.
- Tests select the same roles and accessible names a person uses.
