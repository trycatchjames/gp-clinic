# Dates and times

## Australian display

- Dates display as `DD/MM/YYYY` (for example `03/04/2027`) with no US month-first fallback.
- Human-readable forms SHOULD use `3 April 2027` where ambiguity or safety warrants.
- Time uses practice-configurable 12/24-hour display but includes minutes and timezone when crossing locations or in audit/export.
- Week starts Monday; locale is Australian English.

## Storage and context

- An event timestamp stores an unambiguous instant plus the location/practice timezone context used for display when relevant.
- Future schedules/recurrences are defined in a location's IANA timezone and resolved per occurrence, including Australian daylight-saving transitions.
- Date-only clinical facts (DOB, onset, due date) remain date/precision values and are not converted to midnight instants.
- Partial/estimated dates retain precision (`year`, `month`, `day`, `estimated`, `unknown`). UI never invents missing components.
- Server time determines recorded/audit/issue instants; client time may be captured as diagnostic metadata only.

## Scheduling and due behaviour

Intervals are half-open `[start, end)` for conflict checking, so adjacent appointments do not overlap. Day/week boundaries use location time. “Today”, “overdue”, wait duration and age are computed in explicit context and update predictably. Changing practice/location timezone does not reinterpret historical instants.

## Input

Date input accepts unambiguous Australian formats and provides a calendar alternative. Two-digit years are rejected for clinical/identity dates. The parsed full date is shown before high-risk commit when text input could be ambiguous.
