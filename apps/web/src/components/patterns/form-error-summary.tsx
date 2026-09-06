import * as React from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FormError = {
  /** The id of the control to move to. Must match the id the Field gave that control. */
  fieldId: string;
  /** The control's visible label, so the entry is recognisable away from its section. */
  label: string;
  message: string;
  /** The region the field belongs to, for a form long enough that the label alone is not a place. */
  section?: string;
};

export type FormErrorSummaryProps = {
  errors: readonly FormError[];
  /**
   * The submit attempt this summary reports. Changing it moves focus to the summary, so a second
   * submit that fails the same way is not silently ignored. Focus is never moved on first render
   * of an unchanged attempt.
   */
  attempt?: number;
  title?: string;
  className?: string;
};

function describe(count: number) {
  return count === 1
    ? 'There is 1 problem to correct before this can be saved'
    : `There are ${count} problems to correct before this can be saved`;
}

/**
 * Lists every field that needs correcting and moves the operator to it.
 *
 * The per-field error still lives with its control; this is the summary the interaction contract
 * asks for once more than one field or region is affected, because a long registration form can
 * hide an error in a section that is scrolled out of view. Nothing here decides validity: the
 * caller owns the rules, the messages and which attempt failed.
 */
export function FormErrorSummary({ errors, attempt, title, className }: FormErrorSummaryProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const announced = React.useRef<number | undefined>(undefined);
  const titleId = React.useId();

  React.useEffect(() => {
    if (attempt === undefined || errors.length === 0) return;
    if (announced.current === attempt) return;
    announced.current = attempt;
    // Focus lands on the summary rather than on the first field: the operator gets the count and
    // the whole list before being dropped into one control, and can choose where to start.
    container.current?.focus();
  }, [attempt, errors.length]);

  if (errors.length === 0) return null;

  function moveTo(fieldId: string) {
    const target = document.getElementById(fieldId);
    if (!target) return;
    target.focus();
    target.scrollIntoView({ block: 'center', behavior: 'auto' });
  }

  return (
    <div
      ref={container}
      tabIndex={-1}
      // Announced exactly once either way. A caller that manages the attempt gets focus moved here,
      // and focus reads the summary on its own; a caller that does not gets a live region instead.
      // Doing both would read the whole list twice.
      role={attempt === undefined ? 'alert' : 'group'}
      aria-labelledby={titleId}
      className={cn(
        'border-destructive/40 bg-destructive/5 focus-visible:ring-ring rounded-md border p-4 outline-hidden focus-visible:ring-[3px]',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <CircleAlert aria-hidden="true" className="text-destructive mt-0.5 size-4 shrink-0" />
        <h2 id={titleId} className="text-sm font-semibold">
          {title ?? describe(errors.length)}
        </h2>
      </div>
      <ul className="mt-3 grid gap-2 pl-6">
        {errors.map((error) => (
          <li key={error.fieldId} className="text-sm">
            <a
              href={`#${error.fieldId}`}
              className="text-destructive font-medium underline underline-offset-4"
              onClick={(event) => {
                // A same-page href would be honest on its own, but the router owns the address bar
                // and a fragment change here should not read as navigation.
                event.preventDefault();
                moveTo(error.fieldId);
              }}
            >
              {error.section ? `${error.section}: ${error.label}` : error.label}
            </a>
            <span className="text-muted-foreground"> — {error.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
