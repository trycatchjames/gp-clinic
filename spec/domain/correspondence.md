# Correspondence

## Purpose

Correspondence records an inbound or outbound care-related communication and its processing. It may reference a Document but also covers calls or structured messages without a file.

## Attributes and rules

Direction, sender/recipient snapshots, patient, subject/category, received/authored/effective times, clinical/administrative classification, document link, owner, processing status, sensitivity, related encounter/referral/result/task and dispatch/acknowledgement history.

- Inbound clinical correspondence is matched, assigned and clinically actioned when required; receipt alone is not completion.
- Outbound clinical correspondence retains the exact issued version and selected recipients.
- Clinical communications form part of the patient health record. [RACGP-SGP5, C7.1]
- Unmatched correspondence stays in a governed queue.
- Reception may process administrative metadata and routing without viewing more clinical content than required.
- Delete is replaced by quarantine/entered-in-error with reason and recoverable provenance.

## Correspondence lifecycle

Inbound: `received_unmatched → matched → assigned → action_required|no_action_required → actioned → filed`.

Outbound: `draft → approved/issued → dispatch_pending → dispatched → delivered|failed|unknown`.

Delivery state is independent of clinical record state. Failed/unknown clinical dispatch remains visible to its owner and may create a task. A received correction or replacement links versions and reopens review where content changed.
