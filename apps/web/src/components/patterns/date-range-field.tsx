import * as React from 'react';
import { cn } from '@/lib/utils';
import { DateField } from './date-field';

export type DateBoundaryState = {
  textValue: string;
  selectedDate: string | null;
  open: boolean;
  month: string;
};

export type DateBoundaryCallbacks = {
  onTextValueChange: (value: string) => void;
  onSelectedDateChange: (value: string | null) => void;
  onOpenChange: (open: boolean) => void;
  onMonthChange: (month: string) => void;
};

export type DateRangeFieldProps = {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  startError?: string;
  endError?: string;
  startLabel?: string;
  endLabel?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  today: string;
  minDate?: string;
  maxDate?: string;
  start: DateBoundaryState;
  end: DateBoundaryState;
  startCallbacks: DateBoundaryCallbacks;
  endCallbacks: DateBoundaryCallbacks;
  className?: string;
};

/** A pure inclusive-looking range composition; callers retain all range policy and validation. */
export function DateRangeField({
  label,
  hint,
  error,
  startError,
  endError,
  startLabel = 'Start date',
  endLabel = 'End date',
  required,
  disabled,
  readOnly,
  id,
  today,
  minDate,
  maxDate,
  start,
  end,
  startCallbacks,
  endCallbacks,
  className,
}: DateRangeFieldProps) {
  const generatedId = React.useId();
  const groupId = id ?? generatedId;
  const hintId = hint ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
      className={cn('min-w-0 rounded-md border p-4', error && 'border-destructive', className)}
    >
      <legend className="px-1 text-sm font-medium">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </legend>
      {hint && (
        <p id={hintId} className="mb-4 text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}

      <div className="grid min-w-0 items-start gap-4 md:grid-cols-2">
        <DateField
          id={`${groupId}-start`}
          label={startLabel}
          hint="DD/MM/YYYY"
          error={startError}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          today={today}
          minDate={minDate}
          maxDate={maxDate}
          {...start}
          {...startCallbacks}
        />
        <DateField
          id={`${groupId}-end`}
          label={endLabel}
          hint="DD/MM/YYYY"
          error={endError}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          today={today}
          minDate={minDate}
          maxDate={maxDate}
          {...end}
          {...endCallbacks}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-4 text-xs font-medium text-destructive">
          Error: {error}
        </p>
      )}
    </fieldset>
  );
}
