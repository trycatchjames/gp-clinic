# Appointment management

## Purpose and actors

Receptionists and authorised clinical/management staff create and maintain safe reservations and move patients through reception flow.

## Primary tasks

Book existing/provisional patients or structured holds; select type/duration/mode/resources; validate conflicts; overbook with authority; reschedule; cancel; record DNA; arrive/return to waiting; associate a recall; find appointment history.

## Inputs and outputs

Consumes patient identity, availability, type defaults, practitioner/location/resources and permissions. Creates/changes Appointment and emits operational/audit history; may signal Consultation, Recall and Billing but does not complete them.

## Constraints

Identity is verified at booking/contact and again at arrival according to practice workflow. Appointment note is reception-safe. Every material change has explicit save outcome. Concurrent changes return a conflict. A cancellation or DNA linked to a recall leaves the recall active.

## Out of scope

Clinical assessment, online booking, external notifications and payment processing.
