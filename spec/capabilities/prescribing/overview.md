# Prescribing

## Purpose and actors

Legally and organisationally authorised prescribers create an internally valid, attributable prescription and issue it by a Version 1 manual/print method.

## Primary tasks

Create/edit draft; choose medicine/directions/quantity/repeats; review patient/prescriber/location/allergy context; issue and render; reprint; cancel or supersede/reissue; optionally update medication list explicitly.

## Inputs and outputs

Consumes Patient Summary, prescriber-at-location authority, local medicine display catalogue, jurisdiction configuration and Medication. Produces immutable Prescription/Document versions and optional explicit Medication command.

## Constraints

Issue is atomic; no signing as another practitioner; no unsupported interaction/dose/schedule claim; cancel cannot assert external revocation; external e-prescribing is future scope.

## Out of scope

Electronic prescribing exchanges, PBS authority, RTPM, dispensing, pharmacy selection and validated clinical decision support.
