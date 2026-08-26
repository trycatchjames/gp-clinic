# Screen contract: Allergy/adverse-reaction editor

## Purpose and actors

Lets authorised clinical users record an assessed none-known state or a reaction with uncertainty/provenance.

## Regions and required fields

Patient banner/current assessment; choice “record reaction” or “asked—none known”; agent/substance (authored text plus optional local code); category; reaction manifestation; severity and certainty as explicit optional/unknown values; onset/date; source; clinical notes; status; save/history.

Agent description, category/source and actor/time are required for a reaction; reaction detail SHOULD be prompted but may be unknown. None-known requires confirmation that the patient/source was asked and clears no historical records.

## Behaviour and safety

Adding a reaction while current assessment is none-known atomically changes assessment to known-present. Recording none-known while an active reaction exists is blocked and offers review of active entries. Entered-in-error/status changes show downstream prescription warning impact and retain history.

## Failure/permissions

Save failure preserves fields and summary remains unchanged. Only clinical permissions mutate. Reception cannot open this screen.
