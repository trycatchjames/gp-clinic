# Patient search

## Dependencies

- Domains: [patient](../../domain/patient/overview.md), [practice](../../domain/practice/overview.md).
- Cross-cutting: [accessibility](../../cross-cutting/accessibility/requirements.md), [authorisation](../../cross-cutting/authorization/permissions.md), [audit](../../cross-cutting/audit/requirements.md), [data integrity](../../cross-cutting/data-integrity/requirements.md), [dates and times](../../cross-cutting/dates-and-times/requirements.md), [error handling](../../cross-cutting/error-handling/requirements.md), [privacy](../../cross-cutting/privacy/specification.md), [security](../../cross-cutting/security/requirements.md), [search](../../cross-cutting/search/requirements.md).
- Boundaries and contracts: [domain boundaries](../../architecture/domain-boundaries.md), [dependency rules](../../architecture/dependency-rules.md), and [API principles](../../contracts/api/principles.md).

## Purpose and actors

All authorised practice staff locate the correct patient quickly without creating or acting on a duplicate/wrong record.

## Primary tasks

Search multiple identifiers; compare similar candidates; open an administrative or clinical view according to permission; include inactive/deceased/provisional records; follow merge redirect; start registration only after broader duplicate review.

## Inputs and outputs

Consumes Patient identity/contact indexes, access restrictions, status and permission. Outputs a selected patient context or a registration/duplicate-review decision; it does not mutate patient data.

## Constraints

Medicare number is a search key, not an approved verification identifier. Similarity ranking never auto-selects. Restricted records expose only a safe stub. Search logging must be proportionate but record opens and sensitive attempts are audited.

## Out of scope

Clinical full-text search, cross-practice identity federation and external identifier lookup.

## Rules

Search behaviour follows [`../../cross-cutting/search/requirements.md`](../../cross-cutting/search/requirements.md). Before registration, the system searches exact and normalised combinations and presents candidates; it never decides identity from a score. Search by Medicare/phone/address may return multiple family members. Merged-source selection redirects with survivor confirmation. A total search failure blocks the “no existing patient” assertion, although a governed emergency/provisional path may be available with duplicate-risk flag.

## Interactions

Search is invoked from registration, calendar, results matching, correspondence intake and global navigation. Selecting a result binds the internal patient identifier into the next step and displays the identity banner for confirmation. A possible duplicate redirects to the duplicate-review flow; search itself cannot merge records. Restricted-record indicators reveal only the minimum information needed to request authorised access.

## Permissions

`patient.search` is purpose/scope-limited and returns an administrative result shape. `patient.demographics.view` opens ordinary demographics. Clinical summary/entries, sensitive records, billing and merge history require separate permissions. Restricted candidates appear only as safe stubs where needed to prevent wrong-patient/duplicate risk. Search/open attempts are audited proportionately.

## Screen contracts

### Screen contract: Patient search

#### Purpose and actors

Finds and selects the correct patient for booking, arrival, clinical care, documents, results or billing. All users see only the result shape authorised for their task.

#### Entry points and layout

Global search, appointment editor, result/document matching, patient picker and registration. Regions: purpose/context label; query fields/quick search; filters (active plus explicitly included inactive/deceased/provisional); results; selected-candidate detail/actions.

#### Required information

Query accepts canonical keys in [`../../cross-cutting/search/requirements.md`](../../cross-cutting/search/requirements.md). Each candidate shows name used/official and prior-name cue where needed, DOB/precision, suburb/postcode, masked contact, local record number, lifecycle state, similar-candidate marker and restricted stub state. Results explain which safe fields matched. Medicare is masked and never labelled “identity verified”.

#### Actions and behaviour

Typing progressively searches without auto-select. Exact matches rank first. Arrow/Tab navigates candidates; Enter opens only the deliberately focused candidate and a confirmation is added for high-risk similar/deceased/merged context. “Register new” first runs broad duplicate search and displays searched terms.

#### States

Initial help; searching; no matches with searched scope; results; too many/refine; restricted; partial index failure with safe fallback; full failure that prevents new registration from assuming no patient exists.

#### Failure/privacy

Search failure never renders “no patient”. Cross-practice/unauthorised records are not disclosed. Record opening creates appropriate audit. Reception search never shows diagnoses, medicines, clinical alerts or note snippets.
