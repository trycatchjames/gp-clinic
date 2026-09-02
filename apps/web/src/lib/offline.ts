import { openDB, type IDBPDatabase } from 'idb';
import { tokens } from './tokens';

/**
 * The offline outbox.
 *
 * Reads are cached; writes are queued. Every queued mutation carries an
 * Idempotency-Key so the server replays the stored result rather than
 * re-executing. Replay is strictly in order per entity, so a create never lands
 * after its own update.
 *
 * See spec/contracts/api/principles.md and spec/cross-cutting/data-integrity/requirements.md.
 */

export type OutboxState = 'queued' | 'in_flight' | 'failed' | 'needs_review';

export interface OutboxEntry {
  id: string;
  idempotencyKey: string;
  method: string;
  path: string;
  body: unknown;
  /** Groups mutations that must replay in order, e.g. one appointment. */
  entityRef: string;
  label: string;
  createdAt: number;
  attempts: number;
  state: OutboxState;
  lastError?: string;
}

const DB_NAME = 'gp-offline';
const STORE = 'outbox';

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  dbPromise ??= openDB(DB_NAME, 1, {
    upgrade(database) {
      const store = database.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('byCreatedAt', 'createdAt');
      store.createIndex('byEntity', 'entityRef');
    },
  });
  return dbPromise;
}

export async function enqueue(
  entry: Omit<OutboxEntry, 'id' | 'createdAt' | 'attempts' | 'state'>,
): Promise<OutboxEntry> {
  const record: OutboxEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    attempts: 0,
    state: 'queued',
  };
  await (await db()).put(STORE, record);
  notify();
  return record;
}

export async function listOutbox(): Promise<OutboxEntry[]> {
  const all = (await (await db()).getAll(STORE)) as OutboxEntry[];
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeEntry(id: string): Promise<void> {
  await (await db()).delete(STORE, id);
  notify();
}

export async function updateEntry(entry: OutboxEntry): Promise<void> {
  await (await db()).put(STORE, entry);
  notify();
}

export async function clearOutbox(): Promise<void> {
  await (await db()).clear(STORE);
  notify();
}

// --- status -----------------------------------------------------------------

export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  queued: number;
  needsReview: number;
  lastSyncedAt: number | null;
}

let status: SyncStatus = {
  online: navigator.onLine,
  syncing: false,
  queued: 0,
  needsReview: 0,
  lastSyncedAt: null,
};

const listeners = new Set<(status: SyncStatus) => void>();

export function subscribeSync(listener: (status: SyncStatus) => void): () => void {
  listeners.add(listener);
  listener(status);
  return () => listeners.delete(listener);
}

export function getSyncStatus(): SyncStatus {
  return status;
}

function setStatus(patch: Partial<SyncStatus>) {
  status = { ...status, ...patch };
  listeners.forEach((listener) => listener(status));
}

async function notify() {
  const entries = await listOutbox();
  setStatus({
    queued: entries.filter((e) => e.state === 'queued' || e.state === 'in_flight').length,
    needsReview: entries.filter((e) => e.state === 'needs_review').length,
  });
}

// --- replay -----------------------------------------------------------------

type ReplayResult = { ok: boolean; conflicted: boolean; message?: string };

async function send(entry: OutboxEntry, baseUrl: string): Promise<ReplayResult> {
  const response = await fetch(baseUrl.replace(/\/$/, '') + entry.path, {
    method: entry.method,
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': entry.idempotencyKey,
      ...(tokens.getAccess() ? { Authorization: `Bearer ${tokens.getAccess()}` } : {}),
    },
    body: entry.body === undefined ? undefined : JSON.stringify(entry.body),
  });

  if (response.ok) return { ok: true, conflicted: false };

  // 409 means the server moved underneath us. Clinical data is never auto-merged,
  // so the mutation is parked for a human to look at.
  if (response.status === 409) {
    return { ok: false, conflicted: true, message: 'Changed on the server since you edited it' };
  }

  // 4xx other than 409 will never succeed on retry — surface it rather than looping.
  if (response.status >= 400 && response.status < 500) {
    const text = await response.text().catch(() => '');
    return { ok: false, conflicted: true, message: text.slice(0, 300) || response.statusText };
  }

  return { ok: false, conflicted: false, message: response.statusText };
}

let replaying = false;

export async function replayOutbox(baseUrl: string): Promise<void> {
  if (replaying || !navigator.onLine) return;
  replaying = true;
  setStatus({ syncing: true, online: true });

  try {
    const entries = (await listOutbox()).filter((e) => e.state === 'queued');
    const blocked = new Set<string>();

    for (const entry of entries) {
      // Preserve per-entity ordering: if an earlier mutation for this entity
      // failed, everything after it waits.
      if (blocked.has(entry.entityRef)) continue;

      await updateEntry({ ...entry, state: 'in_flight' });
      const result = await send(entry, baseUrl).catch((error) => ({
        ok: false,
        conflicted: false,
        message: String(error),
      }));

      if (result.ok) {
        await removeEntry(entry.id);
      } else if (result.conflicted) {
        await updateEntry({
          ...entry,
          state: 'needs_review',
          attempts: entry.attempts + 1,
          lastError: result.message,
        });
        blocked.add(entry.entityRef);
      } else {
        await updateEntry({
          ...entry,
          state: 'queued',
          attempts: entry.attempts + 1,
          lastError: result.message,
        });
        blocked.add(entry.entityRef);
      }
    }

    setStatus({ lastSyncedAt: Date.now() });
  } finally {
    replaying = false;
    setStatus({ syncing: false });
    await notify();
  }
}

/**
 * Replay on reconnect, plus a 30-second heartbeat. The Background Sync API would
 * be better but is not used in the prototype.
 */
export function startSyncEngine(baseUrl: string): () => void {
  const onOnline = () => {
    setStatus({ online: true });
    void replayOutbox(baseUrl);
  };
  const onOffline = () => setStatus({ online: false });

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  const timer = window.setInterval(() => void replayOutbox(baseUrl), 30_000);

  void notify();
  void replayOutbox(baseUrl);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
    window.clearInterval(timer);
  };
}
