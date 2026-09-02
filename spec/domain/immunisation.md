# Immunisation

## Purpose

Immunisation records vaccines administered by the practice or historical vaccines reported from another source. AIR transmission is a future integration; local records remain complete independently.

## Core attributes

Patient; vaccine/antigen identity and display; brand; batch/lot; dose number; administration date/time; route/site where applicable; dose/quantity; administering practitioner and location; funding/program category if recorded; consent and pre-vaccination assessment reference; source (`administered_here`, `documented_history`, `patient_reported`); adverse event link; correction/status; future due-plan/reminder link.

The Australian Immunisation Handbook says administered vaccines should be documented locally, including brand, batch, dose, date/time and administration site. [IMM-HANDBOOK]

## Rules and invariants

- An administered-here record requires patient identity confirmation, administering practitioner, vaccine, batch, administration time and site/route fields required by local clinical policy.
- Historical records clearly show source and confidence and cannot appear as administered by the practice.
- Correction never overwrites the original administration record; entered-in-error/amendment preserves it.
- Recording an adverse event does not assert causality and does not alter the vaccine record.
- A future AIR integration status will be separate; Version 1 labels reporting as not connected and must not imply compliance.
- Inventory/cold-chain management and external AEFI reporting are outside Version 1 core unless separately specified; batch remains captured for safety/provenance.
