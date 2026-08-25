# Prescribing

**Status:** `specified`

## Purpose

Get the right medicine to the right patient safely, through the Australian prescribing
infrastructure: PBS, electronic prescriptions, Real-Time Prescription Monitoring, and
state-based Schedule 8 controls.

## Who does it

GP, GP Registrar, Nurse Practitioner (within scope), and Practice Nurse under standing orders for
specific vaccines and medicines.

## The workflow

### Writing a prescription

1. **Select the medicine** from a curated Australian medicines list (AMT-aligned): generic name,
   brand, form, strength.
2. **Safety checks run automatically and are shown before signing:**
   - Allergy and adverse reaction cross-check
   - Drug–drug interaction check against current medicines
   - Duplicate therapy check
   - Contraindication against coded active problems (e.g. NSAID with CKD)
   - Renal dose adjustment prompt where recent eGFR is available
   - Pregnancy and breastfeeding category where relevant
3. **Choose the dose, frequency, route, quantity and repeats.**
4. **PBS or private:**
   - PBS listing and restriction shown
   - **Streamlined authority code** applied where applicable
   - Where a written or phone **Authority** is required, the workflow makes that explicit and
     records the approval number
   - Private (non-PBS) prescriptions clearly marked, with the patient told it is not subsidised
5. **Schedule 8 and monitored medicines** — see below.
6. **Sign and issue.**

### Electronic prescriptions (eScripts)

Two delivery paths, both modelled:

- **Token** — a QR code sent to the patient by SMS or email, dispensed at any participating
  pharmacy. One token per prescription; a repeat generates a new token on dispensing.
- **Active Script List (ASL)** — the patient's active prescriptions held centrally; a pharmacy
  with the patient's consent can see the whole list without individual tokens.

Paper prescriptions remain supported — some patients need them, and printing must always be
available.

### Schedule 8 and Real-Time Prescription Monitoring

Two separate obligations that are constantly conflated, so the software separates them visually
and in the record:

| Obligation | What it is | Who administers | When |
|---|---|---|---|
| **RTPM check** | Look up the patient's controlled-medicines history | State/territory (SafeScript VIC/NSW, QScript QLD, ScriptCheckSA, NTScript, etc.) | **Mandatory in Victoria and Queensland**; voluntary elsewhere, moving toward mandatory in SA |
| **S8 permit / authority** | Permission to prescribe a controlled drug to this patient | State/territory health department | Required by drug and duration, varies by jurisdiction |
| **PBS Authority** | Commonwealth *subsidy* approval | Services Australia | Where the PBS listing requires it |

**Completing one does not satisfy the others.** The prescribing screen shows all three as separate
line items with their own status, driven by the practice location's state.

Telehealth constraint: most jurisdictions permit *continuation* of an existing S8 prescription by
telehealth for an established patient, but restrict *initiation* without a face-to-face
assessment. The software knows the encounter type and warns accordingly.

### Repeats and long-term medicines

- Repeat prescription requests arriving without an appointment go into a **script request queue**,
  not straight to a prescription. The GP reviews each one against the last review date, recent
  results and the patient's attendance.
- Medicines flagged for periodic review (e.g. antihypertensives annually, S8s more often) surface
  the overdue review at the point of the repeat request.
- A repeat request for a patient who has not attended in over 12 months is flagged for a
  consultation rather than a script.

## Rules and constraints

1. No prescription without an encounter.
2. Allergy cross-check cannot be bypassed silently — overriding a hard allergy match requires a
   typed reason recorded in the record.
3. RTPM check status is required before issuing an S8 in a mandatory jurisdiction.
4. Practice nurses may record administration under a standing order but cannot issue a
   prescription.
5. Every prescription is retained permanently, including cancelled ones, with the cancellation
   reason.
6. Prescriber number and provider number are attached to every prescription.

## Data touched

`prescriptions`, `prescription_items`, `medications`, `allergies`, `interaction_checks`,
`rtpm_checks`, `authority_approvals`, `script_requests`, `standing_orders`.

## Offline behaviour

**Not supported for issuing.** eScript issuance requires the prescription exchange, RTPM requires
a live lookup, and PBS authority requires Services Australia. Offline, the GP can view current
medicines and *draft* an intent to prescribe, which becomes a task on reconnection. The UI states
this before a home visit or RACF round so the GP can pre-issue scripts.

## Standards mapping

QI2.2 Safe and quality use of medicines · C5.1 Diagnosis and management of health issues ·
C7.1 Content of patient health records · QI3.1 Managing clinical risks

## Feature files

`features/clinical/prescribing.feature`, `features/clinical/escript-issuance.feature`,
`features/clinical/schedule-8-prescribing.feature`,
`features/clinical/repeat-script-requests.feature`
