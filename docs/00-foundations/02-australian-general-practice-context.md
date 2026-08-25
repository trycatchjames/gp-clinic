# Australian General Practice: The Context the Software Has to Fit

**Status:** `specified` — this is background, not a workflow

This document exists so that every design decision downstream can point at a reason. If you are
about to build a screen and you cannot explain which of the below it serves, stop.

## 1. What GPs are taught

The RACGP Curriculum and Syllabus (6th edition, 2022) is built on **five domains of general
practice**, which are also the first five of its seven core units:

1. **Communication and the patient–doctor relationship**
2. **Applied professional knowledge and skills**
3. **Population health and the context of general practice**
4. **Professional and ethical role**
5. **Organisational and legal dimensions**

Plus two further core units: **Aboriginal and Torres Strait Islander health** and **Rural health**.
Thirty-five contextual units cover populations and presentations.

### What this means for software

Domain 1 says the consultation is a *relationship*, not a data-entry event. Domain 3 says the GP
is responsible for a **population**, not just whoever walks in — which is the entire justification
for recall/reminder registers, screening prompts and practice-level reporting. Domain 5 says the
GP is responsible for the legal and organisational context — record keeping, privacy, billing
integrity — which the software must make easy to get right and hard to get wrong.

## 2. How GPs are taught to think in a consultation

Australian GP training teaches **Murtagh's safe diagnostic strategy** — five questions asked of
every presentation:

1. What is the **probability diagnosis**?
2. What **serious disorders must not be missed**?
3. What conditions are **often missed** (the pitfalls)?
4. Could this be one of the **masquerades**? (depression, diabetes, drugs, anaemia, thyroid
   disease, spinal dysfunction, urinary tract infection)
5. **Is the patient trying to tell me something else?**

This is not a nice-to-have framing. It is the model registrars are examined on (the Key Feature
Problems exam), and it maps directly onto how a good consultation note should be structured. Our
consultation workflow ([40-clinical/01](../40-clinical/01-consultation-workflow.md)) makes this
structure available without forcing it — an experienced GP writes free text, a registrar can turn
on scaffolding.

The consultation itself is generally taught in phases: **initiating** → **gathering information**
→ **physical examination** → **explanation and planning** → **closing and safety-netting**.
Safety-netting ("come back if X, go to ED if Y") is the step most often missing from notes and the
one most often decisive in a complaint. The software prompts for it.

## 3. What practices are measured against

The **RACGP Standards for General Practices (5th edition)** are the accreditation benchmark.
They are principles-based rather than tick-box, which means a practice has to *demonstrate its
systems work*. Software is the main way that evidence gets produced.

| Module | Standards |
|---|---|
| Core | C1 Communication and patient participation · C2 Rights and needs of patients · C3 Practice governance and management · C4 Health promotion and preventive activities · C5 Clinical management of health issues · C6 Information management · C7 Content of patient health records · C8 Education and training of non-clinical staff |
| Quality Improvement | QI1 Quality improvement · QI2 Clinical indicators · QI3 Clinical risk management |
| General Practice | GP1 Access to care · GP2 Comprehensive care · GP3 Qualifications of our clinical team · GP4 Reducing the risk of infection · GP5 The medical practice · GP6 Vaccine potency |

The criteria that shape this product most:

- **C7.1 Content of patient health records** — what must be in a record. Drives the consultation
  note schema and the health summary.
- **C5.3 Clinical handover** and **GP2.2 Follow-up systems** — drive results management, recalls
  and the referral loop.
- **QI2.1 Health summaries** and **QI2.2 Safe and quality use of medicines** — drive the
  structured health summary and medication reconciliation.
- **QI3.1 Managing clinical risks** / **QI3.2 Open disclosure** — drive the incident register.
- **C1.5 Costs associated with care** and **C1.1 Information about your practice** — drive
  informed financial consent at booking and at billing.
- **GP4.1 Infection prevention** and **GP6.1 Vaccine potency** — drive the sterilisation and
  cold-chain registers.

## 4. How general practice gets paid

Australian general practice revenue is not one thing. The software must model all of it.

### Medicare (MBS) — the bulk of it

**Time-tiered GP attendances** (the backbone of every day):

| Level | Item | Duration |
|---|---|---|
| A — Brief | 3 | Short, obvious problem |
| B — Standard | 23 | Less than 20 minutes |
| C — Long | 36 | At least 20 minutes, less than 40 |
| D — Prolonged | 44 | At least 40 minutes |

Telehealth (video and phone) has parallel item numbers, with eligibility generally tied to an
existing relationship or MyMedicare registration.

**Chronic condition management** changed on **1 July 2025**. GP Management Plans (721) and Team
Care Arrangements (723) were replaced by the **GP Chronic Condition Management Plan (GPCCMP)**:

- **965** — prepare a GPCCMP
- **967** — review a GPCCMP

The new items are linked to **MyMedicare** registration where the patient is registered.
Patients who held a GPMP/TCA before 1 July 2025 can keep accessing allied health services
consistent with those plans until **1 July 2027** — so the software must hold *both* plan shapes
concurrently for the transition.

