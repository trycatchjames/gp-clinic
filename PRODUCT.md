# Product

<!-- impeccable:product-schema 1 -->

> Derived record. [`SPEC.md`](SPEC.md) and [`spec/`](spec/) remain the authoritative
> specification. This file exists so design tooling has durable product truth in one place; where
> it disagrees with the specification, the specification wins and this file is repaired.

## Platform

web

## Users

Staff of an Australian general practice. Patients are represented in the record but have no portal
in Version 1.

- **General practitioner** — works in short, interruption-prone sessions. Needs a trustworthy
  summary before recording assessment and plan, efficient free text with optional structure, clear
  authorship, rapid orders and explicit completion. May cover another practitioner's results or
  recalls.
- **Receptionist** — coordinates phones, arrivals, bookings, cancellations, patient details and
  billing while protecting privacy in a public environment. Needs strong search, duplicate
  warnings, minimal exposure to clinical content and recovery from interrupted tasks. Escalates
  clinical urgency rather than diagnosing it.
- **Practice nurse** — observations, immunisations, care-plan activities and delegated follow-up
  within scope, moving between an assigned worklist, the waiting room and consultation. Needs the
  responsible clinician and delegation boundaries to stay visible.
- **Practice manager** — configures locations, appointment types, fees, workforce access and
  policy; monitors unresolved work, debtors and audit exceptions. May hold broad administrative
  authority without unrestricted clinical-note access.
- **System administrator** — users, authentication and technical configuration, with no automatic
  right to read clinical content.
- **Allied health practitioner** — the parts of the record relevant to their scope. Prescribing and
  billing authority are independent permissions, never inferred from the role.

Full persona detail: [`spec/product/personas.md`](spec/product/personas.md). Permission bundles:
[`spec/product/roles.md`](spec/product/roles.md).

## Product Purpose

The shared operational and clinical workspace for an Australian general practice: registration and
booking, through arrival and consultation, to internal billing, results follow-up and continuing
care. It serves independent and group practices with multiple practitioners, disciplines, rooms and
locations.

Success is that a practice can run its core workflows on local and manually recorded data while
every safety obligation, state transition and financial consequence stays internally consistent,
attributable and testable — with no external service involved.

**Delivery intent (confirmed with the owner, 4 September 2026).** This is a real product, built in
three deliberate phases:

1. refine the spec-driven delivery flow — specification, delivery slice, PR, named evidence;
2. build the shared UI component system and get it approved;
3. then build real features on top of it.

Design work today serves phase 2. Component and pattern decisions are the deliverable; capability
features are not yet.

## Positioning

- **Australian primary care as a native mental model, not an adaptation.** Surname and given name,
  mobile number, postcode, Medicare card number and IRN, Aboriginal and/or Torres Strait Islander
  status, `DD/MM/YYYY` dates, and location-specific provider numbers. It is not a hospital record, a
  specialist practice package or a US insurance system.
- **Complete without any external integration.** Medicare claiming, prescription exchanges, My
  Health Record, AIR, pathology and radiology providers, secure messaging and booking platforms are
  all deliberately out of Version 1. Internal work is complete and testable without them, and the
  interface must label anything simulated or manually recorded rather than implying an external
  party received, accepted or paid anything.
- **Specification-first delivery.** Behaviour is specified before it is implemented, one reviewable
  slice at a time, with evidence attached to the pull request.

## Operating Context

- Multi-practice, multi-location and multi-practitioner throughout. Timezone,
  practitioner-at-location, resources and delegated responsibility are never treated as singletons.
- Reception is high-throughput coordinated work at a shared desk in a public space — dense,
  forgiving, explicit about conflicts — not simple CRUD.
- Consultation is short and interruptible. Keyboard efficiency and stability outrank expression.
- Core workflows: routine booked consultation; unplanned or add-on care; investigation to result
  closure; recall and preventive reminder; practitioner absence or departure; patient correction,
  inactivation or merge. See [`spec/product/workflows.md`](spec/product/workflows.md).
- Delivery operates through GitHub pull requests: one slice at a time, manifests in
  [`delivery/slices/`](delivery/slices/), one open agent-managed PR by default, `pnpm gate` before
  handoff, and Playwright evidence for UI changes.
- Six demo sign-ins exist against one seeded practice, each showing a different role's view.
  Everything in fixtures, screenshots, traces and logs is demo data by rule.

## Capabilities and Constraints

Twenty-four capabilities are specified under [`spec/capabilities/`](spec/capabilities/). Built end
to end today: account registration and the practice onboarding wizard, authentication, dashboard,
practice settings, MBS browsing, the design-system foundations gallery, and patient search.

Binding constraints:

- WCAG 2.2 Level AA and full keyboard operability on core workflows. No safety meaning may rely on
  colour alone.
- Lists stay usable at 100 practitioners, 1,000 appointments per location per day, 250,000 patients
  and 20 years of one patient's history, through pagination or virtualisation, without changing
  semantics.
