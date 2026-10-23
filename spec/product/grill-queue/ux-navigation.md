---
area: ux
blocked-by: []
needs-review: []
---

# Navigation

## Decide

- The sidebar's sections and their order.
- Where Appointments, Inbox, Billing, Reports and Recalls will live before they exist.
- How the practice and location context show, and how someone working across locations
  switches.
- Whether settings sit in the main sidebar or behind their own area.
- A navigation map naming the capability behind each entry, kept up to date as capabilities
  land.

## Why we're asking

Today the sidebar mixes everyday work (Find a patient) with setup (Practice details, Locations,
Booking setup) and reference (MBS reference). As appointments, results and billing arrive,
each agent will place its screen wherever seems reasonable unless there is a map. Moving
navigation later breaks people's habits and bookmarks.

## Examples

- A new capability adds the appointment book. Top of the sidebar, or under Patients?
- A practice manager wants to change opening hours. Do they look under Settings or Locations?
- A GP works Mondays at one location and Thursdays at another. Where do they see and change
  which location they are working in?

## Starts from

- `apps/web/src/components/app-shell.tsx`.
- [Workflows](../workflows.md) and [roles](../roles.md).
- SmoothPay's web navigation map, which lists each slot and the capabilities that fill it.

## Blocks

Placing every new area; record pages; setup steps; speed at the desk.
