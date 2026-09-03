import * as React from 'react';

export function PageHeader({
  title,
  description,
  actions,
  density = 'default',
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  density?: 'default' | 'compact';
}) {
  const compact = density === 'compact';
  return (
    <div className={`flex flex-wrap items-start justify-between gap-4 border-b ${compact ? 'pb-3' : 'pb-5'}`}>
      <div className="space-y-1">
        <h1 className={`${compact ? 'text-xl' : 'text-2xl'} font-semibold tracking-tight`}>{title}</h1>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
