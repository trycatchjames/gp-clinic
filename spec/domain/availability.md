# Availability

## Purpose

Availability answers when a practitioner and required resource may be offered or booked. It combines recurring working sessions, dated exceptions and existing reservations.

## Concepts

- **session template:** recurring local-time interval for practitioner/location, with effective date range and allowed appointment types;
- **exception:** leave, closure, added session or modified interval for a date/range;
- **block:** an operational reservation that may be hard (not bookable) or soft (authorised override);
- **resource availability:** room/equipment intervals and capacity;
- **booking policy:** lead time, horizon, duration increments, overlap and overbook rules.

## Invariants and rules

1. Availability is evaluated in the location timezone with daylight-saving behaviour resolved to instants.
2. Recurring sessions have positive duration and non-overlapping effective dates where they would create contradictory policy.
3. Dated exceptions take precedence over templates; an explicit closure takes precedence over an added practitioner session unless the location is intentionally reopened.
4. Existing appointments are never silently cancelled or moved when availability changes. Affected bookings appear in an exception-impact worklist.
5. “Available” means all required practitioner, location, policy and resource checks passed at query time; booking must recheck atomically.
6. Find-next-available returns explainable slots and its search range/filters; it never guarantees a slot until booked.
7. Leave/unavailability is not a patient appointment and must not leak confidential reason text on shared calendars.
8. An exception or block retains creator, reason category, dates and change history.

## Availability lifecycle

Session templates and exceptions use `draft → active → retired`; a draft has no booking effect. Activation validates timezone, dates and conflicts with configuration but does not rewrite appointments. Retirement stops future generation after its effective end.

A practitioner absence uses `planned → active → ended` or `cancelled`. On creation/extension, the system identifies affected appointments and owned clinical obligations. The absence cannot be considered operationally resolved until the worklist is assigned, even though the unavailable interval takes effect immediately.
