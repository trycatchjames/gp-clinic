# API rules

- Read the owning domain, capability permissions and cross-cutting authorization, audit, privacy,
  security, error-handling and data-integrity requirements before changing an endpoint.
- Every practice-owned query and mutation must derive practice scope from the authenticated
  context and reject or conceal cross-practice identifiers consistently. Add a negative test.
- Controllers translate HTTP contracts. Services enforce application/domain rules. Do not place
  the only copy of an invariant in a controller, DTO or frontend.
- A module must not write another domain module's tables directly. Introduce an explicit
  orchestration boundary and document its failure/transaction behaviour when coordination is
  required.
- Consequential records use amendment, supersession, cancellation, entered-in-error or soft-delete
  semantics required by the specification. Never erase history for convenience.
- Update DTO validation, OpenAPI generation, the SDK and contract tests together.

