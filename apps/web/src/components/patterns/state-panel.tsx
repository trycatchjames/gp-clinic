import * as React from 'react';
import {
  CircleDashed,
  CircleOff,
  LoaderCircle,
  LockKeyhole,
  TriangleAlert,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatePanelKind =
  | 'empty'
  | 'loading'
  | 'unavailable'
  | 'offline'
  | 'restricted'
  | 'failure';

const appearances = {
  empty: { icon: CircleDashed, className: 'border-dashed bg-card' },
  loading: { icon: LoaderCircle, className: 'bg-muted/55' },
  unavailable: { icon: CircleOff, className: 'bg-muted/55' },
  offline: { icon: WifiOff, className: 'border-warning/55 bg-warning/10' },
  restricted: { icon: LockKeyhole, className: 'bg-muted/55' },
  failure: { icon: TriangleAlert, className: 'border-destructive/40 bg-destructive/5' },
} satisfies Record<StatePanelKind, { icon: React.ComponentType<{ className?: string }>; className: string }>;

export function StatePanel({
  kind,
  title,
  description,
  action,
  details,
  compact = false,
  className,
}: {
  kind: StatePanelKind;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  details?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const appearance = appearances[kind];
  const Icon = appearance.icon;
  const isLoading = kind === 'loading';
  const isFailure = kind === 'failure';

  return (
    <section
      aria-label={title}
      aria-busy={isLoading || undefined}
      aria-live={isLoading ? 'polite' : undefined}
      role={isFailure ? 'alert' : 'region'}
      data-slot="state-panel"
      data-state={kind}
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border text-center',
        compact ? 'gap-3 px-5 py-7' : 'gap-4 px-6 py-10',
        appearance.className,
        className,
      )}
    >
      <div
        className={cn(
          'bg-background flex size-10 items-center justify-center rounded-full border shadow-xs',
          isFailure && 'text-destructive border-destructive/25',
          kind === 'offline' && 'text-warning-foreground border-warning/35',
        )}
      >
        <Icon aria-hidden="true" className={cn('size-5', isLoading && 'motion-safe:animate-spin')} />
      </div>
      <div className="max-w-lg space-y-1">
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <div className="text-muted-foreground text-sm leading-relaxed">{description}</div>
        )}
      </div>
      {details && <div className="text-muted-foreground max-w-lg text-xs">{details}</div>}
      {action}
    </section>
  );
}
