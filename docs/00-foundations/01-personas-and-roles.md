# Personas and Roles

**Status:** `built` (roles and permissions are enforced in the prototype)

## Why this matters first

Australian general practice is a small-business/clinical hybrid. The same physical room contains
a sole trader GP, a contracted registrar, an employed practice nurse, and a receptionist who is
simultaneously doing triage, billing and infection control. Software that assumes "doctor" and
"admin" fails immediately. RACGP Standard C3.2 (Accountability and responsibility) and C6.3
(Confidentiality and privacy) both require that the practice can show *who* is allowed to do
*what*, and C3.4 requires defined team roles.

## Personas

### Dr Anita Raman — Practice Principal / Owner
FRACGP, owns the practice as a company, works 6 sessions a week and runs the business the rest
of the time. Cares about: patient throughput, billing leakage, whether the practice is
accreditation-ready, whether registrars are supervised safely, and the 12.5% Bulk Billing
Practice Incentive maths.
**Needs from the software:** onboarding that doesn't take a week, visible practice health,
confidence that nothing clinical is falling through cracks.

### Dr Tom Nguyen — Employed / Contracted GP
Fellowed GP, 8 sessions a week, sees 35–40 patients a day. Bills a mix of bulk-billed and
private. Cares about: consultation flow that doesn't slow him down, a results inbox he can clear,
scripts in two clicks, and being paid correctly on his percentage.
**Needs from the software:** speed above all. Every extra click is 40 clicks a day.

### Dr Priya Shah — GP Registrar (GPT1)
In training, under supervision. Some of her work needs a supervisor available; some documents
need co-signing. She bills under her own provider number but at registrar rates.
**Needs from the software:** the ability to flag a case for supervisor review, escalate in the
moment, and have supervision contacts recorded (evidence for GP3.1).

### Sarah Kelly — Practice Nurse (RN)
Does immunisations, wound care, chronic condition management support, health assessments,
recalls, cold chain, sterilisation logs. Works to standing orders and doctor's orders.
**Needs from the software:** her own task list, nurse-led clinic slots, immunisation recording,
recall generation, cold-chain and sterilisation registers.

### Michelle Barnes — Practice Manager
Runs everything non-clinical. Owns accreditation, HR, rosters, banking, Medicare claiming and
reconciliation, complaints, incidents, policies.
**Needs from the software:** claim/reconciliation control, end-of-day banking, accreditation
evidence, staff and provider number administration, reporting.

### Jess Turner — Receptionist / Medical Receptionist
The front line. Books, arrives, triages ("is this chest pain?"), takes payments, handles the
phone, chases DNAs. Untrained clinically but *is* the practice's first clinical filter.
**Needs from the software:** a fast appointment book, red-flag prompts on booking, unmistakable
billing prompts, and no access to clinical notes beyond what her job requires.

### Priya's patient — Margaret Doyle, 74
Multiple chronic conditions, MyMedicare-registered, on a GP Chronic Condition Management Plan,
takes 9 medicines, sees the practice nurse monthly. Represents the patient the system's chronic
care workflows exist for.

## Roles (as implemented)

| Role key | Label | Clinical record access | Billing | Admin |
|---|---|---|---|---|
| `practice_owner` | Practice Owner | Full | Full | Full, including practice settings and users |
| `practice_manager` | Practice Manager | Metadata + billing-relevant only | Full | Full except clinical config |
| `general_practitioner` | GP | Full | Own + practice | Own profile, own availability |
| `gp_registrar` | GP Registrar | Full, with supervision markers | Own | Own profile |
| `practice_nurse` | Practice Nurse | Full clinical, restricted prescribing | Nurse item billing | Own profile |
| `allied_health` | Allied Health | Own encounters + shared summary | Own | Own profile |
| `receptionist` | Receptionist | **Demographics and appointment data only** | Take payment, raise invoice | None |
| `practice_admin` | Practice Admin (non-clinical) | Demographics only | Reports | Limited |

### Rules

1. **Least privilege by default.** A new user gets exactly one role at one location. Extra
   locations and roles are granted explicitly.
2. **Reception never sees the consultation note.** They see appointment reason, alerts flagged
   as front-desk-visible (e.g. "aggressive behaviour risk", "interpreter required"), allergies
   for emergency purposes, and billing state. Nothing else.
3. **Every clinical record view is audit-logged** — user, patient, timestamp, context. This is
   what makes C6.3 demonstrable and is the single most requested thing after a privacy incident.
4. **A practitioner is not a user.** A practitioner *profile* (AHPRA registration, provider
   numbers, prescriber number) can exist without a login — locums and visiting practitioners are
   billed under but never log in.
5. **Role is scoped to a practice, and permissions are scoped to a location.** A GP who works
   Tuesdays at the branch clinic sees the branch book on Tuesdays.

## Data touched

`users`, `practice_memberships`, `roles`, `practitioners`, `practitioner_locations`,
`audit_log_entries`.

## Standards mapping

C3.2 Accountability and responsibility · C3.4 Practice communication and teamwork ·
C6.3 Confidentiality and privacy · C6.4 Information security · GP3.1 Qualifications of the
clinical team

## Feature files

`features/practice-setup/team-and-roles.feature`, `features/practice-setup/access-control.feature`
