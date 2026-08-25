# Domain Model

**Status:** `modelled` — the full model is in the Drizzle schema; endpoints exist for the
practice-setup slice.

## Bounded contexts

```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Practice         │  │  Patient          │  │  Scheduling       │
│  ───────────────  │  │  ───────────────  │  │  ───────────────  │
│  practice         │  │  patient          │  │  appointment      │
│  practice_location│  │  patient_contact  │  │  appointment_type │
│  practitioner     │  │  patient_identity │  │  session_template │
│  user / membership│  │  consent          │  │  waitlist_entry   │
│  appointment_type │  │  mymedicare_reg   │  │  session_override │
│  fee_schedule     │  │                   │  │                   │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────┬───────┴──────────────┬───────┘
                         │                      │
              ┌──────────▼──────────┐  ┌────────▼───────────┐
              │  Clinical           │  │  Billing           │
              │  ─────────────────  │  │  ─────────────────  │
              │  encounter          │  │  invoice            │
              │  clinical_note      │  │  invoice_line       │
              │  condition          │  │  payment            │
              │  medication / rx    │  │  claim              │
              │  allergy            │  │  fee_schedule_item  │
              │  observation        │  │  mbs_item           │
              │  investigation      │  │  practitioner_split │
              │  result             │  └────────────────────┘
              │  referral           │
              │  care_plan          │  ┌────────────────────┐
              │  immunisation       │  │  Operations        │
              │  recall / reminder  │  │  ─────────────────  │
              │  document           │  │  audit_log_entry    │
              └─────────────────────┘  │  task               │
                                       │  incident           │
                                       │  qi_activity        │
                                       │  cold_chain_log     │
                                       │  sterilisation_log  │
                                       └────────────────────┘
```

## Tenancy

Every row that is not global reference data carries a `practice_id`. The practice is the tenant
boundary. A **practice** may have many **practice_locations** (mirroring the HI Service seed /
network organisation model), and almost every operational concept — provider numbers, appointment
books, fee schedules, banking, business hours — is location-scoped rather than practice-scoped.

```
practice (tenant)
 └── practice_location (1..n)        ← HPI-O, Medicare Minor ID, address, hours
      ├── practitioner_location      ← provider number per practitioner per location
      ├── appointment (book)
      └── fee_schedule (default per location)
```

## The entities that matter most

### `practice`
The business entity. ABN/ACN, legal + trading name, entity type (sole trader, company,
partnership, trust), accreditation status and expiry, MyMedicare registration, **BBPIP
participation flag and effective dates**, PRODA organisation linkage, onboarding state.

### `practice_location`
Where care happens. Address, timezone (a real concern — a group with sites in NSW and QLD has a
six-month timezone divergence), phone, after-hours arrangement, HPI-O, Medicare Minor ID,
opening hours, wheelchair access, interpreter arrangements (C2.3 Accessibility).

### `practitioner`
A person who provides care, whether or not they log in. AHPRA number and registration type,
HPI-I, prescriber number, practitioner kind (`gp` / `gp_registrar` / `nurse` / `nurse_practitioner`
/ `allied_health` / `registrar_supervisor`), qualifications, **`mental_health_skills_training`
flag** (gates MBS 2715/2717), **`vocational_registration`** flag (gates the A1 fee tier),
provider numbers per location, supervision relationships for registrars.

### `patient`
Demographics, Medicare card number + IRN + expiry, DVA file number and card colour, healthcare
card / pension concession, IHI, ATSI status (mandatory to *ask*, drives item 715 and the ATSI
immunisation schedule), preferred language and interpreter need, usual GP, MyMedicare
registration state, deceased/inactive markers, and a duplicate-merge lineage.

### `encounter`
One episode of care with one practitioner. Type (`consultation`, `telehealth_video`,
`telehealth_phone`, `home_visit`, `residential_aged_care`, `nurse_clinic`, `after_hours`),
start/end (drives MBS time tiering), and the link to `appointment` and `invoice`.

### `clinical_note`
The record of the encounter, structured but not straitjacketed:
`reason_for_encounter`, `history`, `examination`, `assessment` (with coded `condition` links),
`plan`, `safety_netting`, and the optional Murtagh scaffolding fields (`probability_diagnosis`,
`serious_not_to_miss`, `commonly_missed`, `masquerades_considered`, `patient_agenda`).
Immutable once signed; corrections are appended as `note_amendment`.

### `invoice` / `invoice_line` / `claim`
An invoice belongs to an encounter and a payer (`medicare_bulk_bill`, `medicare_patient_claim`,
`private`, `dva`, `workcover`, `ctp`, `third_party`, `no_charge`). Lines reference an `mbs_item`
(or a practice-defined non-MBS item) and carry the fee resolved from the applicable
`fee_schedule`. A `claim` groups lines sent to a payer and tracks lifecycle
(`draft` → `submitted` → `accepted` → `paid` / `rejected` → `resubmitted`).

### `recall` and `reminder`
**Deliberately separate entities**, because they are legally different. A **recall** is the
practice acting on a clinically significant result or a required follow-up — there is a duty to
pursue it, escalating contact attempts, and every attempt must be logged. A **reminder** is a
population-health prompt (cervical screening due, flu vaccine season) with no equivalent duty.
Conflating them is the single most common cause of medico-legal exposure in this domain.

## Identifiers, keys and time

- **Primary keys are UUID v7** — sortable, and generated client-side so that an offline device can
  create records that will not collide on sync.
- **All timestamps are stored `timestamptz`** in UTC. Display is in the *location's* timezone.
- Every table carries `created_at`, `updated_at`, `created_by`, `updated_by`.
- Clinical entities are **soft-deleted only** (`deleted_at`, `deleted_reason`). Australian
  record-retention obligations run to seven years from last entry for adults, and until age 25
  for children — nothing clinical is ever hard-deleted from the application.
- Mutating rows carry a `version` integer for optimistic concurrency and offline conflict
  detection.

## Reference data (not tenant-scoped)

`mbs_item` (item number, description, category, schedule fee, benefit percentage, time tier,
telehealth equivalent, requires-MHST flag, effective dates), `snomed_condition` subset,
`amt_medicine` subset, `immunisation_vaccine`, `australian_postcode_locality`.

Reference data is versioned by effective date so historical invoices reprice correctly — MBS fees
are indexed at least annually and a July invoice must not be repriced by a November fee.
