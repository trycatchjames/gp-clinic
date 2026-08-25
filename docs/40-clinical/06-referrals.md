# Referrals

**Status:** `specified`

## Purpose

Send the patient to the right person with the right information, and close the loop when the reply
comes back. RACGP **GP2.3 (Engaging with other services)** and **C5.3 (Clinical handover)** both
land here.

## Who does it

GP, GP Registrar, Nurse Practitioner.

## The workflow

### Creating a referral

1. Choose the referral target: a named specialist, a service, a hospital outpatient department, an
   allied health provider, or a public service where the patient chooses on arrival.
2. The referral letter is generated with: reason for referral, relevant history, examination
   findings, current medicines, allergies, relevant results (attached), and the specific question
   being asked.
3. **Urgency**: routine, urgent, or immediate (with a phone call, logged).
4. **Duration**: standard GP referrals to a specialist are valid for **12 months** from the date
   of the first specialist visit unless marked indefinite; referrals to consultant physicians have
   their own rules. The system records validity and warns when a re-referral is needed.
5. Delivery: secure messaging where supported, otherwise fax or print. Every delivery attempt is
   logged.
6. **An open referral record is created** with an expected reply window.

### Allied health under a care plan

Where the patient has a GP Chronic Condition Management Plan, referrals to allied health under the
plan are generated from it, carry the plan reference, and count against the patient's annual
allocation. The system tracks how many services remain.

Note the transition rule: patients who had a GPMP and/or TCA in place before **1 July 2025** can
continue to access allied health services consistent with those plans until **1 July 2027**, so
the software tracks allocations against both plan types during the transition.

### Closing the loop (the part that matters)

- Referrals without a reply within the expected window appear on an **open referrals** list per
  practitioner.
- When a specialist letter arrives, it is matched to the open referral, filed to the patient
  record, and the referral closes.
- Letters arriving with no matching referral go to the unmatched correspondence queue.
- Actions arising from a specialist letter (medication change, new diagnosis, further tests) are
  **explicitly extracted** — the GP records what they are doing about it. A specialist letter that
  is read and filed without action is a handover failure.

## Rules and constraints

1. Every referral records the reason, the question, the urgency and the recipient.
2. Every referral creates a tracked open item until a reply is received or it is explicitly closed
   with a reason.
3. Referral letters include current medicines and allergies — always, automatically.
4. Referral validity is tracked and re-referral prompted before expiry.
5. Urgent referrals require a recorded phone or secure-message confirmation of receipt.
6. The patient is told what the referral is for, who it is to, and what to expect — recorded as
   part of informed decision-making (C1.3).

## Data touched

`referrals`, `referral_deliveries`, `referral_replies`, `documents`, `care_plans`,
`care_plan_allied_health_allocations`, `tasks`.

## Offline behaviour

Referral letters can be drafted and printed offline. Secure transmission queues. Matching replies
is online-only.

## Standards mapping

GP2.3 Engaging with other services · C5.3 Clinical handover · GP2.2 Follow-up systems ·
C1.3 Informed patient decisions

## Feature files

`features/clinical/referrals.feature`, `features/clinical/referral-loop-closure.feature`
