# Major internal resource shapes

These conceptual shapes reduce ambiguity; they are not database schemas.

## PatientSummary

`id`, `local_record_number`, identity names, DOB/precision, name used/pronouns, status, identity-risk flags, operational alerts, allergy assessment + active reactions, medication assessment + current medicines, active problems, key observations, open urgent/overdue obligations, future appointment summary, `version`, freshness/provenance.

Administrative callers receive `PatientAdministrativeSummary`, omitting clinical components and including only reception-safe alerts.

## Appointment

`id`, patient/hold, practitioner, location, type, start instant, timezone, duration, resources, status, actual transition times, reception-safe note, urgency/add-on/overbook metadata, recall association, version.

## EncounterBundle

Encounter context plus independently versioned note draft/completed entry and links to records created in owning domains. It does not duplicate their bodies as mutable embedded fields.

## WorkItemSummary

`source_type`, `source_id`, patient administrative/clinical identity according to permission, accountable owner/team, due/received time, priority/source flag, current state, available actions, version. A unified worklist may display these, but commands route to source domain.

## IssuedArtefact

`source_type/id/version`, patient identifiers snapshot, author/issuer snapshot, recipient/payer snapshot where applicable, authored structured facts, rendered document ID/hash, issued instant, status and supersession link.

## InvoiceSnapshot

Invoice identity, patient/liable party, service/rendering context, immutable line snapshots, totals, payment/credit/reversal allocations, balance, status and version.
