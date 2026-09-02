# Calendar

## Dependencies

- Domains: [appointment](../../domain/appointment/overview.md), [availability](../../domain/availability/overview.md), [location](../../domain/location/overview.md), [patient](../../domain/patient/overview.md), [practitioner](../../domain/practitioner/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

Calendar lets reception, clinicians and managers understand capacity and current clinic flow, find suitable time and act on appointments without losing practitioner/location/date context.

## Primary tasks

View one or many practitioner day books; view a practitioner week; filter location/practitioner/type; identify working, blocked and unavailable time; find next available; select/create/open/move an appointment; mark arrival/DNA/cancellation; monitor waiting and consultation/billing handoff.

## Inputs and outputs

Inputs: location timezone, practitioner availability/exceptions, appointment types, rooms/resources, patient administrative summary, permissions and current appointments. Outputs are commands to Appointment/Availability; the calendar itself owns no records.

## Related domains/capabilities

Appointment, Availability, Location, Practitioner, Patient; appointment management, patient search, consultations and billing.

## Important constraints

- Day/multi-practitioner day is the primary reception view; practitioner week supports capacity planning. A month view, if added, is navigation/summary only.
- Appointment duration is spatially meaningful; unavailable time never looks bookable; current time and actual status are identifiable without colour alone.
- Dragging only proposes a reschedule and has an accessible keyboard/menu equivalent. Validation occurs on commit and failure leaves the original unchanged.
- Dense normal/busy days remain legible and keyboard efficient.

## Out of scope

External/online booking, automated reminders, video platform integration and clinical triage decisions.

## Contracts

See the [screen contracts](#screen-contracts), [acceptance examples](acceptance.feature), [appointment-management capability](../appointment-management/spec.md) and [appointment domain](../../domain/appointment/overview.md).

## Rules

1. Calendar working date and appointments display in selected location timezone; changing location recalculates the view and never mutates bookings.
2. Only active appointments consume ordinary capacity. Cancelled/DNA may be optionally shown as historical overlays and are never draggable as active bookings.
3. Practitioner sessions, leave, closures, blocks and resource constraints are visually distinct from empty bookable time.
4. Selecting an empty slot proposes a start/practitioner/location. The editor requires patient/hold, type and positive duration before save.
5. Creating/moving revalidates availability, overlaps and resources atomically. A stale visual slot may therefore fail safely with the latest reason.
6. Double-book is unavailable unless policy and `appointment.overbook` permit it; confirmation names conflicting bookings without disclosing clinical notes and requires reason.
7. Status transitions expose only currently valid actions. Time passing never automatically marks arrival/DNA/completion.
8. Current time appears only when the selected day is current in the selected location.
9. Waiting duration uses actual arrival/waiting time; scheduled lateness and waiting duration are separate.
10. Calendar patient snippets and notes respect administrative permissions and sensitive-record restrictions.

## Appointment card information

Mandatory: patient/hold display, start, duration (also spatial), status and practitioner in views where column identity is not sufficient. Secondary: type, visit mode, arrival/wait signal, resource/recall/add-on/reception-safe flags. Full contact, history and action details appear on selection, not all cards.

## Keyboard model

Tab/roving-grid navigation reaches filters, date controls, time slots/cards and context actions. Arrow keys move within the time/practitioner grid with an announced destination; Enter opens; a command opens “move appointment” without requiring drag. Product-wide shortcuts may be introduced only after user testing and published help.

## Interactions

## Book from an empty slot

Activating an empty bookable slot opens the appointment editor prefilled with selected location, practitioner, date and start. Appointment type sets a default duration/resources but the user sees and may alter allowed fields. Patient search occurs inside the editor. Save runs conflict validation; success inserts the committed appointment and focuses it, while failure preserves the editor and calendar.

## Open and act

Selecting a card opens the appointment panel without navigating away. It shows identity, schedule, status history, reception-safe note, future/nearby bookings and permitted next actions. Opening the full patient administrative/clinical record is a separate permission-aware action.

## Reschedule

Drag or “Move” changes a proposal only. The target interval is highlighted with availability/conflict explanation. Drop/confirm opens a concise review when practitioner/location/date or conflict changes. Successful save records old/new schedule. Failure snaps visually to the committed slot and explains why; it never duplicates the appointment.

## Arrival and waiting

Mark Arrived prompts/records required identity verification and actual arrival. The appointment appears in waiting-room read model. Starting consultation is a clinical action and creates/links an encounter. Completion may move to billing handoff only after encounter completion succeeds.

## Multiple edits

If another user changes the selected appointment, the panel shows a version-conflict banner and refresh option while preserving any unsaved editor input. Calendar live updates never steal focus or close an editor.

## Permissions

- `appointment.view` sees calendar cards with permission-filtered identity/notes.
- `appointment.create/edit/reschedule/cancel/arrive/dna/flow.manage` independently enable actions.
- `appointment.overbook` adds the reasoned override; it does not allow booking during hard closure unless a separate approved policy says so.
- `availability.view/manage` controls session/block display versus mutation.
- `clinical.summary.view` is required to open clinical record; the calendar never leaks it to reception.
- A practitioner may be granted flow actions for their own book without general scheduling administration.
- Practice managers may see operational metrics without clinical appointment reasons. System administrators receive no calendar patient content by default.

## Screen contracts

### Screen contract: Appointment editor

#### Purpose and entry

Creates or proposes changes to an appointment. Entry from an empty slot pre-fills location/practitioner/date/time; entry from a card pre-fills committed values and expected version.

#### Regions and fields

1. Patient/hold selection with embedded patient search and “register provisional” permission path.
2. Schedule: location, practitioner, date, start, duration/end and timezone.
3. Type/mode/resources: defaults visibly applied and editable within policy.
4. Operational detail: reception-safe booking reason/note, add-on/urgency/recall association.
5. Optional recurrence: finite pattern/end, occurrence preview and per-occurrence conflicts.
6. Validation/conflicts and cost/booking-policy information where configured.
7. Save/cancel actions with dirty/save state.

Patient, practitioner, location, start and positive duration are required for patient booking; structured purpose replaces patient for a hold. Changing type may propose duration/resource changes but never overwrites user changes without confirmation.

Recurring save creates separate occurrences and returns itemised conflicts before commit. Editing a series requires an explicit scope: this occurrence or this-and-future. Past/completed occurrences are immutable to the series edit.

#### Behaviour

Patient candidates show distinguishing identity and require deliberate selection. Duplicate/future appointment warnings are non-destructive. Save rechecks all rules. Closing a dirty editor prompts keep editing/discard; autosaved draft is never shown on calendar as a booking.

#### Failure/accessibility

Field validation is inline and summarised; conflict focuses the explanation, not the underlying page. Keyboard order follows regions, date/time inputs use Australian parsing, and a non-drag reschedule is complete.

### Screen contract: Appointment panel

#### Purpose

Shows enough detail and history to coordinate one appointment and offers only valid next actions.

#### Required information

Patient/hold identity and status; three-identifier verification state (not the identifiers spoken aloud); date/start/duration/timezone; practitioner/location/type/mode/resources; current state and actual transition times; reception-safe notes/flags; linked recall indicator without protected reason; created/last changed metadata and reschedule/cancel history; nearby/future bookings warning.

#### Actions

Edit allowed fields, move, cancel, arrive, waiting-flow change, DNA, start consultation, billing handoff open, copy a new booking, open permitted patient view. Invalid transitions are absent or disabled with reason—not offered to fail mysteriously.

#### States/failure

Loading retains selected card highlight. If deleted-like correction/merge redirect occurred, show historical status/redirect. Concurrent change displays latest committed version and preserves any local edit in the editor. Save/cancel confirmation names the appointment and consequence.

#### Privacy

Clinical reason/results/recall details never appear merely because a recall is linked. Contact details are masked until needed and permitted.

### Screen contract: Calendar day

#### Purpose and actors

Helps reception and clinical staff answer: who is booked, what capacity exists, who has arrived/waited, and what action is next for one day.

#### Entry points

Primary navigation, waiting room return, patient future appointment, find-next-available result and appointment link.

#### Layout regions

1. Context header: location, working date, today, timezone and refresh/freshness.
2. Filters: practitioner/group, appointment type/status and optional resource.
3. Practitioner headers: name used, working/absence indicator and book visibility.
4. Time grid: labelled intervals, session/blocked/unavailable backgrounds, current-time marker and appointment cards.
5. Appointment/context panel: selection details and actions.

#### Required information

Grid/card requirements are in [Rules](#rules). Practitioner header must show when no session, on leave or partially unavailable. Current date/time and selected slot/card are unambiguous. Location/timezone remain visible during actions.

#### Actions and behaviour

Navigate previous/next/today or choose date; add from slot; open; move; resize only through an explicit duration proposal; cancel; arrive; DNA; start consultation when authorised; open patient; add block when authorised. Filters do not mutate. Scroll position/focus remain stable on background refresh.

#### Screen states

- **initial/loading:** skeleton retains grid geometry and labelled context; actions disabled until conflicts can be checked;
- **empty:** sessions and bookable slots remain, with “no appointments” not “no availability”;
- **populated/busy:** overlapping permitted appointments render side-by-side/stacked with accessible list alternative;
- **partial failure:** failed practitioner column is marked unavailable/stale; unsafe mutations for it disabled;
- **full failure:** no empty-looking calendar; explicit failure/retry and last-known data labelled read-only if shown;
- **no permission/no location:** explain unavailable scope without patient data.

#### Visual/accessibility semantics

Duration is spatially proportional within the visible scale. Availability, appointment status and warnings are not colour-only. Grid cells/cards have accessible names including date/time/practitioner/status. Drag has menu/keyboard equivalent.

#### Failure behaviour

Editor input is preserved. Conflict names current blocking interval/resource and offers refresh or authorised override. Success toast/message names patient, time, practitioner and action.

### Screen contract: Practitioner week

#### Purpose and actors

Helps reception/practitioners assess one practitioner's capacity and future appointments across a week, and find/move bookings without pretending a multi-practitioner week is readable.

#### Layout and required information

Header shows location, practitioner, week range/timezone and navigation. Columns are Monday–Sunday according to configured visible days; time rows show sessions, exceptions, blocks, current time and appointment cards with the day-card minimum. Summary counts never replace spatial duration.

#### Actions

Filter appointment type/status, book from slot, open/move/cancel permitted appointment, navigate day detail and find next available. Changing practitioner preserves week/location when valid.

#### States and failure

Closed days visibly say closed; no practitioner availability is distinct from no appointments. Partial-day load failure is labelled and not bookable. Dense overlap offers an accessible chronological list for the selected day.

#### Permissions/accessibility

Same as day view. Keyboard movement announces day, time and availability. There is no month-view booking contract in Version 1.

### Screen contract: Find next available

#### Purpose

Finds explainable candidate slots matching patient/practice constraints without claiming a reservation.

#### Inputs

Location(s), practitioner(s)/first available, appointment type/duration, earliest date/time, date range, visit mode and required resource. Patient is optional until booking but may supply practitioner/recall context.

#### Results

Each result shows date in Australian format, local time/timezone, practitioner, location, duration/type fit and any policy caveat. Group by earliest time; do not rank on hidden clinical criteria. Show the exact search filters/range and a “searched through” empty result.

#### Interaction/failure

Selecting opens Appointment Editor with the slot proposal. Saving revalidates; if taken, retain patient/editor details and offer refreshed nearby alternatives. Partial location/practitioner failures are named and excluded, not treated as no availability.

### Screen contract: Waiting room

#### Purpose and actors

Coordinates arrived patients for reception, nurses and practitioners across a selected location without exposing unnecessary clinical detail.

#### Layout and required information

Header with location/current time/filter; ordered table/list; optional selected appointment panel. Each row shows patient identity sufficient to distinguish, practitioner, scheduled time, actual arrival, waiting duration, lateness relative to schedule, appointment type/mode, operational status and reception-safe urgency/resource flags. Clinical users may see a separate permitted safety indicator, not full note content.

#### Actions

Mark waiting/return to scheduled where valid, update operational note, open appointment, start/preview consultation (distinct), send to billing after successful completion, correct mistaken arrival with reason.

#### States and semantics

Empty states “no patients arrived” separately from data failure. Waiting duration updates without resorting/screen focus jumps. Priority sorting is explicit and does not automatically infer clinical urgency. Completed/at-billing patients remain or leave according to filter, never vanish before the transition commits.

#### Failure and permissions

Failed transition leaves row/state unchanged and shows retry. Starting consultation requires clinical authority; reception can never use it to create a clinical entry. Keyboard users can traverse rows/actions and hear updated wait/status.
