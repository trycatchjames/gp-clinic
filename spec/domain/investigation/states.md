# Investigation lifecycle

`draft → issued → awaiting_result → partially_resulted → resulted → closed`  
Alternatives: `draft → discarded`; `issued|awaiting_result → cancelled`; any issued state → `superseded`.

Issue fixes the request snapshot. A manual dispatch fact may move `issued` to `awaiting_result`. Result matching advances partial/final receipt but only a clinician or governed policy closes the investigation after review/follow-up. Cancellation after dispatch is internal and displays that external cancellation is unconfirmed.
