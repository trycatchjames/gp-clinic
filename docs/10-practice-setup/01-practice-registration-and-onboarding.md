# Practice Registration and Onboarding

**Status:** `built`

## Purpose

Get a real Australian general practice from "I've heard about this software" to "we can see
patients on it" without a consultant. Onboarding is the first thing a GP judges the product on,
and it is also where the practice's identity data — the identifiers everything else depends on —
gets captured. Get it wrong and every downstream workflow inherits bad data.

## Who does it

Practice Owner or Practice Manager. In a new practice this is often the principal GP doing it at
9pm. It must be resumable.

## Preconditions

- The person has an email address they control
- The practice has an ABN (or is about to; the flow allows deferral)

## The workflow

### Step 0 — Create an account

1. User provides name, email, mobile, password.
2. Email verification is sent. The account exists but has no practice.
3. On verification the user chooses: **create a practice** or **accept an invitation**.

### Step 1 — Practice identity

Captured: legal entity name, trading name, entity type (`sole_trader`, `company`, `partnership`,
`trust`, `aboriginal_community_controlled`, `other`), ABN, ACN (if a company), practice type
(`general_practice`, `aboriginal_community_controlled_health_service`, `after_hours_service`,
`corporate_group`), primary contact.

- ABN is validated with the ATO checksum algorithm (modulus 89) client- and server-side. It is
  *not* verified against the ABR — that's an integration, out of scope — but a mistyped ABN is
  caught immediately.
- The practice is created in `onboarding_status = 'in_progress'` and is **not usable for clinical
  work** until activated.

### Step 2 — Primary location

Captured: location name, street address (with state and postcode), postal address if different,
phone, fax (still real in this industry — pathology and hospitals use it), email, **timezone**,
and whether this is the main site.

Timezone is chosen explicitly rather than inferred from the state, because Broken Hill exists and
because a group practice can span states.

### Step 3 — Opening hours and access to care

Captured per location: regular opening hours per day of week, whether the site opens on public
holidays, and the **after-hours arrangement** — one of `own_practitioners`, `cooperative`,
`deputising_service`, `hospital_ed_referral`, with the contact details a patient would be given.

This is not decoration. RACGP **GP1.3** requires the practice to have and communicate arrangements
for care outside normal opening hours, and **C1.1** requires that information about the practice
(including hours and after-hours arrangements) is available to patients. What's captured here
feeds the patient-facing practice information sheet.

### Step 4 — Registrations and identifiers

Captured, all optional at this stage but each with a "why we need this" explanation and a
completeness indicator:

| Field | Level | Notes |
|---|---|---|
| HPI-O | Location | Healthcare Provider Identifier – Organisation |
| Medicare Minor ID | Location | For claiming and banking |
| PRODA organisation name / RA number | Practice | Where the Organisation Register lives |
| MyMedicare registration status + start date | Practice | Gates chronic condition management items, BBPIP |
| **BBPIP participation** + effective date | Practice | Requires MyMedicare registration; drives the 100% bulk-billing rule |
| Accreditation status, accrediting body, certificate expiry | Practice | RACGP Standards 5th ed. |
| PIP / WIP participation | Practice | Practice and Workforce Incentive Programs |

The UI states the dependency plainly: **BBPIP requires MyMedicare registration**, and
participation obliges the practice to bulk bill 100% of eligible services. The practice is told
this before ticking the box, not after a rejected payment.

### Step 5 — The team

For each person: name, email, role, and whether they are a **practitioner**.

For practitioners, additionally: practitioner kind (`gp`, `gp_registrar`, `nurse`,
`nurse_practitioner`, `allied_health`), AHPRA registration number, HPI-I, prescriber number,
**vocational registration** flag, **Mental Health Skills Training (GPMHSC-accredited)** flag, and
one **Medicare provider number per location** they work at.

Two things the software insists on:

1. **Provider numbers are location-specific.** The form is a matrix of practitioner × location,
   not a single field. Getting this wrong is the most common cause of rejected claims.
