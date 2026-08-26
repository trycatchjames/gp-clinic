# Screen contract: Immunisation editor

## Purpose and actors

Records an administered-here or historical vaccination with provenance and batch safety information.

## Regions/information

Patient/allergy banner; source choice; vaccine/antigen/brand; batch/lot and dose number; administration/history date/time precision; route/site/dose; administering practitioner/location; consent/pre-assessment reference; funding/program label if recorded; AEFI/future reminder links; save/history.

## Behaviour

Administered-here requires current identity, practitioner, batch, time and configured administration details. Historical mode removes “administerer = current user” assumptions and requires source/confidence. Duplicate date/vaccine prompts comparison but does not auto-delete. Next-dose reminder is a separate explicit action.

## States/failure

Draft, recorded, amended/entered-in-error. Failed save preserves data and creates no “administered” record. AIR panel states “not connected in Version 1” and never shows submitted/accepted.

## Permissions

Clinical/immunisation recording permission and scope; reception may view appointment fact, not clinical administration details by default.
