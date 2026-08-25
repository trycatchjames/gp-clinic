import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/lib/auth';
import { persister, queryClient } from '@/lib/query';
import { startSyncEngine } from '@/lib/offline';
import { router } from './router';
import './index.css';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Replay queued writes on reconnect, plus a heartbeat.
startSyncEngine(API_BASE);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        // Matches the service worker's API cache window.
        maxAge: 1000 * 60 * 60 * 24,
        dehydrateOptions: {
          // Only successful reads are worth keeping on disk.
          shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
      }}
    >
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors closeButton />
        </TooltipProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