**Health assessments:** 701 / 703 / 705 / 707 (brief → prolonged, including the 75+ health
assessment) and **715** (Aboriginal and Torres Strait Islander health assessment).

**Mental health:** 2700 / 2701 (GP Mental Health Treatment Plan) and **2715 / 2717**, which
attract a higher fee but require the GP to have completed GPMHSC-accredited Mental Health Skills
Training. **The software must know which practitioners hold MHST and only offer 2715/2717 to
them** — this is one of the most common billing compliance errors.

### MyMedicare

Voluntary patient registration with one practice. Registration unlocks longer telehealth items,
the chronic condition management items, the General Practice in Aged Care Incentive, and — from
1 November 2025 — bulk billing incentive eligibility. Practically: **MyMedicare status is a
first-class attribute of the patient record, not a footnote**, because it changes what can be
billed.

### Bulk Billing Practice Incentive Program (BBPIP) — from 1 November 2025

Practices that bulk bill **100% of eligible services** can opt in and receive an additional
**12.5% loading** on every dollar of MBS benefit earned from eligible services, split 50/50
between the practice and the GP. Practices must be registered for MyMedicare and have added
BBPIP in the Organisation Register. Opt-in and opt-out are at the practice's discretion.

The consequence for software is sharp: **a single privately billed eligible service can cost the
practice its 100% threshold.** The billing screen must make the practice's BBPIP participation
visible at the point of billing and warn before a private bill is raised on an eligible service.

### Other payers

- **DVA** — Veterans' Gold/White Card, own fee schedule, no patient co-payment
- **WorkCover / CTP** — employer or insurer billed, claim number required, certificates of
  capacity attached
- **Private / mixed billing** — practice fee schedule, patient pays a gap, patient claims from
  Medicare
- **Non-Medicare** — travel vaccination, pre-employment and commercial drivers' medicals,
  insurance reports, cosmetic procedures, iron infusions where not rebatable

## 5. Prevention and population health

The RACGP **Red Book** (Guidelines for preventive activities in general practice, 10th edition)
is the reference for what to screen, in whom, and how often. It includes an age-based lifecycle
chart. The systematic activities practices are expected to register and recall for include:

- Childhood immunisations (against the National Immunisation Program schedule, reported to AIR)
- **Cervical screening** (National Cervical Screening Program, including self-collection)
- **Bowel cancer screening** (National Bowel Cancer Screening Program)
- **Breast screening** (BreastScreen; women can self-refer for biennial mammography from 40)
- Cardiovascular risk assessment, diabetes screening (AUSDRISK)

Screening is only recommended where benefit outweighs harm — so the software should prompt
against guidelines, never nag indiscriminately.

## 6. Medicines

- **Electronic prescriptions (eScripts)** are the default. Delivered as a **token** (QR code by
  SMS or email) or through the patient's **Active Script List (ASL)**.
- **PBS** subsidy, with **Authority** required for some items (streamlined authority codes vs
  phone/written authority).
- **Real-Time Prescription Monitoring (RTPM)** — SafeScript (VIC/NSW), QScript (QLD),
  ScriptCheckSA, NTScript etc. **Mandatory to check in Victoria and Queensland**, voluntary
  elsewhere. State-dependent, so the software's prompt must be driven by practice location state.
- **Schedule 8** prescribing additionally requires a **state/territory permit or authority** for
  certain drugs and durations. This is a *separate process* from PBS Authority — completing one
  does not satisfy the other, and conflating them is a classic error the software should prevent.
- Most jurisdictions restrict **initiating** S8 by telehealth while allowing continuation for
  established patients.

## 7. Identifiers a practice actually has

A practice cannot operate without assembling this set, and onboarding is largely the act of
collecting it:

| Identifier | What it is | Held by |
|---|---|---|
| ABN / ACN | Business identity | Practice entity |
| **PRODA** account | Government online authentication (the provider's MyGov) | Individuals, not the org |
| **HPI-O** | Healthcare Provider Identifier – Organisation | Practice / location |
| **HPI-I** | Healthcare Provider Identifier – Individual | Practitioner |
| **Medicare Provider Number** | **Location-specific.** One per practitioner *per location* | Practitioner × Location |
| Prescriber Number | For PBS prescribing | Practitioner |
| AHPRA registration number | Registration to practise | Practitioner |
| Medicare Minor ID | For claiming/banking | Location |
| MyMedicare / Organisation Register | Program registration | Practice |
| Accreditation certificate + expiry | RACGP Standards accreditation | Practice |

The single most important modelling consequence: **provider numbers are per practitioner per
location.** A GP working across two sites has two. Billing at the wrong site with the wrong
provider number is a rejected claim.

Note also the **seed vs network organisation** distinction in the HI Service: a seed organisation
is the controlling business entity; network organisations sit beneath it. A multi-site practice
group maps onto this directly, and so does our `practice` → `practice_location` model.

## Sources

See [90-reference/references.md](../90-reference/references.md).
