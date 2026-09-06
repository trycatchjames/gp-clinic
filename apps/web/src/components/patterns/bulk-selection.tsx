import * as React from 'react';
import { Ban, CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export type SelectionCheckboxProps = {
  /**
   * What this control selects, in the operator's words: a record, or a group such as
   * "all 10 results on this page". The component supplies the verb so every control in a queue is
   * named the same way.
   */
  name: string;
  checked: boolean | 'indeterminate';
  onCheckedChange: (checked: boolean) => void;
  /** Why this record cannot be included. Disables the control and describes it. */
  blockedReason?: string;
  className?: string;
};

/**
 * One selection control, for a record or for a group of them.
 *
 * It decides nothing: whether a record may be selected, and why not, are the caller's.
 */
export function SelectionCheckbox({
  name,
  checked,
  onCheckedChange,
  blockedReason,
  className,
}: SelectionCheckboxProps) {
  const reasonId = React.useId();

  return (
    <span className={cn('flex items-center gap-1.5', className)}>
      <Checkbox
        // The checkbox itself is 16px. The pseudo-element carries the pointer target out to 24px
        // without changing the mark's size or the row's density.
        className="relative before:absolute before:-inset-1 before:content-['']"
        aria-label={`Select ${name}`}
        aria-describedby={blockedReason ? reasonId : undefined}
        checked={checked}
        disabled={Boolean(blockedReason)}
        onCheckedChange={(next) => onCheckedChange(next === true)}
      />
      {blockedReason && (
        <>
          {/*
            Disabled styling alone is a colour cue. The mark says "excluded" without it, and the
            reason travels with the control rather than living only in the row beside it.
          */}
          <Ban aria-hidden="true" className="text-muted-foreground size-3.5 shrink-0" />
          <span id={reasonId} className="sr-only">
            {blockedReason}
          </span>
        </>
      )}
    </span>
  );
}

export type BulkSelectionAction = {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  /** Why this action cannot be applied to the current selection, named beside it. */
  blockedReason?: string;
};

export type BulkSelectionBarProps = {
  /** Every selected record, including those on a page the operator cannot currently see. */
  selectedCount: number;
  /** Singular and plural noun for what is being counted. */
  noun: readonly [string, string];
  onClear: () => void;
  /** How many of the selected records are not among the rows now on screen. */
  offPageCount?: number;
  /** Escalation from the visible page to the whole matching set. */
  selectAll?: { label: string; onSelect: () => void };
  /** Rows the operator can see but cannot include, and the single reason they share. */
  excluded?: { count: number; reason: string };
  actions?: readonly BulkSelectionAction[];
  label?: string;
  className?: string;
};

/**
 * The region that says what is selected and offers what may be done with it.
 *
 * It never mutates. An action reports that the operator chose it; what that action would do, and
 * then what it did, belong to `ItemisedOutcome`.
 */
export function BulkSelectionBar({
  selectedCount,
  noun,
  onClear,
  offPageCount = 0,
  selectAll,
  excluded,
  actions = [],
  label = 'Selection',
  className,
}: BulkSelectionBarProps) {
  const reasonId = React.useId();
  const [singular, plural] = noun;
  const none = selectedCount === 0;

  return (
    /*
      The bar stays in normal flow and keeps its shape when nothing is selected. A bar that appears
      on the first tick shifts every row beneath it, and one that floats over the queue hides rows
      at exactly the width where there are fewest of them.
    */
    <section
      aria-label={label}
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border px-3 py-2',
        none ? 'bg-muted/40' : 'border-primary/35 bg-accent',
        className,
      )}
    >
      <p role="status" className="text-sm tabular-nums">
        {none ? (
          <span className="text-muted-foreground">No {plural} selected</span>
        ) : (
          <>
            <span className="font-medium">
              {selectedCount} {selectedCount === 1 ? singular : plural} selected
            </span>
            {/*
              A selection reaching past the visible rows must say so. Otherwise the count reads as
              "what I can see", and the operator commits to records they never looked at.
            */}
            {offPageCount > 0 && (
              <span className="text-muted-foreground">
                {' '}
                · {offPageCount} not on this page
              </span>
            )}
          </>
        )}
      </p>

      {excluded && excluded.count > 0 && (
        <p className="text-muted-foreground flex items-start gap-1.5 text-sm">
          <Ban aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>
            {excluded.count} {excluded.count === 1 ? singular : plural} on this page cannot be
            included: {excluded.reason}
          </span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {selectAll && !none && (
          <Button variant="link" size="sm" className="px-0" onClick={selectAll.onSelect}>
            {selectAll.label}
          </Button>
        )}
        {/*
          Clearing is the one control that never unmounts. If it disappeared with the last selection
          it would take the operator's focus with it, dropping them at the top of the document
          immediately after a deliberate keyboard action.
        */}
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear selection
        </Button>
        {/*
          The actions over the records are withheld until there are records, so nothing offers to
          act on an empty selection.
        */}
        {!none &&
          actions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant={action.destructive ? 'destructive' : 'default'}
              disabled={Boolean(action.blockedReason)}
              aria-describedby={action.blockedReason ? `${reasonId}-${action.id}` : undefined}
              onClick={action.onSelect}
            >
              {action.label}
            </Button>
          ))}
      </div>

      {!none &&
        actions
          .filter((action) => action.blockedReason)
          .map((action) => (
            <p
              key={action.id}
              id={`${reasonId}-${action.id}`}
              className="text-destructive flex w-full items-start gap-1.5 text-sm"
            >
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                {action.label}: {action.blockedReason}
              </span>
            </p>
          ))}
    </section>
  );
}
