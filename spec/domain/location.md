# Location

## Purpose and attributes

Location represents where care or practice work occurs and provides the calendar timezone and place-of-service context. Attributes include name, physical/postal address, phone, Australian timezone, opening hours, active dates, rooms/resources, after-hours contact policy, and local provider/billing configuration.

## Relationships

Location belongs to one practice; has practitioner-location associations, availability, appointments, encounters, resources and fee schedule resolution. A remote/telehealth encounter still records the responsible practice location and encounter mode separately.

## Invariants and rules

1. Every appointment has exactly one location, including a configured virtual/visiting location where appropriate.
2. Every location has one IANA Australian timezone; display and scheduling use that timezone, not the viewer's device timezone.
3. Changing a location timezone cannot move historical instants or silently move future appointments.
4. Inactivation is blocked or requires explicit migration/cancellation of future appointments and coverage of open operational queues.
5. Rooms/resources belong to a location and cannot be allocated across locations for the same interval.
6. Place-of-service and practitioner-at-location facts are captured at encounter/invoice issue time so later configuration changes do not alter history.
