# Investigations: Pathology and Imaging Requests

**Status:** `specified`

## Purpose

Order the test, and — far more importantly — make sure the result comes back and is acted on.
An ordered test that nobody follows up is the most common serious failure mode in general
practice, and RACGP **GP2.2 (Follow-up systems)** exists because of it.

## Who does it

GP, GP Registrar, Nurse Practitioner. Practice Nurse for protocol-driven tests.

## The workflow

### Ordering

1. From within the consultation, select tests. Common panels are grouped (FBC/UEC/LFT/lipids/HbA1c;
   iron studies; TFTs; MSU; CXR; ultrasound).
2. Record the **clinical indication** — required, because it drives Medicare eligibility for the
   test, appears on the request form for the pathologist or radiologist, and is what makes the
   result interpretable when it returns in three weeks.
3. Set **urgency**: routine, urgent, or "phone result".
4. For imaging, record the specific clinical question. "Sore knee" is not a clinical question.
5. Choose the provider (a preferred provider list per practice, patient choice always available).
6. Generate the request: printed, or sent by secure messaging where the provider supports it.
7. **An outstanding investigation record is created.** This is the crucial step — the request is
   tracked from the moment it's made, with an expected return window based on the test type.

### Tracking

The **outstanding investigations** view, per practitioner and per practice, shows:

- Tests ordered but not returned within the expected window
- Tests where the patient appears not to have attended the collection centre
- Urgent tests outstanding beyond 24/48 hours

Two failure modes this catches that a results inbox alone does not:

1. The patient never went for the test.
2. The result went to a different provider or was misfiled.

Neither generates an inbox item, so neither is visible without explicit tracking.

### Return

See [05-results-and-recalls.md](05-results-and-recalls.md).

## Rules and constraints

1. Every request records ordering practitioner, date, indication and urgency.
2. Every request creates an outstanding-investigation record that must be closed by a matched
   result or an explicit "not proceeding" with a reason.
3. Urgent and "phone result" requests carry a shorter escalation window and a named responsible
   practitioner who cannot be "the practice".
4. Requests are bound to an encounter.
5. Medicare eligibility rules for pathology and imaging (including who may request what) are
   surfaced at ordering, and a request that will not attract a rebate says so before it is printed.

## Data touched

`investigation_requests`, `investigation_request_items`, `outstanding_investigations`,
`results`, `providers`, `encounters`.

## Offline behaviour

Requests can be created and printed offline. Secure-message transmission queues. The outstanding
investigation record is created locally and syncs.

## Standards mapping

GP2.2 Follow-up systems · C5.1 Diagnosis and management of health issues · C5.3 Clinical handover ·
QI3.1 Managing clinical risks

## Feature files

`features/clinical/investigation-requests.feature`,
`features/clinical/outstanding-investigations.feature`
