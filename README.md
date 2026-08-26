# GP Practice Management — Prototype

> **Specification authority:** [`SPEC.md`](SPEC.md) and [`spec/`](spec/) are the authoritative
> Version 1 product/system specification. The older `docs/`, `features/`, `openapi/` and
> prototype code are non-authoritative implementation and research history; where they differ,
> the authoritative specification governs.

Practice management software for **Australian general practice**: the full lifecycle from
appointment scheduling and patient management, through the clinical consultation, to invoicing
and billing.

This repository contains three kinds of material:

1. **The authoritative specification** — [`SPEC.md`](SPEC.md) and [`spec/`](spec/) define Version
   1 product behaviour, domain invariants, safety, permissions, screens, acceptance and
   architecture, with all external integrations deliberately excluded.
2. **Legacy workflow/prototype material** — [`docs/`](docs/) and [`features/`](features/) pre-date
   the authoritative specification and remain useful context only.
3. **Working prototype software** — a running monorepo that implements practice registration and account
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

## What is built, modelled and specified

| State | Meaning |
|---|---|
| **Built** | Working end to end in the running app |
| **Modelled** | Tables exist in the database and the workflow is documented; no UI or API yet |
| **Specified** | Documented and covered by Gherkin |

**Built** — practice registration and onboarding (8-step resumable wizard), locations with
opening hours and after-hours arrangements, practitioners with credentials and per-location
provider numbers, registrar supervision, team roles and invitations, appointment types and
session templates, fee schedules and billing policy, auth with RBAC and a full audit log.

**Modelled** — patients and entitlements, the appointment book and arrivals, encounters and
the clinical note, invoices, payments and claims. 62 tables.

**Specified** — prescribing and RTPM, results/recalls/reminders, chronic condition management,
referrals, immunisation and cold chain, mental health, health assessments, accreditation
evidence, and the rest of [`docs/`](docs/).

---

## The parts worth looking at

A few places where the domain drove the design, rather than the other way around:

- **Provider numbers are per practitioner *per location*.** Modelled as a matrix, not a field.
  Getting this wrong is the most common cause of rejected Medicare claims.
  → [`docs/10-practice-setup/03`](docs/10-practice-setup/03-practitioners-and-credentialing.md)
- **BBPIP is enforced, not just recorded.** Participation requires MyMedicare registration, and
  obliges the practice to bulk bill 100% of eligible services — so opting in locks the billing
  policy, and the API refuses to unlock it while participation stands.
  → [`docs/50-billing/02`](docs/50-billing/02-medicare-bulk-billing.md)
- **MBS 2715/2717 are gated on Mental Health Skills Training.** A practitioner without it is
  never offered the higher items, enforced server-side.
  → [`docs/40-clinical/10`](docs/40-clinical/10-mental-health.md)
- **Recalls and reminders are separate entities.** There is a legal duty to recall a patient
  about a clinically significant result; there is no equivalent duty for a screening reminder.
  Merging them is the classic medico-legal failure in this domain.
  → [`docs/40-clinical/05`](docs/40-clinical/05-results-and-recalls.md)
- **Reception never receives clinical notes over the API.** Not a hidden button — a 403.
- **Every clinical record *view* is audit-logged**, not just edits.
- **Red-flag triage prompts are scripts, not decisions.** Reception is never asked to judge
  whether chest pain is serious. → [`docs/30-scheduling/03`](docs/30-scheduling/03-triage-at-booking.md)

---

## Architecture

```
apps/api     NestJS 11 · Drizzle · Postgres 17
apps/web     React 19 · Vite · TanStack Router + Query · Tailwind v4 · shadcn/ui · PWA
packages/contracts   Shared enums, MBS catalogue, validation (dual ESM/CJS)
packages/sdk         Generated TypeScript client — never edited by hand
docs/                Workflow specifications
features/            Gherkin specifications (all @inactive)
scripts/             SDK generation, feature linting
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

→ [`docs/00-foundations/05-offline-and-sync.md`](docs/00-foundations/05-offline-and-sync.md)

---

## Commands

```bash
pnpm bootstrap      # install, db up, migrate, seed, generate
pnpm dev            # api + web
pnpm build          # build everything
pnpm typecheck      # typecheck every package
pnpm lint:features  # verify the Gherkin specs against docs/
pnpm api:generate   # regenerate openapi + sdk
pnpm db:reset       # drop, recreate, migrate, seed
pnpm db:migrate     # apply migrations
pnpm db:seed        # seed the demo practice
```

---

## Caveats

- **No integrations.** Medicare claiming, eScripts, RTPM, AIR, My Health Record, secure
  messaging and bank feeds are all modelled but not connected. Where a workflow depends on one,
  the doc says so.
- **The MBS catalogue is a working subset** with indicative fees, sufficient to demonstrate the
  billing workflows. The authoritative source is mbsonline.gov.au.
- **Programme rules change.** The chronic condition management framework changed on 1 July 2025
  and bulk billing changed on 1 November 2025. Anything here quoting a dollar figure or a
  programme rule should be re-verified against the primary source. Last verified August 2026.
- **Not for clinical use.** This is a prototype built to demonstrate a vision.
