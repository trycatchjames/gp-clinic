import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { tokens } from './tokens';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cached reads are what make the app usable offline. 24 hours matches the
      // persisted cache max age.
      staleTime: 30_000,
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error) => {
        // 4xx will not fix itself; only retry transport/5xx failures.
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
    mutations: { networkMode: 'offlineFirst' },
  },
});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'gp.queryCache',
});

/**
 * Cached clinical data on a shared machine is a real risk. Everything persisted is
 * namespaced by user, and the whole cache is dropped when the scope changes or the
 * user signs out.
 */
export function persistKeyForScope(): string {
  return `gp.queryCache.${tokens.getScope() ?? 'anon'}`;
}

export function clearPersistedCache() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('gp.queryCache')) localStorage.removeItem(key);
  }
  queryClient.clear();
}