- Patient search shows a first useful result within 500 ms at p95, and must disclose that it is
  still searching if slower. A clinical save acknowledges durable success or explicit failure
  within 2 seconds at p95 and must never imply success before persistence.
- Draft clinical text must survive browser or process interruption. Uncommitted work is clearly
  labelled and must never look durably saved.
- Authorization and practice isolation are enforced server-side on granular permissions. Hiding
  something in the UI is not access control.
- Component layering is fixed: accessible shadcn-derived primitives in
  `apps/web/src/components/ui`, pure shared compositions in `apps/web/src/components/patterns`, and
  API- or permission-aware components in a capability-owned feature area.
- Generated OpenAPI and SDK output is deterministic and never hand-edited.
- Canonical terminology in [`spec/product/terminology.md`](spec/product/terminology.md) is binding
  in UI copy, not just in prose.

Explicitly undecided:

- **No product or brand name has been committed.** "GP Practice Management" is a working label;
  "Brunswick" is demo seed data, not a brand.
- **Capability order is "simplest first"** (confirmed with the owner), not a fixed lifecycle
  position. Delivered so far: UI foundations, then patient search.
- No universal Australian legal-retention schedule; jurisdiction and organisational policy remain
  configurable pending legal review.
- The specification is deliberately implementation-neutral; the current stack is prototype
  evidence, not a specified decision.

## Brand Commitments

- **Interface character**, accepted in
  [`spec/product/design-system/README.md`](spec/product/design-system/README.md): calm and assured
  under pressure — professional enough for clinical work, warm enough for a community practice, and
  distinctive without becoming decorative.
- **Voice**: brief, task-specific, written at the point of need. Do not explain ordinary UI
  mechanics, repeat headings, or turn safety guidance into persistent prose when a concise label,
  state or decision-point message will do.
- **Language**: Australian English and Australian conventions throughout.
- **Terminology is part of the brand**: patient, not client. Patient record, not chart.
  Practitioner, with "provider" reserved for payer contexts. Recall, reminder and appointment
  reminder are three different things and are never collapsed.
- No name, logo, wordmark or visual identity exists yet, and none should be invented.

## Evidence on Hand

- [`SPEC.md`](SPEC.md) and [`spec/`](spec/) — the authoritative specification: 24 capability
  packets of `spec.md`, `acceptance.feature` and `review.yaml`, plus domain, cross-cutting,
  contract, architecture and decision material.
- [`spec/product/design-system/`](spec/product/design-system/) — the normative visual and
  reusable-component contract, in nine documents covering foundations, composition and ownership,
  states and interaction, responsive behaviour and content, the atom and molecule catalogues,
  evidence, and contribution.
- [`spec/research/`](spec/research/) — the Australian source base and open questions, at a research
  cut-off of 26 August 2026. Time-sensitive programme, fee, legislative and standards claims must
  be reverified before use.
- `apps/web/src/routes/foundations.tsx` with `apps/web/src/fixtures/design-system-states.ts` — the
  component gallery and its deterministic fixtures.
- `delivery/evidence/` and `playwright-report/` — captured pull-request evidence.
- Running prototype: React 19, Vite, TanStack Router and Query, Tailwind v4 and Radix-based
  primitives on the web; NestJS, Drizzle and Postgres on the API, with a generated OpenAPI document
  and TypeScript SDK.

**Absences that must never be filled by invention.** There are no real patients, no customers, no
testimonials, no case studies, no benchmarks, no pricing, no certification and no deployment. The
specification states it "requires clinical, operational and legal validation before clinical use",
and that validation has not happened. Demo data only, everywhere, always.

## Product Principles

Five strategic principles, distilled from the fifteen normative ones in
[`spec/product/principles.md`](spec/product/principles.md), which remain authoritative.

1. **Clinically safe by default.** Prevent wrong-patient and wrong-context action. Surface verified
   allergy and follow-up information. Where a safe hard stop is impossible, require a deliberate,
   attributable override.
2. **System state is shown, never inferred.** Selected patient, practitioner, location, working
   date, record status, save status and queue responsibility are always explicit. Empty,
   restricted, stale, partial and failed must never be made to look alike.
3. **Never silently lose clinical information, and never rewrite the record.** Draft recovery,
   explicit save outcomes and conflict handling are mandatory; completed entries are amended by
   attributable additions, not erased.
4. **Permission follows authority and scope.** Granular permissions and care relationships decide
   access, not job-title strings, and the decision is made on the server.
5. **Fast and dense at the point of care.** Decision-relevant summary first, provenance on demand,
   common actions without leaving patient context, and keyboard flows that carry repeat
   high-volume work.

## Accessibility & Inclusion

WCAG 2.2 Level AA on core workflows, with full keyboard operability. No safety meaning carried by
colour alone. Focus, selected patient, save state and errors must all be perceivable. Required
identity, status, safety context and actions must remain available at narrow widths and under zoom
or reflow. Destructive, clinical and financial confirmation language must name the affected object
and the consequence. Full requirements:
[`spec/cross-cutting/accessibility/requirements.md`](spec/cross-cutting/accessibility/requirements.md).
