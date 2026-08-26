# Component contract: Patient banner

## Purpose

Prevents wrong-patient action and keeps lifecycle/contact restrictions visible on every patient-context screen.

## Mandatory content

Name used prominently; family/given/legal or previous-name context sufficient for matching; DOB with age/precision; local record number; status (active/provisional/inactive/deceased/merged redirect); selected location/encounter context where relevant; sensitive/access restriction state; at least one further distinguishing field such as suburb/postcode, without exposing unnecessary full address in shared view.

Clinical variant adds compact allergy assessment and severe/current safety alerts. Administrative variant adds safe-contact warning but not clinical detail.

## Behaviour

Banner is persistent during clinical composition, issue and result action. High-risk actions use it in confirmation. It does not rely on photo (optional) or Medicare. Similar-name warning is explicit. Screen readers encounter it near the start and patient switching announces the new identity.

## Failure

If current identity cannot be loaded/verified, dependent patient mutations are disabled; stale banner is visibly stale, never blank.
