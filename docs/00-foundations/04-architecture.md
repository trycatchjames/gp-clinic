# Architecture

**Status:** `built`

## Stack

| Layer | Choice | Why |
|---|---|---|
| Web | React 19 + Vite + TypeScript | Fast iteration for a demo-first prototype |
| Routing | TanStack Router | Type-safe routes, pairs with TanStack Query |
| Server state | TanStack Query (+ persisted cache) | Gives us offline reads almost free |
| Components | shadcn/ui on Tailwind v4 + Radix | Owned, editable components — no framework lock-in |
| API | NestJS 11 | Decorator-driven modules make the API self-documenting |
| API docs | `@nestjs/swagger` → `openapi/openapi.json` | Generated from the same decorators that validate |
| SDK | Generated TypeScript client from the OpenAPI doc | One source of truth, no hand-written fetch calls |
| DB | PostgreSQL 17 | Boring and correct |
| ORM | Drizzle + drizzle-kit | SQL-shaped, migrations are readable diffs |
| Shared | `@gp/contracts` | Enums, role definitions, MBS constants shared by API and web. Built **dual ESM/CJS** — NestJS consumes CommonJS, Vite/Rollup needs ESM to statically resolve the re-exports. |

## Repository layout

```
gp-prototype/
├── apps/
│   ├── api/                 NestJS API
│   │   ├── src/
│   │   │   ├── db/          Drizzle schema, migrations, seed
│   │   │   ├── modules/     Feature modules (auth, practices, ...)
│   │   │   ├── common/      Guards, decorators, interceptors, filters
│   │   │   ├── openapi.ts   Generates openapi/openapi.json
│   │   │   └── main.ts
│   │   └── drizzle/         Generated SQL migrations
│   └── web/                 React PWA
│       └── src/
│           ├── routes/      TanStack Router route tree
│           ├── features/    Feature-sliced UI
│           ├── components/  shadcn/ui primitives + shared components
│           └── lib/         API client, offline outbox, auth
├── packages/
│   ├── contracts/           Shared enums and domain constants
│   └── sdk/                 Generated API client (do not edit by hand)
├── docs/                    These workflow specs
├── features/                Gherkin specifications (all @inactive)
└── scripts/                 SDK generation, feature linting
```

## The self-documenting API contract

The rule: **nothing about the API is written twice.**

```
   Controller + DTO decorators
   (@ApiProperty, class-validator)
              │
              │  pnpm openapi
              ▼
     openapi/openapi.json  ────────►  Swagger UI at /api/docs
              │
              │  pnpm sdk
              ▼
   packages/sdk/src/generated/
     ├── types.ts      interfaces for every schema
     └── client.ts     one typed method per operationId
              │
              ▼
   apps/web imports @gp/sdk — never fetch() directly
```

`pnpm api:generate` runs the whole chain. The generator (`scripts/generate-sdk.mjs`) is
dependency-free and deterministic on purpose: it is ~300 lines of Node reading the OpenAPI
document, so it works offline and there is no black box between the decorators and the client.

Validation and documentation come from the same decorators, so a DTO that documents a field it
does not validate is impossible.

### Conventions

- Resource-oriented paths: `/api/practices/{practiceId}/locations/{locationId}`. Operation
  paths in the generated SDK include the `/api` prefix, so the client's base URL is the
  **origin only** (empty for same-origin, which is what the dev proxy and a single-origin
  deployment both want).
- `operationId` is explicit on every route and becomes the SDK method name
- Errors are RFC 9457 problem details (`type`, `title`, `status`, `detail`, `instance`, plus
  `errors[]` for field-level validation)
- Every mutating endpoint accepts an `Idempotency-Key` header — this is what makes the offline
  outbox safe to replay
- Lists are cursor-paginated: `{ data, nextCursor, hasMore }`
- Every response carries `ETag`; every update accepts `If-Match` for optimistic concurrency

## Request pipeline

```
Request
  │
  ├─ AuthGuard          verify access JWT, attach { userId, practiceId, roles }
  ├─ PracticeScopeGuard resolve :practiceId, assert membership
  ├─ RolesGuard         @Roles(...) on the handler
  ├─ ValidationPipe     class-validator, whitelist + forbidNonWhitelisted
  ├─ IdempotencyInterceptor  replay-safe writes
  ├─ Handler
  ├─ AuditInterceptor   log clinical/PII access and all mutations
  └─ ProblemDetailsFilter
```

`PracticeScopeGuard` is the tenancy boundary and it is not optional. Every repository method
takes `practiceId` as its first argument; there is no "get by id" that doesn't.

### Practice membership lives in the token

`practiceId` is a claim inside the access token, which the scope guard compares against the
route. The consequence is easy to miss: **after a user creates a practice, their existing token
still says they have none**, and every scoped request 404s until the token is re-issued. So
creating a practice triggers a token refresh, not just a reload of the user object.

## Auth

- Email + password, hashed with Argon2id
- Short-lived access JWT (15 min) + long-lived refresh token (30 days, rotated on use, stored
  hashed, revocable)
- The access token carries `sub`, `practiceId`, `roles[]`, `locationIds[]`
- Refresh tokens rotate; reuse of a consumed refresh token revokes the whole family

For the prototype there is no external IdP, but the token issuance is isolated in
`AuthService.issueTokens()` so that swapping in an OIDC provider or the Australian Digital Health
identity stack later touches one file.

## Environments

`docker compose up -d postgres` gives Postgres 17 on port **5439** (deliberately not 5432, so it
doesn't fight a local install). Everything else runs on the host.

```bash
pnpm bootstrap   # install, db up, migrate, seed, generate openapi + sdk
pnpm dev         # api on :3001, web on :5173
```

The web dev server proxies `/api` to the API so the browser sees a single origin — which is
what lets the service worker treat API reads as its own scope.

### A note on generating the OpenAPI document

`pnpm openapi` compiles before it runs (`nest build && node dist/openapi.js`) rather than using
`tsx`. esbuild does not emit `emitDecoratorMetadata`, and without it `@nestjs/swagger` cannot
infer property types from the DTOs. For the same reason, any property typed `string | null`
must state its type explicitly (`@ApiPropertyOptional({ type: String, nullable: true })`) —
decorator metadata reports a nullable union as `Object`, which would otherwise land in the
generated SDK as `Record<string, unknown>`.
