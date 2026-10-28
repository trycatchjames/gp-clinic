# Component inventory

What exists, and where its reasoning lives. This page is an index, not a contract.

A **primitive** is an accessible interaction or display mechanic. Its behaviour is defined by its
implementation, its component tests and its gallery story, which are checked on every change.
Primitives carry no separate prose specification, because prose describing a button adds a second
thing to keep true without making the button more correct.

A **pattern** is a reusable composition that answers a product problem. Its reasoning lives on the
pattern page named below, which is authoritative for it. Read that page before changing it.

Neither layer may know about API requests, generated SDK types, the authenticated user, permissions,
route state or domain rules. A composition that needs any of those belongs to the capability that
owns it.

## Patterns

| ID | Pattern | Source | Specified by |
|---|---|---|---|
| `DS-PAT-001` | Field and Field Group | `patterns/form-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-002` | Filter Bar and Filter Field | `patterns/filter-bar.tsx` | [finding-records](patterns/finding-records.md) |
| `DS-PAT-003` | List View and List View Row | `patterns/list-view.tsx` | [finding-records](patterns/finding-records.md) |
| `DS-PAT-004` | Context Banner | `patterns/context-banner.tsx` | [naming-a-screen](patterns/naming-a-screen.md) |
| `DS-PAT-005` | State Panel | `patterns/state-panel.tsx` | [empty-and-failed-outcomes](patterns/empty-and-failed-outcomes.md) |
| `DS-PAT-006` | Summary List | `patterns/summary-list.tsx` | [reading-a-record](patterns/reading-a-record.md) |
| `DS-PAT-007` | Data Table | `patterns/data-table.tsx` | [finding-records](patterns/finding-records.md) |
| `DS-PAT-008` | Combobox Field | `patterns/combobox-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-009` | Australian Date Field | `patterns/date-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-010` | Australian Date Range Field | `patterns/date-range-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-011` | Local Time Field | `patterns/time-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-012` | File Input Field | `patterns/file-input-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-013` | Consequence Confirmation | `patterns/consequence-confirmation.tsx` | [confirming-an-action](patterns/confirming-an-action.md) |
| `DS-PAT-014` | Toast Region | `patterns/toast-region.tsx` | [reporting-an-outcome](patterns/reporting-an-outcome.md) |
| `DS-PAT-015` | Save State | `patterns/save-state.tsx` | [saving-work](patterns/saving-work.md) |
| `DS-PAT-016` | Form Error Summary | `patterns/form-error-summary.tsx` | [organising-a-form](patterns/organising-a-form.md) |
| `DS-PAT-017` | Form Section | `patterns/form-section.tsx` | [organising-a-form](patterns/organising-a-form.md) |
| `DS-PAT-018` | Collapsible Section | `patterns/collapsible-section.tsx` | [organising-a-form](patterns/organising-a-form.md) |
| `DS-PAT-019` | Action Bar | `patterns/action-bar.tsx` | [saving-work](patterns/saving-work.md) |
| `DS-PAT-020` | Bulk Selection | `patterns/bulk-selection.tsx` | [finding-records](patterns/finding-records.md) |
| `DS-PAT-021` | Itemised Outcome | `patterns/itemised-outcome.tsx` | [reporting-an-outcome](patterns/reporting-an-outcome.md) |
| `DS-PAT-022` | Numeric Field | `patterns/numeric-field.tsx` | [entering-values](patterns/entering-values.md) |
| `DS-PAT-023` | Record Timeline | `patterns/record-timeline.tsx` | [record-history](patterns/record-history.md) |
| `DS-PAT-024` | Record Comparison | `patterns/record-comparison.tsx` | [comparing-records](patterns/comparing-records.md) |
| `DS-PAT-025` | Page Header | `patterns/page-header.tsx` | [naming-a-screen](patterns/naming-a-screen.md) |
| `DS-PAT-026` | Section Navigation | `patterns/section-navigation.tsx` | [moving-between-sections](patterns/moving-between-sections.md) |

## Primitives

| ID | Primitive | Source |
|---|---|---|
| `DS-ACT-001` | Button | `ui/button.tsx` |
| `DS-DSP-001` | Badge | `ui/badge.tsx` |
| `DS-DSP-002` | Card | `ui/card.tsx` |
| `DS-DSP-003` | Avatar | `ui/avatar.tsx` |
| `DS-DSP-004` | Table | `ui/table.tsx` |
| `DS-DSP-005` | Separator | `ui/separator.tsx` |
| `DS-FBK-001` | Alert | `ui/alert.tsx` |
| `DS-FBK-002` | Progress | `ui/progress.tsx` |
| `DS-FBK-003` | Skeleton | `ui/skeleton.tsx` |
| `DS-FRM-001` | Input | `ui/input.tsx` |
| `DS-FRM-002` | Textarea | `ui/textarea.tsx` |
| `DS-FRM-003` | Label | `ui/label.tsx` |
| `DS-FRM-004` | Checkbox | `ui/checkbox.tsx` |
| `DS-FRM-005` | Radio Group | `ui/radio-group.tsx` |
| `DS-FRM-006` | Switch | `ui/switch.tsx` |
| `DS-FRM-007` | Select | `ui/select.tsx` |
| `DS-NAV-001` | Tabs | `ui/tabs.tsx` |
| `DS-OVR-001` | Dialog | `ui/dialog.tsx` |
| `DS-OVR-002` | Dropdown Menu | `ui/dropdown-menu.tsx` |
| `DS-OVR-003` | Tooltip | `ui/tooltip.tsx` |
| `DS-OVR-004` | Sheet | `ui/sheet.tsx` |

## Adding one

Markup repeating once is not a reason to extract a component. A new pattern needs a product
problem that an accepted screen contract already has, and it arrives with its implementation,
its component tests, a deterministic synthetic fixture, its gallery states and its named
evidence, or it does not arrive. See [README.md](README.md).
