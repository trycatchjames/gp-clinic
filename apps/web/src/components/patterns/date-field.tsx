import * as React from 'react';
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { enAU } from 'date-fns/locale';
import { CalendarDays, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Field } from './form-field';

export type DateFieldProps = {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  textValue: string;
  selectedDate: string | null;
  open: boolean;
  month: string;
  today: string;
  minDate?: string;
  maxDate?: string;
  onTextValueChange: (value: string) => void;
  onSelectedDateChange: (value: string | null) => void;
  onOpenChange: (open: boolean) => void;
  onMonthChange: (month: string) => void;
  className?: string;
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return format(date, 'yyyy-MM-dd') === value ? date : null;
}

function parseMonth(value: string): Date {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return startOfMonth(new Date(2000, 0, 1));
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return format(date, 'yyyy-MM') === value ? date : startOfMonth(new Date(2000, 0, 1));
}

function isAvailable(value: string, minDate?: string, maxDate?: string) {
  return (!minDate || value >= minDate) && (!maxDate || value <= maxDate);
}

/**
 * A controlled Australian date field. It preserves raw text and emits date-only
 * ISO values only when a user explicitly chooses a calendar day.
 */
export function DateField({
  label,
  hint = 'Use DD/MM/YYYY or choose a date.',
  error,
  required,
  id,
  disabled,
  readOnly,
  textValue,
  selectedDate,
  open,
  month,
  today,
  minDate,
  maxDate,
  onTextValueChange,
  onSelectedDateChange,
  onOpenChange,
  onMonthChange,
  className,
}: DateFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const calendarId = `${controlId}-calendar`;
  const calendarLabelId = `${calendarId}-label`;
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = React.useRef<string | null>(null);
  const visibleMonth = parseMonth(month);
  const monthValue = format(visibleMonth, 'yyyy-MM');
  const parsedSelected = selectedDate ? parseDateOnly(selectedDate) : null;
  const parsedToday = parseDateOnly(today);
  const firstGridDate = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const gridDates = Array.from({ length: 42 }, (_, index) => addDays(firstGridDate, index));
  const visibleDates = gridDates.filter((date) => format(date, 'yyyy-MM') === monthValue);
  const availableDates = visibleDates.filter((date) =>
    isAvailable(format(date, 'yyyy-MM-dd'), minDate, maxDate),
  );

  const initialFocusValue =
    parsedSelected &&
    format(parsedSelected, 'yyyy-MM') === monthValue &&
    isAvailable(selectedDate!, minDate, maxDate)
      ? selectedDate!
      : parsedToday &&
          format(parsedToday, 'yyyy-MM') === monthValue &&
          isAvailable(today, minDate, maxDate)
        ? today
        : availableDates[0]
          ? format(availableDates[0], 'yyyy-MM-dd')
          : null;

  const [focusedDate, setFocusedDate] = React.useState<string | null>(initialFocusValue);

  React.useLayoutEffect(() => {
    if (!open) return;
    const target = pendingFocus.current ?? initialFocusValue;
    pendingFocus.current = null;
    if (!target) return;
    setFocusedDate(target);
    dayRefs.current.get(target)?.focus();
  }, [initialFocusValue, month, open]); // The controlled month is the calendar's focus boundary.

  function closeAndReturnFocus() {
    onOpenChange(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function openCalendar() {
    if (disabled || readOnly) return;
    pendingFocus.current = initialFocusValue;
    onOpenChange(true);
  }

  function moveFocus(target: Date) {
    const iso = format(target, 'yyyy-MM-dd');
    if (!isAvailable(iso, minDate, maxDate)) return;
    const targetMonth = format(target, 'yyyy-MM');
    pendingFocus.current = iso;
    setFocusedDate(iso);
    if (targetMonth !== monthValue) onMonthChange(targetMonth);
    else dayRefs.current.get(iso)?.focus();
  }

  function chooseDate(iso: string) {
    if (!isAvailable(iso, minDate, maxDate)) return;
    onSelectedDateChange(iso);
    onTextValueChange(formatDate(iso));
    closeAndReturnFocus();
  }

  function handleDayKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, date: Date) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseDate(format(date, 'yyyy-MM-dd'));
      return;
    }
    let target: Date | null = null;
    if (event.key === 'ArrowLeft') target = addDays(date, -1);
    if (event.key === 'ArrowRight') target = addDays(date, 1);
    if (event.key === 'ArrowUp') target = addDays(date, -7);
    if (event.key === 'ArrowDown') target = addDays(date, 7);
    if (event.key === 'Home') target = startOfWeek(date, { weekStartsOn: 1 });
    if (event.key === 'End') target = endOfWeek(date, { weekStartsOn: 1 });
    if (event.key === 'PageUp') target = addMonths(date, -1);
    if (event.key === 'PageDown') target = addMonths(date, 1);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndReturnFocus();
      return;
    }
    if (target) {
      event.preventDefault();
      moveFocus(target);
    }
  }

  function changeMonth(offset: -1 | 1) {
    onMonthChange(format(addMonths(visibleMonth, offset), 'yyyy-MM'));
  }

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
        <div
          ref={wrapperRef}
          className="relative min-w-0"
          onBlur={(event) => {
            if (open && !event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
          }}
        >
          <div className="flex min-w-0 flex-wrap gap-2">
            <Input
              {...controlProps}
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="DD/MM/YYYY"
              disabled={disabled}
              readOnly={readOnly}
              value={textValue}
              className="min-w-44 flex-1"
              onChange={(event) => {
                onTextValueChange(event.currentTarget.value);
                if (selectedDate !== null) onSelectedDateChange(null);
              }}
              onKeyDown={(event) => {
                if (event.altKey && event.key === 'ArrowDown') {
                  event.preventDefault();
                  openCalendar();
                }
                if (event.key === 'Escape' && open) {
                  event.preventDefault();
                  closeAndReturnFocus();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              aria-label={`Choose ${label} from calendar`}
              aria-expanded={open}
              aria-controls={calendarId}
              disabled={disabled || readOnly}
              onClick={() => (open ? closeAndReturnFocus() : openCalendar())}
              onKeyDown={(event) => {
                if (event.altKey && event.key === 'ArrowDown') {
                  event.preventDefault();
                  openCalendar();
                }
                if (event.key === 'Escape' && open) {
                  event.preventDefault();
                  closeAndReturnFocus();
                }
              }}
            >
              <CalendarDays aria-hidden="true" />
              Choose date
            </Button>
          </div>

          {open && !disabled && !readOnly && (
            <div
              id={calendarId}
              role="dialog"
              aria-modal="false"
              aria-labelledby={calendarLabelId}
              className="relative z-50 mt-2 w-full min-w-72 max-w-80 rounded-md border bg-popover p-3 text-popover-foreground shadow-md md:absolute"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Previous month"
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </Button>
                <h2 id={calendarLabelId} aria-live="polite" className="text-sm font-semibold">
                  {format(visibleMonth, 'MMMM yyyy', { locale: enAU })}
                </h2>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Next month"
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </Button>
              </div>

              <div role="grid" aria-labelledby={calendarLabelId} className="grid grid-cols-7 gap-1">
                <div role="row" className="contents">
                  {weekdays.map((weekday) => (
                    <div
                      key={weekday}
                      role="columnheader"
                      aria-label={weekday}
                      className="py-1 text-center text-xs font-medium text-muted-foreground"
                    >
                      {weekday.slice(0, 2)}
                    </div>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, weekIndex) => (
                  <div key={weekIndex} role="row" className="contents">
                    {gridDates.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
                  const iso = format(date, 'yyyy-MM-dd');
                  const inMonth = format(date, 'yyyy-MM') === monthValue;
                  if (!inMonth) {
                    return <div key={iso} role="gridcell" aria-disabled="true" className="size-9" />;
                  }
                  const available = isAvailable(iso, minDate, maxDate);
                  const selected = iso === selectedDate;
                  const isToday = iso === today;
                  const tabIndex = available && iso === focusedDate ? 0 : -1;
                      return (
                    <div
                      key={iso}
                      role="gridcell"
                      aria-selected={selected}
                      aria-disabled={!available || undefined}
                      className="size-9"
                    >
                      <button
                        ref={(element) => {
                          if (element) dayRefs.current.set(iso, element);
                          else dayRefs.current.delete(iso);
                        }}
                        type="button"
                        tabIndex={tabIndex}
                        disabled={!available}
                        aria-label={format(date, 'EEEE d MMMM yyyy', { locale: enAU })}
                        aria-current={isToday ? 'date' : undefined}
                        data-selected={selected || undefined}
                        data-today={isToday || undefined}
                        className={cn(
                          'relative flex size-9 items-center justify-center rounded-md border border-transparent text-sm outline-none',
                          'hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                          'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:line-through disabled:opacity-55',
                          'data-[today=true]:border-muted-foreground data-[today=true]:font-semibold',
                          'data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:font-bold data-[selected=true]:text-primary-foreground',
                        )}
                        onFocus={() => setFocusedDate(iso)}
                        onClick={() => chooseDate(iso)}
                        onKeyDown={(event) => handleDayKeyDown(event, date)}
                      >
                        {format(date, 'd')}
                        {selected && (
                          <Check
                            aria-hidden="true"
                            className="absolute right-0.5 bottom-0.5 size-2.5"
                          />
                        )}
                      </button>
                    </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Field>
  );
}
