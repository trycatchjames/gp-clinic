# In-Practice Emergencies

**Status:** `specified`

## Purpose

RACGP **C3.3** requires the practice to have an emergency response plan, **GP5.2** requires
appropriate equipment, and **GP5.3** covers the doctor's bag. When someone collapses in the
waiting room, software's job is to be out of the way — and then to make sure the record is
complete afterwards.

## The workflow

### During

1. **Emergency mode** is one action from any screen. It:
   - Creates an encounter immediately, with a running clock
   - Opens a minimal recording surface: time-stamped entries, observations, interventions,
     medicines given
   - Surfaces the patient's allergies, current medicines and active problems
   - Surfaces the practice's emergency contacts and the location's address in a form that can be
     read to 000
2. Recording is designed for someone doing something else with their hands: large targets,
   one-tap timestamps for common interventions (CPR started, adrenaline given, oxygen on,
   defibrillator applied), and free text.
3. Ambulance called, arrival time and handover time recorded.

### After

1. Complete the clinical record while it is fresh.
2. **Incident record** created automatically — the emergency is a QI event whether or not anything
   went wrong (QI3.1).
3. **Debrief** recorded: what happened, what worked, what didn't, actions.
4. **Equipment and drug check**: what was used from the emergency kit and the doctor's bag, so it
   is restocked. The system creates the restock task and tracks it to completion.
5. **Open disclosure** where relevant (QI3.2): what the patient and family were told, by whom.

### Readiness

Between emergencies, the software tracks the things that determine whether the next one goes well:

- Emergency drug and equipment register with expiry dates and check schedule
- Defibrillator check log with pad and battery expiry
- Oxygen cylinder levels
- Doctor's bag contents and expiry (GP5.3)
- Staff CPR and anaphylaxis training currency
- Emergency response plan review date and drill records

Expiries and overdue checks generate tasks; overdue items appear on the practice dashboard.

## Rules and constraints

1. Emergency mode is reachable from every screen for every clinical user, in one action.
2. An emergency encounter can always be created, even for an unregistered person — a "walk-in
   collapse" record can be created without a full patient registration and reconciled later.
3. Every in-practice emergency creates an incident record.
4. Used emergency stock generates a restock task tracked to completion.
5. Emergency equipment expiries are tracked and surfaced before they lapse, not after.

## Data touched

`encounters`, `emergency_events`, `emergency_event_entries`, `incidents`, `debriefs`,
`emergency_equipment`, `equipment_checks`, `tasks`, `staff_training_records`.

## Offline behaviour

**Fully supported and prioritised.** An emergency during an internet outage is the worst possible
time to lose the software. Emergency mode works entirely offline against cached data and queues
everything.

## Standards mapping

C3.3 Emergency response plan · GP5.2 Practice equipment · GP5.3 Doctor's bag ·
QI3.1 Managing clinical risks · QI3.2 Open disclosure · C8.1 Education and training of
non-clinical staff

## Feature files

`features/clinical/in-practice-emergency.feature`,
`features/clinical/emergency-equipment-readiness.feature`
