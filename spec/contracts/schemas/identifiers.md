# Identifier and primitive contracts

## Identifier

All internal IDs are opaque strings with globally unique generation. Consumers MUST NOT parse creation time, tenant, type or sequence from them. A resource includes `id`, `practice_id` where tenant-owned and `version` where mutable.

Local record/invoice numbers are separate display identifiers unique in practice and never used for authorisation. External references use:

```yaml
system: string       # e.g. local-MBS-snapshot; future external namespace
value: string
effective_from: date|null
effective_to: date|null
source: string
verified_at: instant|null
```

## Date with precision

```yaml
value: "YYYY-MM-DD" | "YYYY-MM" | "YYYY" | null
precision: day | month | year | unknown
estimated: boolean
```

## Money

```yaml
currency: AUD
minor_units: integer
```

Floating-point money is forbidden. Rounding occurs once per documented line/total rule and preserves source amounts.

## Coded concept

```yaml
authored_text: string
code: string|null
system: string|null
system_version: string|null
display: string|null
```

Authored text is never discarded when a code exists. A code does not imply current external terminology validation.

## Provenance

```yaml
source_type: practice_authored | patient_reported | carer_reported | external_document | imported | fixture | manual_external_status
source_reference: string|null
recorded_by: UserId
recorded_at: instant
verified_by: UserId|null
verified_at: instant|null
```
