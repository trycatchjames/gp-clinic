# Authoritative specification

**Product:** Australian general-practice management and clinical platform  
**Specification version:** 1.0-draft  
**Research cut-off:** 26 August 2026  
**Status:** authoritative for product behaviour; requires clinical, operational and legal validation before clinical use

## Purpose

This repository specifies the complete internal core of software for Australian general practice. It defines the product, domain, capabilities, screen contracts, observable behaviour, safety controls and implementation boundaries. It is deliberately independent of Medicare claiming gateways, electronic prescribing exchanges, My Health Record, AIR, diagnostic-provider interfaces and every other external integration.

The specification uses **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** normatively. A statement labelled “example”, “research observation” or “open question” is informative, not a requirement.

## Authority and organisation

The authoritative material is, in descending order:

1. accepted ADRs in [`spec/decisions`](spec/decisions);
2. domain invariants and cross-cutting safety, privacy, security and authorisation requirements;
3. capability rules and screen contracts;
4. contract schemas and lifecycle definitions;
5. capability overviews and product documents;
6. Gherkin acceptance examples, which demonstrate but do not replace the normative rules.

If two authoritative files conflict, implementation MUST stop at the conflict. A specification change must resolve it; an implementation choice must not silently select one interpretation. Research notes explain provenance but are not normative. Existing [`docs`](docs), [`features`](features), generated OpenAPI output and application code pre-date this specification and are non-authoritative evidence only.

The hierarchy is organised around:

- [`spec/product`](spec/product): purpose, scope, people, terminology and quality goals;
- [`spec/research`](spec/research): Australian source base, market observations and unresolved questions;
- [`spec/domain`](spec/domain): owned concepts, relationships, invariants and lifecycles;
- [`spec/capabilities`](spec/capabilities): user outcomes, interactions, screens, permissions and acceptance examples;
- [`spec/cross-cutting`](spec/cross-cutting): requirements that apply everywhere;
- [`spec/contracts`](spec/contracts): stable internal shapes, identifiers, enums and event semantics;
- [`spec/architecture`](spec/architecture): ownership, dependency and reliability boundaries;
- [`spec/decisions`](spec/decisions): durable decisions and their rationale.

## How implementation agents use it

Before changing a capability, an agent MUST read its consolidated `spec.md` when present; otherwise it MUST read the capability's overview, rules, interactions, permissions and screen contracts. It MUST always read the acceptance examples and `review.yaml`, plus every linked domain and cross-cutting requirement. It must produce the evidence named by `review.yaml`, test the relevant acceptance examples and show that domain invariants still hold. Absence of a screen detail is not permission to contradict a product principle or invariant.

Implementation must conform to the specification. Implementation agents must not change product specifications merely to make implementation easier. Material changes to behaviour, domain rules, APIs, permissions, safety requirements, or screen contracts require explicit specification changes.

## Changing the specification

A material change MUST:

1. state the user or safety problem;
2. update all affected domain, capability, screen, acceptance and contract files atomically;
3. include or amend an ADR when ownership, lifecycle, safety or compatibility is durable;
4. cite Australian authority for an Australian-specific rule or record the uncertainty;
5. identify migration and historical-record implications;
6. be reviewed by the appropriate people named in [`spec/research/open-questions.md`](spec/research/open-questions.md).

Editorial clarification may be made without an ADR when behaviour is unchanged. Time-sensitive programme, fee, legislative and standards claims MUST be reverified before use. The source register records the research cut-off, not a guarantee of continuing currency.

## Specification versus implementation

The specification describes outcomes and constraints, not a framework, database or cloud vendor. Conceptual attributes are not database columns. Screen regions are semantic contracts, not pixel layouts. Internal contracts may later be represented by APIs or events, but their meaning is stable across delivery technologies.

Gherkin scenarios cover high-value examples: happy paths, invalid transitions, permissions and safety edges. Passing a scenario is necessary but not sufficient; all normative prose still applies. Where prose and a scenario disagree, the authority order above applies and both documents must be reconciled.

## Version 1 boundary

Version 1 may store identifiers and internal representations needed for ordinary work, and may simulate receipt or dispatch manually. It MUST NOT connect to or specify protocols for any external service. [`spec/product/future-integrations.md`](spec/product/future-integrations.md) is the only place that describes those future boundaries.
