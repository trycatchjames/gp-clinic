# Capability review manifest contract

Each significant capability has `review.yaml`:

```yaml
human_review: [ui, ux, clinical-safety, operations]
automated_review: [tests, types, security, permissions, architecture, accessibility, domain-boundaries]
review_evidence:
  screenshots: [named-state]
  flows: [named-flow]
  fixtures: [named-dataset]
```

Names are stable evidence IDs, not filenames. A change supplies every relevant item or explains an approved not-applicable decision. Screenshots include empty, normal, dense and failure/safety states named by the capability. Flow evidence records actor, starting fixture, actions and observable outcomes. Clinical and permission changes require human reviewers even when automated tests pass.
