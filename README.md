# GP Practice Management — Prototype

> **Specification authority:** [`SPEC.md`](SPEC.md) and [`spec/`](spec/) define Version 1 product
> behaviour. Generated OpenAPI output and prototype code are implementation evidence only.

Practice management software for **Australian general practice**: the full lifecycle from
appointment scheduling and patient management, through the clinical consultation, to invoicing
and billing.

This repository contains two kinds of material:

1. **The authoritative specification** — [`SPEC.md`](SPEC.md) and [`spec/`](spec/) define Version
   1 product behaviour, domain invariants, safety, permissions, screens, acceptance and
   architecture, with all external integrations deliberately excluded.
2. **Working prototype software** — a running monorepo that implements practice registration and account
   setup end to end, on the architecture the rest would be built on.

The current Australian research basis and its limitations are recorded in
[`spec/research`](spec/research). See [`SPEC.md`](SPEC.md) before changing behaviour or
implementing a capability.

---

## Quick start

Requires Node 22+, pnpm, and Docker.

```bash
pnpm bootstrap
```

That installs dependencies, starts Postgres, runs migrations, seeds a demo practice, and
generates the OpenAPI document and the TypeScript SDK. Then:

```bash
pnpm dev
```

- Web app — http://localhost:5173
- API — http://localhost:3001/api
- Swagger UI — http://localhost:3001/api/docs

### Demo sign-ins

All use the password `BrunswickDemo2026`. Each shows a different role's view of the same
practice.

| Email | Role | Why they're interesting |
|---|---|---|
| `anita.raman@example.com` | Practice Owner | GP, registrar supervisor, holds Mental Health Skills Training |
| `michelle.barnes@example.com` | Practice Manager | Full business access, restricted clinical access |
| `tom.nguyen@example.com` | GP | **No** MHST — the billing screen will not offer him MBS 2715/2717 |
| `priya.shah@example.com` | GP Registrar | Supervised by Dr Raman, direct supervision |
| `sarah.kelly@example.com` | Practice Nurse | |
| `jess.turner@example.com` | Receptionist | Demographics and appointments only — no clinical notes, enforced server-side |

To see the onboarding wizard, create a new account at `/register` instead.

---

## Specification shape

```text
SPEC.md
spec/
  product/                         product promise, actors and vocabulary
  domain/<owner>.md                canonical concepts, invariants and lifecycle
  capabilities/<capability>/
    spec.md                        outcome, rules, permissions, screens and dependencies
    acceptance.feature             consequential executable examples
    review.yaml                    required human, automated and visual evidence
  cross-cutting/                   shared safety, privacy and reliability rules
  contracts/                       stable exchanged meaning
  architecture/                    ownership and dependency boundaries
  decisions/                       accepted durable decisions
  research/                        non-normative sources and open questions
```

Start every product change from `SPEC.md`, then read the complete three-file capability packet and
follow every dependency linked from `spec.md`.

---

## Architecture

```
apps/api     NestJS 11 · Drizzle · Postgres 17
apps/web     React 19 · Vite · TanStack Router + Query · Tailwind v4 · shadcn/ui · PWA
packages/contracts   Shared enums, MBS catalogue, validation (dual ESM/CJS)
packages/sdk         Generated TypeScript client — never edited by hand
agent-skills         Repository workflows shared by Codex, Pi and Claude
delivery             Bounded slices and review evidence
spec                 Authoritative product and system specification
scripts              Deterministic generation and validation
tools/pr-pipeline    Local delivery and review orchestration
```

### The self-documenting API

Nothing about the API is written twice:

```
Controller + DTO decorators  →  openapi/openapi.json  →  packages/sdk  →  the web app
      (validates)                  (Swagger UI)          (typed client)
```

```bash
pnpm api:generate   # contracts → openapi → sdk
```

The SDK generator (`scripts/generate-sdk.mjs`) is dependency-free and deterministic on purpose:
~300 lines of Node reading the OpenAPI document, so there is no black box between the
decorators that validate a request and the client that makes it.

Validation and documentation come from the same decorators, so a DTO that documents a field it
does not validate is impossible.

### Offline

Reads are cached, writes are queued. Deliberately modest in scope, but the decisions that are
expensive to retrofit are made: client-generated UUID v7 primary keys, an `Idempotency-Key` on
every mutating endpoint, an IndexedDB outbox that replays in order per entity, and conflicts
surfaced rather than silently merged. Opening the app with no connection restores the cached
session and renders cached data behind an unmistakable banner.

Offline behaviour remains implementation evidence until it is represented in an authoritative
capability. Its writes must still follow [API command](spec/contracts/api/principles.md),
[data-integrity](spec/cross-cutting/data-integrity/requirements.md) and
[error-recovery](spec/cross-cutting/error-handling/requirements.md) requirements.

---

## Commands

```bash
pnpm bootstrap      # install, db up, migrate, seed, generate
pnpm dev            # api + web
pnpm build          # build everything
pnpm typecheck      # typecheck every package
pnpm lint:spec      # validate the authoritative specification
pnpm api:generate   # regenerate openapi + sdk
pnpm db:reset       # drop, recreate, migrate, seed
pnpm db:migrate     # apply migrations
pnpm db:seed        # seed the demo practice
```

---

## Caveats

- **No integrations.** Medicare claiming, eScripts, RTPM, AIR, My Health Record, secure
  messaging and bank feeds are all modelled but not connected. Where a workflow depends on one,
  the authoritative specification labels it manual or simulated.
- **The MBS catalogue is a working subset** with indicative fees, sufficient to demonstrate the
  billing workflows. The authoritative source is mbsonline.gov.au.
- **Programme rules change.** The chronic condition management framework changed on 1 July 2025
  and bulk billing changed on 1 November 2025. Anything here quoting a dollar figure or a
  programme rule should be re-verified against the primary source. Last verified August 2026.
- **Not for clinical use.** This is a prototype built to demonstrate a vision.
