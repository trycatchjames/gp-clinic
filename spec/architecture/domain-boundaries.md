# Domain ownership map

| Domain owner | Owns | Does not own |
|---|---|---|
| Practice | tenant/governance, configuration references | clinical/financial records |
| Patient | demographics, contacts, representatives, lifecycle, merge lineage | appointments, health summary copies, invoices |
| Practitioner | professional identity, practitioner-location facts | user authentication, permissions |
| Location | place/timezone/resources | practitioner availability rules, appointments |
| Availability | sessions, exceptions, blocks, booking policy | appointment records |
| Appointment | reservation and operational flow | consultation note, invoice truth |
| Consultation | episode context/completion | embedded copies of all linked clinical records |
| Clinical record | composition, entry metadata/amendment contract | ownership of allergy/medicine/result entities |
| Problem/Allergy/Medication/Observation/Immunisation/Care plan | their longitudinal clinical facts | prescriptions/results/billing |
| Prescription | issued supply direction lifecycle | medication-taking truth, dispensing |
| Investigation | request/tracking | result clinical review |
| Result | received finding, match, review and follow-up disposition | recall pursuit implementation |
| Referral | authored request and outcome tracking | recipient directory live data |
| Document | immutable bytes/version/provenance | clinical action state |
| Correspondence | inbound/outbound communication processing | document bytes, result meaning |
| Task | assigned staff work | source clinical obligation closure |
| Recall | clinical pursuit obligation; preventive reminder cycle | generic staff task, appointment reminder |
| Billing | items, fee/payer resolution | clinical service truth |
| Invoice | issued account, balance | payer submission lifecycle |
| Claim | manual payer request/outcome tracking | invoice mutation, external submission |
| Audit | accountable evidence | primary domain history/business state |

## Cross-domain reference rules

- Refer by stable identifier and obtain needed display data through queries or immutable issue-time snapshots.
- A domain may request another domain operation through an application transaction, but cannot write another owner's storage directly.
- Read models may combine patient summary/calendar/work queue. All mutations route back to the owner.
- No cyclic synchronous dependency is allowed between domain rule engines. Shared value objects (identifier, date precision, money) carry no owner-specific decisions.

## High-risk orchestration

- result review → result owner validates disposition → recall/task/referral owner creates required action → one atomic application outcome;
- encounter completion → consultation validates → linked drafts confirm → appointment moves to handoff → audit commits;
- duplicate merge → patient owner resolves survivor/lineage → all domains re-link through a governed merge service without rewriting source history;
- invoice issue → billing resolves snapshot → invoice fixes number/lines → audit commits;
- user/practitioner offboarding → work inventory query → explicit reassignments → access deactivation.
