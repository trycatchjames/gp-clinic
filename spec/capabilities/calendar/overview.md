# Calendar

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

See [`screens`](screens), [`acceptance`](acceptance), [`../appointment-management`](../appointment-management) and domain states in [`../../domain/appointment`](../../domain/appointment).
