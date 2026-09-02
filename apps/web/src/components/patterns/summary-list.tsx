import * as React from 'react';
import { cn } from '@/lib/utils';

export type SummaryItem = {
  label: string;
  value: React.ReactNode;
  supportingText?: React.ReactNode;
  tabular?: boolean;
};

export function SummaryList({
  items,
  columns = 2,
  density = 'comfortable',
  className,
}: {
  items: readonly SummaryItem[];
  columns?: 1 | 2 | 3;
  density?: 'comfortable' | 'compact';
  className?: string;
}) {
  return (
    <dl
      data-slot="summary-list"
      data-density={density}
      className={cn(
        'grid overflow-hidden rounded-xl border sm:grid-cols-2',
        columns === 1 && 'sm:grid-cols-1',
        columns === 3 && 'lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'bg-card border-border/75 min-w-0 border-b p-4 last:border-b-0 sm:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(2n)]:border-r-0',
            columns === 1 && 'sm:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b',
            columns === 3 && 'lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0',
            density === 'compact' && 'px-4 py-3',
          )}
        >
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {item.label}
          </dt>
          <dd className={cn('mt-1 break-words text-sm font-semibold', item.tabular && 'tabular')}>
            {item.value}
          </dd>
          {item.supportingText && (
            <dd className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {item.supportingText}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
