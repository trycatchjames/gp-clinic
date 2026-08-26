# Canonical terminology

Use these terms in requirements, UI copy and contracts. Synonyms may appear only as search aliases or explanatory text.

| Term | Canonical meaning |
|---|---|
| patient | A person receiving or seeking care. “Client” is not used for ordinary general-practice care. |
| patient record | The complete practice-held administrative and health information for one patient. “Chart” is non-canonical. |
| practitioner | A person providing health care, whether or not they have a system login. |
| provider | A practitioner in a payer or external identifier context. Do not use as the general UI synonym for practitioner. |
| user | An authenticated person operating the system. A user may be linked to a practitioner. |
| consultation | The clinical interaction and documentation workflow. |
| encounter | The domain record of an episode of care; a consultation is the common Version 1 encounter type. |
| appointment | Reserved time with a practitioner or resource for a patient or held purpose. |
| booking | The act or result of scheduling an appointment; the stored domain concept is Appointment. |
| availability | Rules and exceptions that determine when a practitioner or resource may be booked. |
| waiting room | The operational view of arrived patients awaiting or undergoing care; not necessarily a physical room. |
| problem | A longitudinal health issue on the patient summary. |
| diagnosis | A clinician's assessment recorded in an encounter and optionally promoted to a problem. |
| allergy | An immune-mediated hypersensitivity or user-recorded suspected allergy, with certainty and reaction detail. |
| adverse reaction | A harmful or unintended reaction not assumed to be immune-mediated. Allergy and adverse reaction are displayed together for safety but remain distinguishable. |
| medication | A medicine the patient is currently or historically taking, including external, over-the-counter and complementary sources. |
| prescription | An authored direction to supply one or more medicines. It is not proof that the medicine was dispensed or taken. |
| investigation | A pathology or diagnostic imaging request and its tracking context. |
| result | Information returned or manually recorded in relation to an investigation, including unmatched information awaiting allocation. |
| referral | A request for assessment or care by another practitioner or service, with transfer of relevant information. |
| correspondence | A communication to or from a person or service that is part of care or practice operations. |
| document | A stored file or rendered artefact plus metadata and provenance. Correspondence may reference a document. |
| observation | A dated clinical assertion or measurement, such as blood pressure, weight or smoking status. |
| clinical task | Assigned staff work whose completion does not itself discharge a clinical recall obligation. |
| recall | A patient-specific clinical follow-up obligation requiring tracking and documented attempts until clinically resolved or ceased by an authorised clinician. |
| reminder | A preventive or routine prompt offered to a patient; it does not carry the same pursuit workflow as a recall. |
| appointment reminder | A communication about an existing appointment. It is neither a clinical recall nor a preventive reminder. |
| billing item | A priced service line, which may reference a local snapshot of an MBS item concept. |
| invoice | The itemised account issued for services or goods. |
| payment | Money recorded against an invoice using an internal method; Version 1 does not process it externally. |
| claim | An internal representation of a request for a payer benefit or reimbursement. Submission is manual/simulated in Version 1. |
| payer | The party expected to pay all or part of an invoice. A patient and claimant may differ. |
| bulk billing | The internal billing arrangement in which an eligible Medicare benefit would be accepted as full payment. External assignment and submission are future integrations. |
| inactive patient | A record retained but excluded from ordinary active lists. Inactive is not deceased and is not deleted. |
| sensitive record | A patient or entry with additional access controls; sensitivity does not hide the record's existence from safety-critical matching. |

Australian conventions are preferred: **surname/family name**, **given name**, **mobile number**, **postcode**, **Medicare card number and IRN**, **Aboriginal and/or Torres Strait Islander status**, and dates displayed as `DD/MM/YYYY`. “Provider number” is location-specific in Medicare-related contexts [SA-MBS-BILLING].
