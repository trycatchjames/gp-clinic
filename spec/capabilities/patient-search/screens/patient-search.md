# Screen contract: Patient search

## Purpose and actors

Finds and selects the correct patient for booking, arrival, clinical care, documents, results or billing. All users see only the result shape authorised for their task.

## Entry points and layout

Global search, appointment editor, result/document matching, patient picker and registration. Regions: purpose/context label; query fields/quick search; filters (active plus explicitly included inactive/deceased/provisional); results; selected-candidate detail/actions.

## Required information

Query accepts canonical keys in [`../../../cross-cutting/search/requirements.md`](../../../cross-cutting/search/requirements.md). Each candidate shows name used/official and prior-name cue where needed, DOB/precision, suburb/postcode, masked contact, local record number, lifecycle state, similar-candidate marker and restricted stub state. Results explain which safe fields matched. Medicare is masked and never labelled “identity verified”.

## Actions and behaviour

Typing progressively searches without auto-select. Exact matches rank first. Arrow/Tab navigates candidates; Enter opens only the deliberately focused candidate and a confirmation is added for high-risk similar/deceased/merged context. “Register new” first runs broad duplicate search and displays searched terms.

## States

Initial help; searching; no matches with searched scope; results; too many/refine; restricted; partial index failure with safe fallback; full failure that prevents new registration from assuming no patient exists.

## Failure/privacy

Search failure never renders “no patient”. Cross-practice/unauthorised records are not disclosed. Record opening creates appropriate audit. Reception search never shows diagnoses, medicines, clinical alerts or note snippets.
