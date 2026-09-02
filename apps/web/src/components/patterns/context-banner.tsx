import * as React from 'react';
import { cn } from '@/lib/utils';

export type ContextFact = {
  label: string;
  value: React.ReactNode;
  tabular?: boolean;
};

export function ContextBanner({
  contextLabel,
  title,
  description,
  status,
  facts = [],
  actions,
  notice,
  className,
}: {
  contextLabel: string;
  title: string;
  description?: React.ReactNode;
  status?: React.ReactNode;
  facts?: readonly ContextFact[];
  actions?: React.ReactNode;
  notice?: React.ReactNode;
  className?: string;
}) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      data-slot="context-banner"
      className={cn(
        'bg-card relative overflow-hidden rounded-2xl border shadow-sm',
        'before:bg-primary before:absolute before:inset-y-0 before:left-0 before:w-1',
        className,
      )}
    >
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
              <span aria-hidden="true" className="bg-accent size-2 rounded-full ring-2 ring-accent/35" />
              {contextLabel}
            </p>
            {status}
          </div>
          <div className="space-y-1">
            <h2 id={headingId} className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h2>
            {description && (
              <div className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
                {description}
              </div>
            )}
          </div>
          {facts.length > 0 && (
            <dl className="flex flex-wrap gap-x-6 gap-y-2">
              {facts.map((fact) => (
                <div key={fact.label} className="flex min-w-0 items-baseline gap-2 text-sm">
                  <dt className="text-muted-foreground shrink-0">{fact.label}</dt>
                  <dd className={cn('font-medium', fact.tabular && 'tabular')}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {notice && (
        <div className="bg-secondary/65 border-primary/10 border-t px-5 py-3 text-sm sm:px-6">
          {notice}
        </div>
      )}
    </section>
  );
}
