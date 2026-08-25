# Quality Improvement and Accreditation

**Status:** `specified`

## Purpose

Accreditation against the RACGP Standards is not optional for a practice that wants PIP payments,
and it is a three-yearly scramble unless the evidence accumulates continuously. Software that
produces accreditation evidence as a by-product of normal work is worth a great deal to a practice
manager.

## Who does it

Practice Manager owns it; the whole team contributes.

## The workflow

### The evidence register

Every RACGP Standards criterion (C1.1 through GP6.1) is a row with:

- Current status: `met`, `partially_met`, `not_met`, `not_applicable`
- The evidence attached — documents, policies, reports, system-generated artefacts
- Who is responsible
- Last reviewed and next review date

Much of the evidence is generated automatically by the system:

| Criterion | Auto-generated evidence |
|---|---|
| C6.1 Patient identification | Identification confirmation rates |
| C6.3 Confidentiality and privacy | Audit log reports, access review records |
| C7.1 Content of patient health records | Note completeness metrics |
| QI2.1 Health summaries | Health summary completeness percentage |
| QI2.2 Safe and quality use of medicines | Medication reconciliation rates, allergy recording rates |
| GP2.2 Follow-up systems | Recall closure rates, outstanding results ageing |
| GP3.1 Qualifications | Credential register with expiry status |
| GP4.1 Infection prevention | Sterilisation logs |
| GP6.1 Vaccine potency | Cold chain temperature records and breach handling |
| C3.3 Emergency response | Equipment check logs, drill records, staff training currency |

### Policies and procedures

A register with version control, review dates, an owner, and staff acknowledgement tracking —
because "we have a policy" and "the staff have read the policy" are different claims and
accreditation asks for the second.

### Quality improvement activities (QI1.1)

A PDSA-shaped record: the issue, the measure, the baseline, the change made, the result, and the
next cycle. Linked to the data that produced the baseline so the improvement can be shown rather
than asserted.

### Patient feedback (QI1.2)

Collection (survey, comments, complaints), analysis, the practice's response, and what changed as
a result. Complaints have their own handling workflow with timeframes and outcomes.

### Clinical indicators (QI2)

Continuously calculated and trended:
- Health summary completeness
- Allergy recording
- Smoking status recording
- Medication review currency
- Chronic condition management plan coverage and review currency
- Preventive activity completion (cervical, bowel, immunisation)
- Recall closure and time-to-closure
- Results actioned within target

### Accreditation cycle

Certificate expiry tracked; a preparation plan generated at 12, 6 and 3 months out with the
outstanding criteria listed; a mock assessment mode that produces the whole evidence pack.

## Rules and constraints

1. Evidence is linked to criteria, not filed in a folder.
2. System-generated evidence is reproducible and dated.
3. Policies track acknowledgement per staff member.
4. QI activities record the measure, not just the intention.
5. Complaints are tracked to resolution with timeframes.

## Data touched

`accreditation_criteria`, `accreditation_evidence`, `policies`, `policy_acknowledgements`,
`qi_activities`, `patient_feedback`, `complaints`, `clinical_indicators`,
`clinical_indicator_snapshots`.

## Offline behaviour

Online-only.

## Standards mapping

QI1.1 Quality improvement activities · QI1.2 Patient feedback · QI1.3 Improving clinical care ·
QI2.1 Health summaries · QI2.2 Safe and quality use of medicines · C3.1 Business operation
systems · C3.6 Research

## Feature files

`features/practice-operations/accreditation-evidence.feature`,
`features/practice-operations/quality-improvement-activity.feature`,
`features/practice-operations/patient-feedback.feature`,
`features/practice-operations/clinical-indicators.feature`
