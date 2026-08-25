import * as React from 'react';
import { CloudOff, RefreshCw, Cloud, AlertTriangle } from 'lucide-react';
import { subscribeSync, type SyncStatus } from '@/lib/offline';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * The user must always know which of three states they are in: online, offline
 * with N queued, or syncing. Ambiguity here is worse than being offline.
 */
export function SyncIndicator() {
  const [status, setStatus] = React.useState<SyncStatus>({
    online: navigator.onLine,
    syncing: false,
    queued: 0,
    needsReview: 0,
    lastSyncedAt: null,
  });

  React.useEffect(() => subscribeSync(setStatus) as unknown as () => void, []);

  const { icon, label, variant, detail } = describe(status);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={variant} className="gap-1.5 py-1 font-normal">
          {icon}
          {label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{detail}</TooltipContent>
    </Tooltip>
  );
}

function describe(status: SyncStatus) {
  if (status.needsReview > 0) {
    return {
      icon: <AlertTriangle className="size-3" />,
      label: `${status.needsReview} to review`,
      variant: 'destructive' as const,
      detail:
        'Some changes could not be applied because the record changed on the server. Clinical data is never merged automatically — review them before they are lost.',
    };
  }
  if (status.syncing) {
    return {
      icon: <RefreshCw className="size-3 animate-spin" />,
      label: 'Syncing',
      variant: 'info' as const,
      detail: 'Sending queued changes to the server.',
    };
  }
  if (!status.online) {
    return {
      icon: <CloudOff className="size-3" />,
      label: status.queued > 0 ? `Offline · ${status.queued} queued` : 'Offline',
      variant: 'warning' as const,
      detail:
        status.queued > 0
          ? `${status.queued} change(s) are saved on this device and will sync when you reconnect. Prescribing and Medicare claiming need a connection.`
          : 'No connection. You can keep working — changes are saved on this device.',
    };
  }
  if (status.queued > 0) {
    return {
      icon: <RefreshCw className="size-3" />,
      label: `${status.queued} queued`,
      variant: 'warning' as const,
      detail: 'Changes are waiting to be sent.',
    };
  }
  return {
    icon: <Cloud className="size-3" />,
    label: 'Online',
    variant: 'secondary' as const,
    detail: status.lastSyncedAt
      ? `Everything is saved. Last synced ${new Date(status.lastSyncedAt).toLocaleTimeString('en-AU')}.`
      : 'Everything is saved.',
  };
}
