import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * A single-row filter toolbar.
 *
 * Filters are a means to the result, not the content of the screen, so they get
 * one compact line and the result summary sits on the same row rather than
 * pushing the records further down the page.
 */
export function FilterBar({
  label,
  summary,
  className,
  children,
}: {
  label: string;
  summary?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="search"
      aria-label={label}
      className={cn('flex flex-wrap items-end gap-2 rounded-lg border p-2', className)}
    >
      {children}
      {summary && (
        <p className="text-muted-foreground ml-auto self-center text-xs" aria-live="polite">
          {summary}
        </p>
      )}
    </div>
  );
}

/**
 * One control inside a {@link FilterBar}.
 *
 * `hideLabel` keeps the accessible name while letting the placeholder carry the
 * visible cue, and `hint` stays available to assistive technology instead of
 * spending a line of the layout on text most users read once.
 */
export type FilterControlProps = { id: string; 'aria-describedby'?: string };

export function FilterField({
  label,
  htmlFor,
  hint,
  hideLabel = false,
  grow = false,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  hideLabel?: boolean;
  grow?: boolean;
  className?: string;
  children: React.ReactNode | ((controlProps: FilterControlProps) => React.ReactNode);
}) {
  const hintId = hint ? `${htmlFor}-description` : undefined;
  const controlProps: FilterControlProps = { id: htmlFor, 'aria-describedby': hintId };
  return (
    <div className={cn('grid gap-1', grow ? 'min-w-56 flex-1' : 'shrink-0', className)}>
      <Label htmlFor={htmlFor} className={cn('text-xs', hideLabel && 'sr-only')}>
        {label}
      </Label>
      {typeof children === 'function' ? children(controlProps) : children}
      {hint && (
        <p id={hintId} className="sr-only">
          {hint}
        </p>
      )}
    </div>
  );
}
