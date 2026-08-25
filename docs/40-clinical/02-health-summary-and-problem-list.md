# Health Summary, Problem List and Medication Reconciliation

**Status:** `modelled`

## Purpose

RACGP **QI2.1** measures the practice on the proportion of active patients with a complete health
summary. It is a clinical indicator because an incomplete summary is how patients get hurt at
handover — in an ED, on a home visit, at a locum consultation.

## Who does it

Every clinical role, continuously. The practice nurse typically drives completion campaigns.

## What a complete health summary contains

| Section | Requirement |
|---|---|
| **Allergies and adverse reactions** | Substance, reaction, severity, date. "Nil known" is a valid recorded state; blank is not. |
| **Current medicines** | Drug, form, strength, dose, frequency, route, indication, start date, prescriber |
| **Active problems** | Coded, with onset date and status |
| **Past history** | Significant past conditions, surgery, hospital admissions |
| **Immunisations** | Vaccine, date, batch, site, provider |
| **Family history** | Condition, relative, age at onset |
| **Social history** | Living situation, occupation, supports |
| **Risk factors** | Smoking status, alcohol, physical activity, BMI, blood pressure |

The practice dashboard shows the completeness percentage and the specific gaps, because "you are
at 62%" is useless without "here are the 340 patients missing an allergy status".

## The problem list

- Problems are **coded** (SNOMED CT-AU subset) so they can be reported and reasoned about, with
  free text preserved alongside — GPs describe things more precisely than codes allow.
- Each problem has: status (`active`, `inactive`, `resolved`), onset date, resolution date,
  severity, and whether it is a **chronic condition** (which drives care planning eligibility).
- Problems are added from the consultation assessment, never in a separate admin task.
- Inactivating a problem requires a reason; resolving it requires a date.

### Why coding matters here

Coded active problems drive: chronic condition management eligibility, screening prompts, drug
interaction and contraindication checking, recall registers, PIP indicators, and every practice
report. An uncoded problem list is a text file.

## Medication reconciliation (QI2.2)

Reconciliation is a **discrete, recorded event**, not a side effect of prescribing:

1. Triggered by: hospital discharge, a specialist letter with medication changes, an aged care
   admission, a home medicines review, or a scheduled periodic review.
2. The GP or pharmacist compares the practice's list to the source, item by item.
3. Each discrepancy is resolved explicitly: continue, cease, change, or "patient not taking".
4. The reconciliation is recorded with source, date, who did it, and the resulting list.

Medicines carry a `last_reconciled_at`, and the summary shows when it is stale.

## Rules and constraints

1. Allergy status must be positively recorded — the consultation header shows "allergies not
   recorded" in a way that is impossible to miss.
2. A medicine cannot be marked current without a dose and frequency.
3. Ceasing a medicine records a reason and a date.
4. Problem codes come from a curated general-practice subset, not the full SNOMED release —
   giving a GP 350,000 codes is the same as giving them none.
5. Health summary completeness is calculated nightly and reported.

## Data touched

`allergies`, `medications`, `medication_reconciliations`, `conditions`, `past_history`,
`immunisations`, `family_history`, `social_history`, `risk_factors`, `health_summary_metrics`.

## Offline behaviour

Read fully offline for cached patients. Writes to the problem list and allergies queue offline;
medication changes that require prescribing do not.

## Standards mapping

QI2.1 Health summaries · QI2.2 Safe and quality use of medicines · C7.1 Content of patient health
records · C5.3 Clinical handover

## Feature files

`features/clinical/health-summary.feature`, `features/clinical/problem-list.feature`,
`features/clinical/allergies.feature`, `features/clinical/medication-reconciliation.feature`
