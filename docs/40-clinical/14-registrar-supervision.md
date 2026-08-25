# Registrar Supervision and Teaching

**Status:** `specified`

## Purpose

Most Australian general practices train registrars. Supervision is a clinical safety requirement,
an accreditation requirement (**GP3.1**), and a training-program requirement — and it is almost
entirely unsupported by existing practice software, which is why it's here.

## Who does it

GP Supervisor, GP Registrar, Practice Manager (rostering and evidence).

## The workflow

### Supervision arrangements

Each registrar has a recorded supervision relationship: supervisor, supervision level (`direct`,
`indirect`, `remote`), training term (GPT1/GPT2/GPT3/Extended Skills), training organisation, and
effective dates.

The supervision level determines a runtime rule: if the level requires a supervisor **on site**,
the roster is checked when the registrar's sessions are scheduled, and sessions without supervisor
cover are flagged before they happen, not after.

### In-consultation escalation

The registrar can, from inside the consultation:

- **Ask now** — an urgent request to the supervisor with the patient, the question and the note
  attached. It appears immediately on the supervisor's screen and is acknowledged.
- **Flag for review** — non-urgent; the encounter goes to the supervisor's review list.
- **Request a joint consultation** — the supervisor joins.

Every escalation records what was asked, who responded, what was advised, and when. This is both
a safety record and evidence for the training organisation.

### Random case analysis and teaching

- The supervisor can pull a random sample of the registrar's recent encounters for review
- Reviewed encounters carry a review record with feedback
- Teaching sessions are recorded with date, duration, topics and attendees — required evidence for
  the training program and for the practice's own accreditation

### Prescribing and ordering oversight

Configurable per registrar and per term: certain actions (S8 prescribing, high-risk medicines,
some imaging) can require supervisor co-sign before issue. Co-sign requests appear in the
supervisor's queue with the full clinical context.

## Rules and constraints

1. A registrar cannot be activated without a current supervision relationship.
2. Sessions requiring on-site supervision are flagged when no supervisor is rostered.
3. Escalations are acknowledged, and unacknowledged urgent escalations escalate further.
4. Every supervision interaction is recorded and reportable.
5. Co-sign requirements block the action until signed, and the registrar is told why.
6. Supervision records are retained as practice accreditation evidence.

## Data touched

`supervision_relationships`, `supervision_events`, `encounter_reviews`, `teaching_sessions`,
`cosign_requests`, `session_templates`, `tasks`.

## Offline behaviour

Escalation is **online-only** — an escalation that sits in a queue is not an escalation, and the
UI says so explicitly and directs the registrar to speak to their supervisor.

## Standards mapping

GP3.1 Qualifications, education and training of healthcare practitioners ·
C5.2 Clinical autonomy for practitioners · C3.4 Practice communication and teamwork ·
QI3.1 Managing clinical risks

## Feature files

`features/clinical/registrar-supervision.feature`,
`features/clinical/supervisor-escalation.feature`,
`features/clinical/case-review-and-cosign.feature`
