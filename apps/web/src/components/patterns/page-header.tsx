import * as React from 'react';
import { CircleAlert, LoaderCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export type PageScopeFact = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export type PageFreshness = {
  /** When the shown data was established. `null` when that is not known. */
  asOf: string | number | Date | null;
  /** An instant is only a time once somewhere is named. */
  timeZone: string;
  /** A reload is in flight. The previous scope and as-of stay on screen. */
  refreshing?: boolean;
  /** The caller has decided the view is behind the authoritative state. */
  stale?: boolean;
  refresh?: { label: string; onSelect: () => void };
};

export type PageHeaderAction = {
  id: string;
  label: string;
  onSelect: () => void;
  variant?: 'default' | 'outline';
};

export type PageHeaderProps = {
  title: string;
  level?: 1 | 2 | 3;
  description?: React.ReactNode;
  /** What this screen is showing: a location, a date, a queue, a timezone. */
  scope?: readonly PageScopeFact[];
  freshness?: PageFreshness;
  actions?: readonly PageHeaderAction[];
  className?: string;
};

function freshnessSentence(freshness: PageFreshness): string {
  if (freshness.asOf === null) {
    // Not knowing when a view was established is a different fact from it being current, and the
    // difference is exactly what decides whether it is safe to act on.
    return 'Freshness of this view is not known';
  }
  const at = formatDateTime(freshness.asOf, freshness.timeZone);
  if (freshness.refreshing) return `Refreshing. Showing the view as at ${at}`;
  if (freshness.stale) return `This view is behind the record. Showing it as at ${at}`;
  return `Showing the view as at ${at}`;
}

/**
 * The screen's name, the scope it is showing and how fresh that is.
 *
 * It fetches nothing, routes nowhere and decides nothing — including whether the view is stale,
 * which only the caller can know. `DS-PAT-004` Context Banner carries the identity of a record;
 * this carries the identity of the screen.
 */
export function PageHeader({
  title,
  level = 1,
  description,
  scope = [],
  freshness,
  actions = [],
  className,
}: PageHeaderProps) {
  const Heading = `h${level}` as const;
  const sentence = freshness ? freshnessSentence(freshness) : null;
  const announced = React.useRef<string | null>(null);

  // A background refresh that changes nothing must not announce itself again, or a queue left open
  // becomes a screen reader repeating the same sentence every few seconds.
  const [announcement, setAnnouncement] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (sentence === null || sentence === announced.current) return;
    announced.current = sentence;
    setAnnouncement(sentence);
  }, [sentence]);

  const uncertain = freshness?.asOf === null;

  return (
    /*
      Deliberately not a `header` element. At the top of a document that claims the `banner`
      landmark, and a screen that shows two of these — a queue beside a detail — would present two
      indistinguishable banners. The heading carries the structure instead.
    */
    <div className={cn('grid gap-3 border-b pb-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="grid min-w-0 gap-1">
          <Heading className="text-xl font-semibold break-words">{title}</Heading>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <Button key={action.id} variant={action.variant ?? 'outline'} onClick={action.onSelect}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {scope.length > 0 && (
        /*
          A definition list rather than a sentence: a scope fact the caller did not supply is then
          visibly absent instead of quietly missing from the middle of a line of prose.
        */
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {scope.map((fact) => (
            <div key={fact.key} className="flex min-w-0 items-baseline gap-1.5">
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="font-medium break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {freshness && sentence && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p
            className={cn(
              'flex items-center gap-1.5 text-xs',
              freshness.stale || uncertain ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {freshness.refreshing ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-3.5 animate-spin motion-reduce:animate-none"
              />
            ) : (
              (freshness.stale || uncertain) && (
                <CircleAlert aria-hidden="true" className="size-3.5" />
              )
            )}
            <span className="tabular-nums">{sentence}</span>
          </p>
          {freshness.refresh && (
            <Button
              size="sm"
              variant="ghost"
              disabled={freshness.refreshing}
              onClick={freshness.refresh.onSelect}
            >
              <RefreshCw aria-hidden="true" />
              {freshness.refresh.label}
            </Button>
          )}
          <p role="status" className="sr-only">
            {announcement}
          </p>
        </div>
      )}
    </div>
  );
}
