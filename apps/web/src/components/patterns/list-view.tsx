import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type ListViewProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  /** Accessible name for the list. Required: a bare list of rows is ambiguous. */
  label: string;
  selectedKey?: string | null;
  onSelect?: (item: T) => void;
  density?: 'compact' | 'comfortable';
  className?: string;
};

/**
 * A dense, keyboard-navigable list of selectable records.
 *
 * Rows are buttons rather than `role="option"`: selecting a record here is an
 * action with consequences, not a form value, and `aria-pressed` reports the
 * current choice without implying the list is a combobox popup.
 *
 * Selection is never signalled by colour alone — the chosen row also carries a
 * tick and an accent rule — and arrow keys move focus without selecting, so
 * reaching a record can never open it by accident.
 */
export function ListView<T>({
  items,
  getKey,
  renderItem,
  label,
  selectedKey = null,
  onSelect,
  density = 'compact',
  className,
}: ListViewProps<T>) {
  const rowRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  function focusRow(index: number) {
    const bounded = Math.max(0, Math.min(index, items.length - 1));
    rowRefs.current[bounded]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    focusRow(next);
  }

  return (
    <ul aria-label={label} className={cn('divide-y rounded-lg border', className)}>
      {items.map((item, index) => {
        const key = getKey(item);
        const isSelected = key === selectedKey;
        return (
          <li key={key}>
            <button
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect?.(item)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                'hover:bg-accent/60 focus-visible:ring-ring relative w-full text-left transition-colors focus-visible:ring-3 focus-visible:outline-none',
                'first:rounded-t-lg last:rounded-b-lg',
                density === 'compact' ? 'px-3 py-2' : 'px-4 py-3',
                isSelected && 'bg-accent/40 before:bg-primary before:absolute before:inset-y-0 before:left-0 before:w-1',
              )}
            >
              <span className="flex items-start gap-2">
                <span className="min-w-0 flex-1">{renderItem(item)}</span>
                {isSelected && (
                  <>
                    <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only">Selected</span>
                  </>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type ListViewRowProps = {
  title: React.ReactNode;
  badges?: React.ReactNode;
  /** Short secondary facts, rendered on one line and separated by a middot. */
  meta?: readonly React.ReactNode[];
  trailing?: React.ReactNode;
  footnote?: React.ReactNode;
};

/**
 * The dense row layout used inside {@link ListView}: one identity line, one
 * line of supporting facts, and an optional footnote. Keeping records to two
 * lines is what lets a full result set stay on screen without scrolling.
 */
export function ListViewRow({ title, badges, meta, trailing, footnote }: ListViewRowProps) {
  const facts = (meta ?? []).filter(Boolean);
  return (
    <span className="flex items-start justify-between gap-3">
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium">{title}</span>
          {badges}
        </span>
        {facts.length > 0 && (
          <span className="text-muted-foreground block truncate text-xs">
            {facts.map((fact, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span aria-hidden="true"> · </span>}
                {fact}
              </React.Fragment>
            ))}
          </span>
        )}
        {footnote && <span className="text-muted-foreground block text-xs">{footnote}</span>}
      </span>
      {trailing && (
        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{trailing}</span>
      )}
    </span>
  );
}
