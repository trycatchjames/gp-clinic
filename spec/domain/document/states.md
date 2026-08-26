# Document lifecycle

`received → scanning/quarantine → unmatched → matched → classified → review_required|file_ready → filed`.

Generated documents use `draft → rendered → issued → superseded`. Failure at any processing stage leaves a visible retry/recovery state. `filed` means organised in the record, not clinically actioned; the linked Correspondence/Result controls that obligation.
