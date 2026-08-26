# Appointment state model

## Canonical operational states

```text
scheduled → arrived → waiting → in_consultation → at_billing → completed
scheduled/arrived/waiting → cancelled
scheduled/arrived/waiting → did_not_attend
scheduled → rescheduled (historical transition marker; current appointment returns to scheduled)
any non-final state → entered_in_error (privileged correction)
```

`waiting` may be entered with arrival or later after reception/nursing preparation. `at_billing` may be skipped when no billing handoff is needed. An appointment can be `scheduled` in the past while awaiting explicit DNA/cancel/administrative resolution; time does not silently change state.

| Transition | Permission/actor | Preconditions | Side effects/audit |
|---|---|---|---|
| create → scheduled | `appointment.create` | patient/hold valid; interval and resources valid | creation event and booking source |
| scheduled → arrived | `appointment.arrive` | identity verified; not cancelled | actual arrival time, waiting entry |
| arrived ↔ waiting | `appointment.flow.manage` | current visit | timestamp/reason when moved back |
| arrived/waiting → in_consultation | authorised practitioner/clinical delegate | patient context confirmed; no other active encounter conflict | create/link encounter; record starter |
| in_consultation → at_billing | encounter completer | encounter completion succeeds | billing handoff only; no clinical content exposed |
| at_billing → completed | `billing.finalise` or no-charge authorised flow | required billing disposition exists | completion time |
| scheduled/arrived/waiting → cancelled | `appointment.cancel` | reason required; warn if arrived | release capacity; retain history; notify linked obligations |
| eligible non-final → did_not_attend | `appointment.dna` | configured time threshold or override | retain slot/history; notify linked recall/task |
| active scheduled → rescheduled | `appointment.reschedule` | new interval atomically validates | old/new schedule audit; reminder delivery becomes stale |

Invalid transitions return the current state and allowed next actions. No transition is inferred from opening a screen.
