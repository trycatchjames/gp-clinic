import * as React from 'react';
import { FilePen, FileX, Link2, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export type TimelineStatus = 'recorded' | 'amended' | 'amendment' | 'entered-in-error';

export type TimelineEntry = {
  key: string;
  /** When the entry applied. */
  effectiveAt: string | number | Date;
  /** When it was written down, shown only when that is not the same day and time. */
  recordedAt?: string | number | Date;
  type: string;
  author: string;
  summary: React.ReactNode;
  status?: TimelineStatus;
  /** The entry this one amends, or that amends this one, named so neither half reads alone. */
  chain?: string;
  action?: { label: string; onSelect: () => void };
};

export type RecordTimelineProps = {
  label: string;
  entries: readonly TimelineEntry[];
  /** An instant is only a date once somewhere is named, so the practice's zone is required. */
  timeZone: string;
  level?: 2 | 3 | 4;
  className?: string;
};

const statusViews = {
  amended: { icon: FilePen, word: 'Amended since', variant: 'warning' },
  amendment: { icon: Link2, word: 'Amendment', variant: 'info' },
  'entered-in-error': { icon: FileX, word: 'Entered in error', variant: 'destructive' },
} satisfies Record<
  Exclude<TimelineStatus, 'recorded'>,
  { icon: typeof FilePen; word: string; variant: 'warning' | 'info' | 'destructive' }
>;

/**
 * A record's entries in time order.
 *
 * The pattern owns the sequence and the facts that decide whether an entry can be trusted. It owns
 * nothing about the entries themselves: which exist, what order they belong in, who may see them,
 * and what any of them means all stay with the capability.
 */
export function RecordTimeline({
  label,
  entries,
  timeZone,
  level = 3,
  className,
}: RecordTimelineProps) {
  const Heading = `h${level}` as const;

  // Grouping on the rendered date keeps the heading and the grouping the same fact. Two entries in
  // one day cannot end up under different headings, whatever zone the viewer is sitting in.
  const groups: { date: string; entries: TimelineEntry[] }[] = [];
  for (const entry of entries) {
    const date = formatDate(entry.effectiveAt, { style: 'long', timeZone });
    const current = groups.at(-1);
    if (current?.date === date) current.entries.push(entry);
    else groups.push({ date, entries: [entry] });
  }

  return (
    <section aria-label={label} className={cn('grid gap-5', className)}>
      {groups.map((group) => (
        <div key={group.date} className="grid gap-2">
          <Heading className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {group.date}
          </Heading>
          <ol className="border-border grid gap-3 border-l pl-4">
            {group.entries.map((entry) => {
              const view = entry.status && entry.status !== 'recorded' ? statusViews[entry.status] : null;
              const StatusIcon = view?.icon;
              const late = entry.recordedAt !== undefined;

              return (
                <li key={entry.key} className="relative grid gap-1">
                  <span
                    aria-hidden="true"
                    className="bg-border absolute top-2 -left-[1.3125rem] size-2 rounded-full"
                  />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium">{entry.type}</span>
                    {view && StatusIcon && (
                      <Badge variant={view.variant}>
                        <StatusIcon aria-hidden="true" />
                        {view.word}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">{entry.summary}</div>
                  {/*
                    Effective time leads and recorded time is named. A late entry that showed only
                    one time would read as though it happened when it was written down.
                  */}
                  <p className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                    <span className="tabular-nums">{formatTime(entry.effectiveAt, timeZone)}</span>
                    <span>{entry.author}</span>
                    {late && (
                      <span className="text-foreground flex items-center gap-1">
                        <PenLine aria-hidden="true" className="size-3" />
                        Recorded {formatDateTime(entry.recordedAt, timeZone)}
                      </span>
                    )}
                  </p>
                  {entry.chain && <p className="text-muted-foreground text-xs">{entry.chain}</p>}
                  {entry.action && (
                    <div>
                      <Button size="sm" variant="outline" onClick={entry.action.onSelect}>
                        {entry.action.label}
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </section>
  );
}
