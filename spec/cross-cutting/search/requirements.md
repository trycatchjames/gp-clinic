# Search requirements

## Patient search

Search supports combinations of family/given/used/previous name, date of birth or partial date, address/suburb/postcode, mobile/phone, local record number, Medicare card/IRN and other permitted identifiers. It tolerates spacing, hyphen/apostrophe and diacritic variation while ranking exact matches first. It does not use clinical facts as ordinary reception search keys.

Results show enough identity to distinguish candidates: name used plus legal/previous context where needed, DOB/precision, suburb/postcode, masked contact, local record number, status and explicit similar-record/sensitive restriction indicator. Medicare may locate a record but is not identity verification. [RACGP-SGP5, C6.1]

Search and list presentation follows the user's decision order: name is primary; DOB plus
suburb/postcode and masked contact are the first distinguishing facts; lifecycle state and local
record number are secondary operational references. Medicare or another searched identifier is
shown as match context only when relevant and never outranks the approved distinguishing facts.
Persistent help and placeholders lead with name and address rather than Medicare.

- No exact result does not imply the person is new; registration runs a broader duplicate check.
- Similar names/DOBs remain separate rows; the system never auto-selects based on rank.
- Deceased, inactive, provisional and merged records are searchable when scope permits and clearly labelled. Merged sources redirect safely to survivor with lineage notice.
- Sensitive records may appear as restricted identity stubs to prevent duplicates/wrong-patient action without exposing content.
- Search/open is auditable according to risk and does not leak record existence across tenants.

## Practitioner and directory search

Practitioner search supports name used, profession, local role, location and active/credential status. Recipient directory search returns snapshottable name, service/specialty, address and contact method; selection never creates a live historical dependency.

## General search safety

Search is scoped to current practice and user permissions, rate-limited and paginated. Highlighting/snippets do not expose hidden clinical content. Empty, loading, partial and failure states are distinct.
