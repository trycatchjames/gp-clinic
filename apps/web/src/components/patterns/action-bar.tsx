import * as React from 'react';
import { CircleAlert, Ellipsis, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type BarAction = {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

export type ActionBarProps = {
  /**
   * Exactly one, by type rather than by convention. Several filled primary actions on one region
   * is the failure mode the interaction contract names, and an array would invite it.
   */
  primary: Omit<BarAction, 'id'> & { busy?: boolean; busyLabel?: string };
  /** Visible, named and quieter. They stay discoverable without competing with the primary. */
  secondary?: readonly BarAction[];
  /**
   * Behind an overflow control. The caller is responsible for never putting a frequent or
   * safety-critical action here — the contract forbids the overflow being the only route to one.
   */
  overflow?: readonly BarAction[];
  overflowLabel?: string;
  /**
   * Why the primary action cannot be taken, named beside it. A disabled control with no reason
   * leaves the operator with nothing to act on.
   */
  blockedReason?: string;
  /** Save state, totals or a consequence note. Sits with the actions, before them in reading order. */
  status?: React.ReactNode;
  label?: string;
  className?: string;
};

/**
 * The action region at the end of a form, a checkout or a completion area.
 *
 * The bar owns priority, order and how the row behaves when it runs out of width. It owns no
 * decision: whether an action is available, permitted or destructive, and every word, stay with the
 * caller.
 */
export function ActionBar({
  primary,
  secondary = [],
  overflow = [],
  overflowLabel = 'More actions',
  blockedReason,
  status,
  label = 'Actions',
  className,
}: ActionBarProps) {
  const reasonId = React.useId();
  const blocked = Boolean(blockedReason);
  const primaryDisabled = primary.disabled || primary.busy || blocked;

  return (
    <section
      aria-label={label}
      className={cn('border-t pt-4', className)}
    >
      {/*
        The reason sits above the row rather than inside it, so it is read before the control it
        explains and does not push the actions out of alignment when it wraps.
      */}
      {blockedReason && (
        <p id={reasonId} className="text-destructive mb-3 flex items-start gap-1.5 text-sm">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {blockedReason}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {status && <div className="min-w-0 flex-1 text-sm">{status}</div>}
        {/*
          The actions stay together and wrap as a unit, so the primary never ends up alone on a line
          away from the choice that avoids it. `ml-auto` only applies once a status shares the row.
        */}
        <div className={cn('flex flex-wrap items-center gap-2', status && 'sm:ml-auto')}>
          {overflow.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={overflowLabel}>
                  <Ellipsis aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {overflow.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    disabled={action.disabled}
                    variant={action.destructive ? 'destructive' : 'default'}
                    onSelect={action.onSelect}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {secondary.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              disabled={action.disabled}
              onClick={action.onSelect}
            >
              {action.label}
            </Button>
          ))}
          <Button
            variant={primary.destructive ? 'destructive' : 'default'}
            disabled={primaryDisabled}
            aria-busy={primary.busy || undefined}
            aria-describedby={blocked ? reasonId : undefined}
            onClick={primary.onSelect}
          >
            {primary.busy && (
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
            )}
            {/* A busy action keeps a name, so a screen reader is not left with a bare spinner. */}
            {primary.busy ? (primary.busyLabel ?? primary.label) : primary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
