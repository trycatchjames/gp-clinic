# Screen contract: Investigation request editor

## Purpose and actors

Lets an authorised clinician create and issue a pathology or imaging request with enough identity, clinical question and responsibility context.

## Regions/information

Patient banner; ordering practitioner/location/contact; request kind; requested tests/studies; clinical indication/question; priority; local recipient snapshot; copy-to; relevant attachments/instructions; responsible practitioner/coverage; expected result date; preview and draft/issue state.

## Behaviour

Selecting favourites/templates adds editable items and never inserts unreviewed clinical indication. Preview shows at least three patient identifiers and exact recipient/referrer snapshot. Issue is atomic and creates immutable rendition. “Print/record manual dispatch” is a separate fact. Cancel/supersede warns that external receipt/cancellation is unknown.

## States/failure

Draft, issued, awaiting/partial/resulted/closed view. Missing identifiers/authority/request/indication required by policy block issue. Rendering/issue failure preserves draft and creates no tracking obligation as issued. Partial result receipt is visible from the request history.
