import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Field } from './form-field';

/**
 * A visible unit must also be spoken, so it is never carried by the adornment alone. Requiring the
 * spoken form alongside the symbol keeps that impossible to forget.
 */
type NumericFieldUnit =
  | { prefix: string; suffix?: never; unitLabel: string }
  | { suffix: string; prefix?: never; unitLabel: string }
  | { prefix?: never; suffix?: never; unitLabel?: never };

export type NumericFieldProps = NumericFieldUnit & {
  label: string;
  /** Exactly what the operator typed. Never rewritten while they are typing. */
  text: string;
  onTextChange: (text: string) => void;
  /**
   * The accepted value as a whole number of the smallest unit this field allows: cents at two
   * decimal places, tenths at one, whole units at none. Integers keep money and measurements out of
   * binary floating point. `null` while the text does not describe such a value.
   */
  onValueChange: (value: number | null) => void;
  /** Digits permitted after the decimal point. Two for Australian dollars. */
  decimals?: number;
  /** A credit and a charge are different facts, so a negative value is refused unless allowed. */
  allowNegative?: boolean;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  className?: string;
};

/**
 * Reads entry text as a whole number of the smallest permitted unit.
 *
 * Anything the pattern is not certain about — a stray character, more precision than the unit
 * carries, a minus sign where none is allowed — returns null rather than a nearby number. The text
 * stays as the operator typed it, so the original entry is still there to correct.
 */
export function parseNumericEntry(
  text: string,
  { decimals = 0, allowNegative = false }: { decimals?: number; allowNegative?: boolean } = {},
): number | null {
  // Grouping separators and spaces are accepted on the way in; they are never written back.
  const cleaned = text.replace(/[\s,]/g, '');
  if (cleaned === '') return null;

  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(cleaned);
  if (!match) return null;

  const [, sign, whole, fraction = ''] = match;
  if (whole === '' && fraction === '') return null;
  if (sign === '-' && !allowNegative) return null;
  if (fraction.length > decimals) return null;

  const scaled = Number(`${whole || '0'}${fraction.padEnd(decimals, '0')}`);
  if (!Number.isSafeInteger(scaled)) return null;
  return sign === '-' ? -scaled : scaled;
}

/** Writes an accepted value back as plain, ungrouped text the operator can keep editing. */
export function formatNumericEntry(value: number, decimals = 0): string {
  const sign = value < 0 ? '-' : '';
  const digits = String(Math.abs(value)).padStart(decimals + 1, '0');
  if (decimals === 0) return `${sign}${digits}`;
  return `${sign}${digits.slice(0, -decimals)}.${digits.slice(-decimals)}`;
}

/**
 * A controlled numeric entry for fees, adjustments, quantities and measurements.
 *
 * It decides nothing about the number: no limit, no threshold, no arithmetic and no meaning. Its
 * whole job is to hand the caller either a whole number of the smallest unit or nothing at all,
 * while keeping what the operator typed intact.
 */
export function NumericField({
  label,
  text,
  onTextChange,
  onValueChange,
  decimals = 0,
  allowNegative = false,
  prefix,
  suffix,
  unitLabel,
  hint,
  error,
  required,
  disabled,
  readOnly,
  id,
  className,
}: NumericFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const unitId = `${controlId}-unit`;

  const commit = (next: string) => {
    onTextChange(next);
    onValueChange(parseNumericEntry(next, { decimals, allowNegative }));
  };

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={controlId}
      className={className}
    >
      {(controlProps) => (
        <div className="relative">
          {unitLabel && (
            <span id={unitId} className="sr-only">
              {unitLabel}
            </span>
          )}
          {prefix && (
            <span
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm"
            >
              {prefix}
            </span>
          )}
          <Input
            {...controlProps}
            // `type="number"` brings a spinner that mutates on scroll and arrow keys, and silently
            // drops characters it dislikes. Neither is acceptable beside money.
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            disabled={disabled}
            readOnly={readOnly}
            aria-describedby={[controlProps['aria-describedby'], unitLabel ? unitId : undefined]
              .filter(Boolean)
              .join(' ')}
            className="text-right tabular-nums"
            /*
              The adornments sit inside the control, so the entry has to be padded clear of them.
              `ch` is measured in the same font the adornment renders in, and the extra rem is the
              gap; a proportional word is narrower than its character count, so this always leaves
              room rather than running the amount into its unit.
            */
            style={{
              paddingLeft: prefix ? `calc(1.5rem + ${prefix.length}ch)` : undefined,
              paddingRight: suffix ? `calc(1.5rem + ${suffix.length}ch)` : undefined,
            }}
            onChange={(event) => commit(event.target.value)}
            onBlur={() => {
              // Canonical text is written only once the operator has left a field that already
              // parses. Rewriting mid-edit moves the caret out from under them.
              const value = parseNumericEntry(text, { decimals, allowNegative });
              if (value === null) return;
              const canonical = formatNumericEntry(value, decimals);
              if (canonical !== text) onTextChange(canonical);
            }}
          />
          {suffix && (
            <span
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm"
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </Field>
  );
}
