# Reporting and Dashboards

**Status:** `specified`

## Purpose

Give each role the handful of numbers that change what they do today, and give the practice the
population view that general practice is responsible for (RACGP curriculum Domain 3).

## Dashboards by role

### Practice Owner / Principal

- Revenue: today, this week, this month, by practitioner, by payer
- **Bulk-billing percentage of eligible services** against the BBPIP threshold, with the exception
  list one click away
- Unbilled completed appointments (dollar value)
- Claims outstanding by age
- Patient throughput and DNA rate
- Accreditation readiness and certificate expiry
- Credential and equipment expiries

### Practice Manager

- Today: arrivals, waits, running-late estimates per practitioner
- Unbilled appointments
- Claims to submit, rejections to fix, payments to reconcile
- Debtors by age
- Unmatched results and unmatched documents, with the age of the oldest
- Open incidents and overdue incident actions
- Expiring credentials, equipment services, policy reviews
- Overdue cold chain and sterilisation records

### GP

- Today's list with waiting status
- **Results to action**, with critical ones first
- Documents to action
- Open recalls assigned to them
- Outstanding investigations past their expected return
- Open referrals without a reply
- Patients seen by others (continuity awareness)
- Their own billings and earnings

### Practice Nurse

- Nurse clinic list
- Recalls to work
- Care plans due for review
- Preventive activities due across the practice's registers
- Cold chain readings due
- Sterilisation loads to validate
- Immunisations due

### GP Registrar

- Today's list
- Cases flagged for supervisor review and their status
- Co-sign requests pending
- Teaching sessions

## Practice-level reports

| Area | Reports |
|---|---|
| Clinical | Health summary completeness, allergy recording, smoking status, chronic disease registers, care plan coverage and review currency, preventive activity completion |
| Access | Third-next-available appointment, wait times, DNA rate, after-hours activity |
| Safety | Recall closure rate and time to closure, results actioned within target, incidents by category, outstanding investigations |
| Financial | Revenue by practitioner/payer/item, average billing per consultation, bulk-billing percentage, debtors, claim rejection analysis |
| Population | Age/sex distribution, chronic condition prevalence, ATSI patient count and 715 completion, MyMedicare registration rate |

## Design rules

1. **Every number is clickable through to the list behind it.** A dashboard number you cannot act
   on is decoration.
2. Numbers that represent a safety obligation (unmatched results, overdue urgent recalls, critical
   results unacknowledged) are visually distinct from performance numbers and are never buried.
3. Denominators are stated. "62% of active patients" means nothing without knowing what "active"
   means, so the definition is on the tile.
4. Reports are exportable (CSV) and dated.
5. Clinical reports respect role scope — a receptionist's dashboard contains no clinical data.

## Data touched

Read-only across the model, plus `clinical_indicator_snapshots` and `report_definitions`.

## Offline behaviour

The user's own dashboard is rendered from cached data offline with a clear "as at" timestamp.
Practice-wide reporting is online-only.

## Standards mapping

QI1.1 Quality improvement activities · QI1.3 Improving clinical care · QI2.1 Health summaries ·
QI2.2 Safe and quality use of medicines · C3.1 Business operation systems ·
C3.2 Accountability and responsibility

## Feature files

`features/practice-operations/role-dashboards.feature`,
`features/practice-operations/practice-reports.feature`
