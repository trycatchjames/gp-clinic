# Domain event envelope

```yaml
event_id: Identifier
event_type: "domain.fact.v1"
occurred_at: ISO-8601 instant
practice_id: Identifier
aggregate_type: string
aggregate_id: Identifier
aggregate_version: positive integer
actor:
  user_id: Identifier|null
  practitioner_id: Identifier|null
  kind: human | system
correlation_id: Identifier
causation_id: Identifier|null
patient_id: Identifier|null
payload: object          # minimum necessary, event-version specific
```

The envelope contains no permission decision or secret. Consumers re-authorise user-visible reads from current policy. Patient ID is included only when needed. Event retention and access follow the stricter source-domain/privacy policy.

Delivery is at least once; consumers deduplicate by `event_id`. Aggregate version detects gaps/out-of-order handling. An event cannot be changed after publication; a correction is a new event.
