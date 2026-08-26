# Australian general-practice research synthesis

## The practice is both a care service and a coordinated workplace

General practice combines longitudinal care with a rapid appointment-based service. Reception, nursing, clinicians and managers work on the same patient journey but need different information. An appointment book therefore also drives arrivals, waiting, encounter start and billing handoff; a patient record must combine a current health summary with a chronological legal record. [RACGP-SGP5; BP-WAITING; BP-VISIT]

## Patient identity is an active safety process

RACGP C6.1 requires a patient to state at least three approved identifiers at relevant contacts. Approved identifiers include combined family/given name, date of birth, gender as identified, address, local record number and IHI. Medicare number is not approved because people may lack one and family members may share a card number. The system therefore cannot treat possession of a Medicare number as identity verification. It must make similar-name and similar-DOB risk visible while preserving lawful anonymous/pseudonymous care. [RACGP-SGP5]

Demographics must support identity, communication, culturally safe care and administration without conflating them. Assigned sex at birth, current gender, pronouns and variations of sex characteristics are separate data with private collection and “prefer not to say” where appropriate. Aboriginal and/or Torres Strait Islander status and cultural background are self-described and must not be inferred. [RACGP-SEX-GENDER]

## The health record is longitudinal and attributable

RACGP requires one patient health record containing practice-held information, timely consultation/communication entries, identification/contact/next-of-kin details and evidence that earlier matters were followed up. A consultation record identifies who, date, communication method, reason, findings, diagnosis where appropriate, plan/review, allergies and prescribed medicine details. A current health summary includes allergies, medicines, current problems and relevant history. [RACGP-SGP5, C7.1 and QI2.1]

The Medical Board expects records that are accurate, legible, secure, timely and sufficient for continuity; changes/additions are dated. This supports signed/completed entries plus additive amendments rather than destructive editing. Patient-requested factual corrections still need a governed process under APP 13. [MBA-GMP; OAIC-HEALTH]

## Results are a responsibility workflow, not a document folder

RACGP GP2.2 requires a process for receiving, reviewing, acting on and communicating results, recording attempts about clinically significant results and managing seriously abnormal/life-threatening results outside normal hours. Review significance is a clinician decision: a normal result can still need follow-up given the indication. Vendor systems consistently use provider and unmatched queues plus explicit actions. [RACGP-SGP5; RACGP-HIGHRISK; BP-RESULTS; MD-RESULTS; ZED-RESULTS]

The ordering practitioner is the initial responsible person, but absence and departure require delegated cover. Software must not equate “opened”, “acknowledged”, “filed”, “patient informed” and “follow-up complete”. Each is a separate fact.

## Recall, reminder, appointment reminder and task are distinct

RACGP uses recall for clinically significant follow-up and expects contact attempts to be documented; preventive reminders can prompt routine care, and failure to respond to a reminder does not itself require continued follow-up. Products vary in labels and sometimes call both “reminders”. The specification follows the obligation rather than the vendor label: **recall** is pursued to clinical closure; **preventive reminder** is an offer; **appointment reminder** concerns an existing booking; **task** coordinates staff work. [RACGP-SGP5, GP2.2; BP-REMINDERS]

## Medicines and allergies require provenance and uncertainty

Current medicines include those prescribed elsewhere, over-the-counter and complementary medicines. A prescription is not proof a medicine is current or taken. Allergy and adverse-reaction records require substance, reaction, certainty/status and provenance, including an explicit “asked; none known” state distinct from “not assessed”. They must be visible when prescribing, but Version 1 cannot claim automated interaction or allergy checking without validated knowledge data. [RACGP-SGP5; ACSQHC-MEDICATION; BP-ALLERGIES]

## Appointment books encode operational reality

RACGP requires access based on urgency and patient need but does not mandate software statuses. Australian products commonly expose day/week practitioner books, working sessions, blocked/unavailable time, multiple practitioners, arrival/wait duration, “with doctor/practitioner”, billing handoff, cancellations and DNA. The specification adopts neutral canonical states and preserves a separate clinical encounter so previewing notes does not create a consultation. [RACGP-SGP5, GP1.1; BP-WAITING; BP-VISIT; MD-APPTS; ZED-WAITING]

Reception may record a patient-reported concern or practice-defined urgency flag but must not be turned into an untrained diagnostic decision-maker. Urgent access, triage scripts and escalation are practice policy content; clinical decisions remain with appropriately trained staff.

## Billing must separate care, invoice, payment and payer claim

An Australian itemised account includes patient, service date, charged/paid/owing amounts and item number or description. The rendering practitioner's relevant location/provider details matter, and the patient and claimant/payer need not be the same. Bulk billing is a payment arrangement, not “a zero-priced private invoice”; external assignment/submission is a future integration. [SA-MBS-BILLING; DOH-BULKBILL]

Because MBS items, descriptors, fees and programmes change, historical invoice lines must preserve the description, amount, code and source version used at issue time. The core cannot query MBS Online during a historical read.

## Privacy is contextual, not only role-based

Private health providers are covered by the Privacy Act/APPs regardless of small-business turnover, and some jurisdictions add health privacy law. Users should access patient information only for authorised work. Collection purpose/notice, consent or other authority, correction, patient access, disclosure and export need recorded workflows. Sensitive-record controls and break-glass access supplement rather than replace ordinary least privilege. [OAIC-HEALTH; OAIC-JURISDICTIONS; RACGP-PRIVACY]

## Distinctions between authority and common practice

| Topic | Authority/guidance | Common product pattern | Specification decision |
|---|---|---|---|
| identity | patient states three approved identifiers; Medicare is not one | search often accepts Medicare number | Medicare may locate candidates but never satisfies identity verification |
| appointment lifecycle | urgent access and continuity, no mandated enum | booked → arrived → with practitioner → billing; DNA/cancelled branches | canonical operational states with audited transitions; encounter lifecycle remains separate |
| result action | every result has timely review/follow-up appropriate to significance | inbox actions vary and may include delete/file | explicit clinical disposition; non-destructive archive only after disposition |
| recalls/reminders | clinically significant follow-up is pursued; preventive non-response need not be | labels frequently overlap | separate domain entities based on obligation |
| clinical corrections | accurate record; additions/changes dated | some products allow editing or deletion | signed/completed content preserved; amendments append |
| clinical access | only authorised team members, contextual confidentiality | broad role screens may expose timelines | permission + purpose/context checks, restricted summaries for reception |
