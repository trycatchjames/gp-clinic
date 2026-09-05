import * as React from 'react';
import type { ComboboxOption } from './combobox-field';
import { ComboboxField } from './combobox-field';

export type TimeFieldOption = ComboboxOption;

type TimeResultState =
  | { status?: 'ready'; statusText?: never }
  | { status: 'loading' | 'empty' | 'failure'; statusText: string };

export type TimeFieldProps = TimeResultState & {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  hourCycle: 'h12' | 'h23';
  timeZoneLabel: string;
  query: string;
  value: string | null;
  open: boolean;
  options: readonly TimeFieldOption[];
  onQueryChange: (query: string) => void;
  onValueChange: (value: string | null, option?: TimeFieldOption) => void;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

/**
 * A controlled local-time combobox. Callers supply canonical values and
 * configured display labels; this composition keeps clock and timezone context visible.
 */
export function TimeField({
  label,
  hint,
  error,
  required,
  id,
  disabled,
  hourCycle,
  timeZoneLabel,
  query,
  value,
  open,
  options,
  onQueryChange,
  onValueChange,
  onOpenChange,
  className,
  status = 'ready',
  statusText,
}: TimeFieldProps) {
  const clockLabel = hourCycle === 'h12' ? '12-hour time' : '24-hour time';
  const context = (
    <span className="grid gap-0.5">
      {hint && <span>{hint}</span>}
      <span>
        {clockLabel} · Timezone: {timeZoneLabel}
      </span>
    </span>
  );
  const commonProps = {
    label,
    hint: context,
    error,
    required,
    id,
    disabled,
    placeholder: hourCycle === 'h12' ? 'e.g. 9:30 am' : 'e.g. 09:30',
    query,
    value,
    open,
    options,
    onQueryChange,
    onValueChange,
    onOpenChange,
    className,
  };

  if (status === 'ready') return <ComboboxField {...commonProps} />;
  return <ComboboxField {...commonProps} status={status} statusText={statusText ?? ''} />;
}
