# GP Practice Management System — Workflow Documentation

> **Legacy, non-authoritative material.** The current source of truth is [`../SPEC.md`](../SPEC.md)
> and [`../spec`](../spec). These workflow notes pre-date Version 1 of the authoritative
> specification and must not override its domain, safety, permission, screen or scope rules.

This directory is retained as earlier workflow research for a practice management system built **for Australian
general practice**. Not specialists, not hospitals — GPs. Its workflows were modelled on
what GPs are actually taught and what Australian practices are actually required to do:

- the **RACGP Curriculum and Syllabus for Australian General Practice (6th edition, 2022)** —
  the five domains of general practice and the consultation skills registrars are trained on
- the **RACGP Standards for General Practices (5th edition)** — the accreditation criteria a
  practice is measured against (C1.1–C8.1, QI1.1–QI3.2, GP1.1–GP6.1)
- **Murtagh's safe diagnostic strategy** — the clinical reasoning model taught in GP training
- the **RACGP Red Book** (Guidelines for preventive activities in general practice, 10th ed.)
- the **Medicare Benefits Schedule**, MyMedicare, the Bulk Billing Practice Incentive Program
  (from 1 Nov 2025) and the GP Chronic Condition Management Plan framework (from 1 Jul 2025)

See [90-reference/references.md](90-reference/references.md) for sources.

## How to read this

| Layer | Where | What it is |
|---|---|---|
| Foundations | [`00-foundations/`](00-foundations/) | Personas, domain model, architecture, offline strategy, privacy |
| Practice setup | [`10-practice-setup/`](10-practice-setup/) | Registering a practice, locations, team, fee schedules, booking config |
| Patient management | [`20-patient-management/`](20-patient-management/) | Registration, identity, Medicare/DVA verification, MyMedicare, consent |
| Scheduling | [`30-scheduling/`](30-scheduling/) | The appointment book, arrivals, DNAs, recalls, home visits, RACF |
| Clinical | [`40-clinical/`](40-clinical/) | The consultation, prescribing, investigations, results, referrals, CCM, prevention |
| Billing | [`50-billing/`](50-billing/) | Point-of-care billing, bulk billing, private, DVA/WorkCover, claiming, banking |
| Operations | [`60-practice-operations/`](60-practice-operations/) | QI and accreditation, reporting, governance, correspondence, cold chain |
| Reference | [`90-reference/`](90-reference/) | MBS item catalogue, glossary, sources |

Each workflow document follows the same shape:

1. **Purpose** — what real-world job this does
2. **Who does it** — the roles involved
3. **Preconditions**
4. **The workflow** — numbered steps, and where it branches
5. **Rules and constraints** — the things that are not negotiable in Australian general practice
6. **Data touched** — entities created or changed
7. **Offline behaviour** — what happens when the practice loses connectivity
8. **Standards mapping** — the RACGP criteria this workflow is evidence for
9. **Feature files** — the Gherkin specs in [`../features/`](../features/) that cover it

## Status legend

Because this is a prototype being built to demo a vision, each document carries a status:

| Status | Meaning |
|---|---|
| `built` | Working end-to-end in the prototype |
| `modelled` | Data model exists, UI/API not built |
| `specified` | Documented and covered by Gherkin, not modelled |

Every Gherkin feature file in [`../features/`](../features/) is currently tagged `@inactive`.
Nothing runs as an executable test yet — they are living specifications first, and become the
acceptance suite as each workflow is implemented.
