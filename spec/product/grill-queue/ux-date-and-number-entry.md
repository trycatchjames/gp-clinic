---
area: ux
blocked-by: []
needs-review: [clinical-safety]
---

# Entering dates and numbers

## Decide

- Whether dates are typed (`DD/MM/YYYY`), picked from a calendar, or both, and which is the
  default for a date of birth, an appointment and a result date.
- How a partial date is entered and shown, such as a year only for a past operation.
- How times, durations, doses and measurements are entered, with their units.
- Whether identifiers such as Medicare, IHI, DVA and provider numbers are typed with or without
  spaces, and how they are formatted once entered.

## Why we're asking

A misread date or unit is a clinical risk. The specification already says to show dates in
Australian order and never to fill in a missing day or month, but says nothing about entering
them. Calendar pickers are slow for dates of birth and easy to mis-click; typed dates risk US
order from habit. Every clinical form will need this.

## Examples

- A receptionist enters a date of birth as 03/04/2019. Is that 3 April, and how does the screen
  confirm it ("3 April 2019")?
- A GP records a past appendicectomy as "2019" only. Does the field accept that without
  inventing 01/01/2019?
- A nurse records a weight of 72.5 kg and a height of 1.75 m. Are units chosen or fixed?
- A practice manager pastes a provider number with a space in it.

## Starts from

- [Dates, times, identifiers and numbers](../experience/web-patterns.md#dates-times-identifiers-and-numbers).
- The [dates and times requirements](../../cross-cutting/dates-and-times/).
- `apps/web/src/lib/formatters.ts`, which formats values for display.

## Blocks

Patient registration; every clinical form.
