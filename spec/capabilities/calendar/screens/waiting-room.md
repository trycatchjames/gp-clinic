# Screen contract: Waiting room

## Purpose and actors

Coordinates arrived patients for reception, nurses and practitioners across a selected location without exposing unnecessary clinical detail.

## Layout and required information

Header with location/current time/filter; ordered table/list; optional selected appointment panel. Each row shows patient identity sufficient to distinguish, practitioner, scheduled time, actual arrival, waiting duration, lateness relative to schedule, appointment type/mode, operational status and reception-safe urgency/resource flags. Clinical users may see a separate permitted safety indicator, not full note content.

## Actions

Mark waiting/return to scheduled where valid, update operational note, open appointment, start/preview consultation (distinct), send to billing after successful completion, correct mistaken arrival with reason.

## States and semantics

Empty states “no patients arrived” separately from data failure. Waiting duration updates without resorting/screen focus jumps. Priority sorting is explicit and does not automatically infer clinical urgency. Completed/at-billing patients remain or leave according to filter, never vanish before the transition commits.

## Failure and permissions

Failed transition leaves row/state unchanged and shows retry. Starting consultation requires clinical authority; reception can never use it to create a clinical entry. Keyboard users can traverse rows/actions and hear updated wait/status.