2. **Registrars must have a nominated supervisor** recorded, with an effective date range
   (evidence for GP3.1).

Invitations are emailed; invitees set their own password and complete their own profile. An
invitation is single-use, expires in 14 days, and can be revoked.

### Step 6 — Appointment types and books

Seeded with sensible Australian defaults the practice can edit:

| Type | Default duration | Notes |
|---|---|---|
| Standard consultation | 15 min | Maps to MBS 23 |
| Long consultation | 30 min | Maps to MBS 36 |
| Extended / complex | 45 min | Maps to MBS 44 |
| Brief / script or certificate | 10 min | Maps to MBS 3 |
| Telehealth — video | 15 min | |
| Telehealth — phone | 15 min | |
| Care plan (GPCCMP) | 45 min | Maps to MBS 965 |
| Care plan review | 30 min | Maps to MBS 967 |
| Health assessment | 45 min | 701–707 / 715 |
| Mental health treatment plan | 45 min | 2700/2701/2715/2717 |
| Immunisation (nurse) | 10 min | |
| Treatment room / dressing (nurse) | 20 min | |
| Procedure | 30 min | |
| Home visit | 45 min | |

Each type carries a colour, a default duration, whether it is bookable online, which practitioner
kinds can be booked into it, and a **default MBS item suggestion** used later to pre-fill billing.

### Step 7 — Billing setup

- Choose the practice's default billing policy: `bulk_bill_all`, `mixed`, or `private`.
- If BBPIP is ticked in Step 4, `bulk_bill_all` is pre-selected and the implications are restated.
- Create fee schedules. The system seeds four: **Bulk Bill (MBS)**, **Private**, **DVA**, and
  **WorkCover**, populated from the MBS reference catalogue at 100% of the schedule fee, with
  Private editable per item.
- Set the default fee schedule per location.

### Step 8 — Review and activate

A completeness checklist is shown, split into **required to activate** and **recommended before
seeing patients**:

Required: practice identity, at least one location with an address and timezone, at least one
active practitioner with a provider number at that location, at least one appointment type, one
fee schedule.

Recommended: HPI-O, Medicare Minor ID, MyMedicare, opening hours, after-hours arrangement,
accreditation details.

On activation: `onboarding_status = 'active'`, an audit entry is written, the appointment book
becomes usable, and the owner lands on the practice dashboard.

## Rules and constraints

1. Onboarding is **resumable at any step**; state is saved on every step transition, not at the
   end.
2. A practice can be activated with recommended fields missing, but the dashboard keeps showing
   what's outstanding until they're done. Blocking a practice from working because it hasn't
   entered its HPI-O yet is how software gets abandoned.
3. ABN must pass checksum validation if provided.
4. BBPIP cannot be enabled without MyMedicare registration.
5. Deactivating a practice never deletes clinical data.
6. The first user is automatically `practice_owner`, and a practice must always have at least one
   active owner — the last one cannot be removed or demoted.

## Data touched

`practices`, `practice_locations`, `location_business_hours`, `practice_registrations`,
`practitioners`, `practitioner_locations`, `users`, `practice_memberships`, `invitations`,
`appointment_types`, `fee_schedules`, `fee_schedule_items`, `onboarding_progress`,
`audit_log_entries`.

## Offline behaviour

Onboarding is **online-only**. It is a one-time administrative flow performed at a desk; queueing
it offline adds risk for no benefit. If connectivity drops, the wizard preserves the current step
locally and resumes when back online.

## Standards mapping

C1.1 Information about your practice · C1.5 Costs associated with care · C2.3 Accessibility of
services · C3.1 Business operation systems · C3.2 Accountability and responsibility ·
GP1.3 Care outside of normal opening hours · GP3.1 Qualifications of our clinical team

## Feature files

`features/practice-setup/practice-registration.feature`
`features/practice-setup/onboarding-wizard.feature`
`features/practice-setup/practice-activation.feature`
