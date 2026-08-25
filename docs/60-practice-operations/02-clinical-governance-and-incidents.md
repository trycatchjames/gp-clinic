# Clinical Governance, Incidents and Open Disclosure

**Status:** `specified`

## Purpose

RACGP **QI3.1** requires a system for managing clinical risks and **QI3.2** requires open
disclosure. A practice needs somewhere for near misses to go that isn't a conversation in the tea
room.

## Who does it

Anyone can report; the Practice Manager and a nominated clinical governance lead manage.

## The workflow

### Reporting an incident

Reporting must be **fast and low-friction**, or it doesn't happen. From any screen: what happened,
when, who was involved, was a patient affected, and immediate actions taken. Two minutes, maximum.

Incident categories:

| Category | Examples |
|---|---|
| Medication | Wrong drug, wrong dose, missed allergy, prescribing error |
| Diagnosis and results | Missed or delayed result, missed follow-up, delayed diagnosis |
| Documentation | Wrong patient record, missing information |
| Identification | Wrong patient |
| Infection control | Sterilisation failure, sharps injury, exposure |
| Cold chain | Temperature excursion |
| Equipment | Failure, unavailability |
| Privacy | Unauthorised access, misdirected communication, lost device |
| Behaviour | Aggression toward staff or patients |
| Emergency | In-practice emergency |
| Near miss | Anything that almost happened |

### Managing an incident

1. **Triage** by severity and whether a patient was harmed.
2. **Investigate** — timeline, contributing factors, and specifically *system* factors rather than
   individual blame. A clinical incident system that produces blame stops receiving reports within
   a month.
3. **Actions** with owners and due dates, tracked to completion.
4. **Open disclosure** where a patient was harmed (QI3.2): what the patient was told, by whom,
   when, what apology was made, what the practice is doing. Recorded.
5. **Close** with a summary and lessons.
6. **Trend** — recurring categories, contributing factors and locations surfaced to the governance
   lead. A single missed result is an event; four in a quarter is a system problem.

### Privacy incidents

Handled with extra structure because of the notifiable data breach regime: what data, how many
people, containment actions, risk of serious harm assessment, and whether notification is
required. The workflow prompts for the assessment; it does not make the determination.

### Significant event analysis

For serious incidents, a structured review: what happened, why, what was learned, what changed.
This is also a recognised CPD activity for the clinicians involved, so the record doubles as
evidence.

## Rules and constraints

1. Incident reporting is available from every screen and takes under two minutes.
2. Anonymous reporting is possible; a named reporter is preferred but never required.
3. Incidents involving patient harm require an open disclosure record before closure.
4. Actions have named owners and due dates and are tracked to completion.
5. Incident records are separate from the clinical record but linked to it where a patient was
   involved.
6. Trend reporting is produced automatically.

## Data touched

`incidents`, `incident_actions`, `open_disclosures`, `significant_event_analyses`,
`privacy_breach_assessments`, `tasks`.

## Offline behaviour

Reporting can be queued offline — a near miss noticed during an outage is exactly the thing that
gets forgotten otherwise.

## Standards mapping

QI3.1 Managing clinical risks · QI3.2 Open disclosure · C3.2 Accountability and responsibility ·
C3.5 Work health and safety · C6.3 Confidentiality and privacy

## Feature files

`features/practice-operations/incident-reporting.feature`,
`features/practice-operations/open-disclosure.feature`,
`features/practice-operations/privacy-breach.feature`
