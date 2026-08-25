# Offline and Sync

**Status:** `built` (shell and outbox) / `specified` (conflict resolution UI)

## Why a GP practice needs this

The scope here is deliberately modest for the prototype, but the design decisions are not, because
they are expensive to retrofit. Three real scenarios drive it:

1. **The practice's internet drops mid-morning.** Twenty patients are in the building. Reception
   must keep arriving people, GPs must keep writing notes. Nothing may be lost.
2. **Home visits and residential aged care.** A GP does a Thursday RACF round in a building with
   no usable signal, seeing fourteen residents. They need the patient list, medications, allergies
   and care plans offline, and they need to write notes offline.
3. **A rural branch site on a flaky link.** Intermittent, not absent.

## Principles

1. **Reads are cached, writes are queued.** Never the other way around.
2. **The client generates IDs.** UUID v7 primary keys are minted on the device, so a record
   created offline keeps its identity when it syncs — no temp-ID rewriting.
3. **Every write is idempotent.** Each queued mutation carries an `Idempotency-Key`; the server
   stores the result against that key for 24 hours and replays it rather than re-executing.
4. **Conflicts are surfaced, never silently merged.** Clinical data must not be auto-merged.
   Optimistic concurrency via `version` / `If-Match`; on 409 the mutation moves to a
   `needs_review` state and the user is shown both versions.
5. **Offline capability is visible.** The user always knows: online, offline with N queued, or
   syncing. Ambiguity here is worse than being offline.

## What is available offline

| Data | Offline read | Offline write |
|---|---|---|
| Today's + tomorrow's appointment book (current location) | Yes | Yes — arrive, status change, book |
| Patient demographics for scheduled patients | Yes | Limited — contact detail edits |
| Health summary (conditions, meds, allergies) for scheduled patients | Yes | No |
| Consultation notes for scheduled patients | Yes | **Yes** — draft and sign |
| MBS item catalogue + practice fee schedules | Yes | n/a |
| Invoices | Yes | Yes — raise, mark paid (claiming queues) |
| Results inbox | Yes (read only) | Acknowledge queues |
| Prescribing | Yes (view) | **No** — eScript issuance requires the exchange |
| Practice setup / admin | No | No |

**Deliberate exclusion:** electronic prescription creation, Medicare eligibility verification and
claim submission all require a live third-party exchange. Offline, the UI says so plainly rather
than pretending.

## Architecture

```
    UI ──► TanStack Query ──► @gp/sdk ──► fetch
             │                              │
             │ persisted cache              │ on failure / offline
             │ (localStorage,               ▼
             │  24h maxAge)            Outbox (IndexedDB)
             │                              │
             └──────── read-through ◄───────┤  replay on 'online'
                                            │  + periodic retry with backoff
                                            ▼
                                       Sync status store
```

- **Service worker** (`vite-plugin-pwa`, Workbox) precaches the app shell; app-shell navigation
  works offline. API `GET`s use `NetworkFirst` with a cache fallback; API writes are never cached
  by the service worker — they go through the outbox instead.
- **Outbox** (`idb`): an ordered queue of `{ id, idempotencyKey, method, path, body, entityRef,
  createdAt, attempts, state }`. `state` is `queued` | `in_flight` | `failed` | `needs_review`.
  Replay is strictly in order per entity so a create never lands after its own update.
- **Persisted query cache**: `@tanstack/query-sync-storage-persister` with a 24-hour max age, and
  a dehydrate filter so nothing marked sensitive-transient is written to disk.

## Conflict handling

| Situation | Resolution |
|---|---|
| Queued write, server row unchanged | Applies normally |
| Queued write, server `version` moved | 409 → mutation goes `needs_review`, user is shown a side-by-side diff |
| Two devices create the same appointment slot | Server enforces a slot uniqueness constraint; the loser becomes a conflict item |
| Consultation note signed offline, patient record merged in the meantime | Note attaches to the surviving patient; merge lineage keeps the link |

## Starting up with no connection

Session restore needs the network, which would otherwise mean a GP opening the app on a home
visit is shown a login screen instead of their patient list. So the rule is: **only a rejected
token signs you out.**

- A 401 or 403 on refresh means the token is genuinely no longer valid → sign out, clear
  everything.
- Anything else — no network, a 5xx, a proxy returning 502/504 because the API is down —
  restores the last known session from cache and marks it **stale**.

A stale session renders cached data behind a banner that says plainly that nothing can be
saved until the device reconnects. It is not a credential: without a valid access token no
request will succeed, so this only unlocks the cached views. The banner clears automatically
once the session is renewed.

## Security

Cached clinical data on a device is a real risk. For the prototype:

- The persisted cache and the outbox are **cleared on logout and on token expiry without refresh**
- No clinical payload is persisted for a user with only reception-level scope
- Anything cached is namespaced by `userId` + `practiceId`, so a shared front-desk machine cannot
  leak between users

Production would add at-rest encryption of the IndexedDB payloads with a key derived from the
session — noted here so it doesn't get forgotten, not built now.

## Prototype limits (explicit)

- Conflict UI shows the raw diff; there is no clinical merge assistant
- Background Sync API is not used; replay is driven by the `online` event plus a 30s timer
- No delta-sync protocol — the client refetches affected queries after replay
