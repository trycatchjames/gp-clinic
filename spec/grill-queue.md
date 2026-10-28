# Grill queue

Topics waiting for a [grill session](../FLOW.md#the-grill-session), in the order to take them.
Say "Grill me" to start the first topic whose blockers are settled, or "Grill me on <topic>" to
take another.

Each topic ends in a proposal, its promotion into `spec/`, and the slices it releases. When a
session finishes, remove the topic here in the same pull request; when it defers part of one, add
the deferred part where its dependencies put it.

Every topic below began as an entry in
[research/open-questions.md](research/open-questions.md). Settling one here removes it from there.

## How a topic is ordered

By what it unblocks. The built product today is patient search, practice onboarding and the
shared experience patterns, so the queue starts with what the next buildable screens need.

**Needs research first** means a grill session would otherwise have to guess a fact about
Australian general practice. The agent researches and grounds its recommendation before asking;
the PM still decides.

---

## Ready to take

### 1. The duplicate warning during a live call

**Decides.** What a receptionist sees when a new patient may already exist, how hard the warning
is, and what they may do anyway — especially for newborns, twins, aliases and family members
sharing a surname, address or phone number.

**Unblocks.** Patient registration, and the duplicate-review and merge screen that patient search
already redirects to. The record-comparison pattern has no shipped consumer until this lands.

**Needs research first.** No. Patient search and its restricted-record behaviour are already
specified and built.

### 2. Confirming demographics at a public desk

**Decides.** Which fields are safe to read aloud at a front desk, when private self-entry or
rooming should be offered instead, and what the screen shows when someone is standing within
earshot.

**Unblocks.** Patient registration and the demographics view.

**Needs research first.** No.

### 3. What stays visible in the health summary

**Decides.** Which health-summary items must remain on screen at all times versus one interaction
away, across paediatrics, antenatal care, mental health and multimorbidity.

**Unblocks.** The patient record workspace — the first real consumer of the page-header,
section-navigation, record-history and summary-list patterns.

**Needs research first.** Partly. What existing Australian software keeps visible, and why, is
worth establishing before recommending.

### 4. Minors, guardians and family access

**Decides.** Who may see and change a record for a minor, a mature minor, a patient with a
guardian or substitute decision-maker, and what happens in a separated family.

**Unblocks.** Patient registration, record access and the restricted-record rules already
partly built in patient search.

**Needs research first.** Yes. State and territory law differs and none of it is established in
`research/` yet. Do not grill this before the research exists.

### 5. Calendar density and keyboard flow

**Decides.** How the calendar reads and is driven at 5, 15 and 50 concurrent bookings, how
practitioners are grouped, and the keyboard route through a booking.

**Unblocks.** Appointment management and the calendar capability.

**Needs research first.** Partly. Worth establishing how existing software handles a busy
multi-practitioner day.

### 6. Urgent, walk-in, telehealth and interpreter needs

**Decides.** How these are communicated on the calendar and in the appointment record without
clinical oversharing to staff who should not see it.

**Unblocks.** Appointment management, and depends on topic 5.

**Needs research first.** No.

---

## Waiting on research

These need sourced facts before a session. Ask for the research first.

- **Record retention and destruction** — state and territory rules, correction, and
  deceased-patient handling, for each intended deployment and ownership model.
- **Sensitive-record segmentation** — whether hiding existence, content or both is lawful and
  safe in each context. Patient search already ships a restricted stub; this decides whether that
  behaviour is right everywhere else.
- **Anonymous and pseudonymous service** — the lawful scenarios and what they mean for billing.
- **Export and redaction** — third-party information, subpoenas, insurers and patient access
  requests.
- **Prescription form and scheduled-medicine requirements** — jurisdiction-specific, including
  real-time monitoring.
- **Audit proportionality** — whether each proposed audit event and monitoring report is
  proportionate under the Australian Privacy Principles.
- **Fee-schedule inheritance** — mixed billing, practitioner discretion, consumables and multiple
  locations. Touches MBS rules that changed in 2025 and must be reverified.
- **Care-plan structure after the July 2025 chronic-condition changes** — without encoding
  mutable MBS eligibility rules.

---

## Clinical topics

The PM settles these like any other, but a recommendation here must be grounded in sourced
practice rather than asserted, and the safety consequence is recorded with the decision. See
[grounding a recommendation](../FLOW.md#grounding-a-recommendation).

- **Hard stops and overrides** — every override path for wrong-patient risk, allergy uncertainty,
  prescription issue, result closure and duplicate merge.
- **"No known allergies"** — whether it needs a review date, and when staleness is shown.
- **Patient-authored versus clinician-authored alerts** — safe display and escalation.
- **Critical-result escalation** — timers and after-hours handover as practice policy rather than
  fixed software defaults.
- **Pregnancy, paediatric dosing and high-risk medicines** — safe representation with no
  maintained decision-support database.
- **Minimum handover package** — when responsibility for results, recalls or care plans changes.
- **Structured consultation fields** — the minimum that gives safety and reporting value without
  slowing diverse consulting styles.
- **Result dispositions and urgency labels** — matching real practice policy without implying
  decision support the product does not have.
- **Shared and delegated inbox cover** — for part-time GPs, locums and registrars.
- **Diagnosis to problem list** — when a diagnosis entered in a consultation is proposed for the
  longitudinal problem list, and how explicit that promotion must be.
- **Internal prescription states** — the issue and cancellation states needed before any
  electronic prescribing integration exists.

---

## Practice operations

- **Day-one reports** — which are operationally essential, and which pose unacceptable
  re-identification or staff-surveillance risk.
- **Rooms and equipment** — how they are actually reserved across appointment types, and whether
  a resource conflict is hard or overridable.
- **Configurable status names** — which may be renamed locally while canonical analytics states
  are preserved.
- **Appointment change confirmation** — which changes need confirming versus a one-step action
  during peak call volume.

---

## Parked: outside Version 1

Version 1 connects to no external service, so these are not grill topics. They stay in
[research/open-questions.md](research/open-questions.md) and are revisited only when
[product/future-integrations.md](product/future-integrations.md) opens a boundary.

Medicare, AIR, electronic prescribing and My Health Record conformance · pathology and radiology
message semantics · secure messaging delivery and directories · external terminology and
medicine-safety knowledge bases · online booking identity matching · payment reversal and
accounting export.
