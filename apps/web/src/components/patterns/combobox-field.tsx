import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Field } from './form-field';

export type ComboboxOption = {
  value: string;
  label: string;
  detail?: string;
  disabled?: boolean;
};

type ComboboxResultState =
  | { status?: 'ready'; statusText?: never }
  | { status: 'loading' | 'empty' | 'failure'; statusText: string };

export type ComboboxFieldProps = ComboboxResultState & {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  query: string;
  value: string | null;
  open: boolean;
  options: readonly ComboboxOption[];
  onQueryChange: (query: string) => void;
  onValueChange: (value: string | null, option?: ComboboxOption) => void;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

/**
 * A controlled editable combobox. Callers own fetching, filtering, result
 * permission and the meaning/persistence of the selected value.
 */
export function ComboboxField({
  label,
  hint,
  error,
  required,
  id,
  placeholder,
  disabled,
  query,
  value,
  open,
  options,
  onQueryChange,
  onValueChange,
  onOpenChange,
  status = 'ready',
  statusText,
  className,
}: ComboboxFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const listboxId = `${controlId}-listbox`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [activeValue, setActiveValue] = React.useState<string | null>(null);

  const enabledOptions = options.filter((option) => !option.disabled);
  const activeOption = enabledOptions.find((option) => option.value === activeValue);
  const activeIndex = activeOption ? options.indexOf(activeOption) : -1;
  const activeOptionId =
    open && status === 'ready' && activeIndex >= 0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  function moveActive(direction: 1 | -1) {
    if (enabledOptions.length === 0) return;
    const currentIndex = enabledOptions.findIndex((option) => option.value === activeValue);
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : enabledOptions.length - 1
        : (currentIndex + direction + enabledOptions.length) % enabledOptions.length;
    setActiveValue(enabledOptions[nextIndex].value);
  }

  function choose(option: ComboboxOption) {
    if (option.disabled) return;
    onValueChange(option.value, option);
    onQueryChange(option.label);
    onOpenChange(false);
    setActiveValue(option.value);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) onOpenChange(true);
      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (open && status === 'ready' && event.key === 'Home') {
      event.preventDefault();
      setActiveValue(enabledOptions[0]?.value ?? null);
      return;
    }

    if (open && status === 'ready' && event.key === 'End') {
      event.preventDefault();
      setActiveValue(enabledOptions.at(-1)?.value ?? null);
      return;
    }

    if (open && status === 'ready' && event.key === 'Enter' && activeOption) {
      event.preventDefault();
      choose(activeOption);
      return;
    }

    if (open && event.key === 'Escape') {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (open && event.key === 'Tab') onOpenChange(false);
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
        <div className="relative">
          <Input
            {...controlProps}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-busy={status === 'loading' || undefined}
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled}
            value={query}
            className="pr-9"
            onClick={() => onOpenChange(true)}
            onFocus={() => {
              if (query) onOpenChange(true);
            }}
            onBlur={() => onOpenChange(false)}
            onChange={(event) => {
              const nextQuery = event.currentTarget.value;
              onQueryChange(nextQuery);
              if (value !== null) onValueChange(null);
              setActiveValue(null);
              onOpenChange(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <ChevronsUpDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          {open && (
            <div
              id={listboxId}
              role="listbox"
              aria-label={`${label} options`}
              className="relative z-50 mt-1 max-h-64 w-full min-w-0 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {status === 'loading' && (
                <p role="option" aria-selected="false" aria-disabled="true" className="px-3 py-2 text-sm text-muted-foreground">
                  {statusText}
                </p>
              )}
              {status === 'empty' && (
                <p role="option" aria-selected="false" aria-disabled="true" className="px-3 py-2 text-sm text-muted-foreground">
                  {statusText}
                </p>
              )}
              {status === 'failure' && (
                <p role="option" aria-selected="false" aria-disabled="true" className="border-l-2 border-destructive px-3 py-2 text-sm">
                  {statusText}
                </p>
              )}
              {status === 'ready' &&
                options.map((option, index) => {
                  const selected = option.value === value;
                  const active = option.value === activeValue;
                  return (
                    <div
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={option.disabled || undefined}
                      data-active={active || undefined}
                      className={cn(
                        'relative flex min-h-9 cursor-default items-start gap-2 rounded-sm border-l-2 border-transparent py-2 pr-8 pl-2 text-sm outline-none',
                        'data-[active=true]:bg-accent data-[active=true]:outline data-[active=true]:outline-2 data-[active=true]:outline-ring',
                        selected && 'border-l-primary font-medium',
                        option.disabled && 'pointer-events-none opacity-50',
                      )}
                      onMouseMove={() => {
                        if (!option.disabled) setActiveValue(option.value);
                      }}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(option)}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block break-words">{option.label}</span>
                        {option.detail && (
                          <span className="mt-0.5 block break-words text-xs font-normal text-muted-foreground">
                            {option.detail}
                          </span>
                        )}
                      </span>
                      {selected && (
                        <Check
                          aria-hidden="true"
                          className="absolute top-2.5 right-2 size-4 shrink-0 text-primary"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          {open && status === 'loading' && <p role="status" className="sr-only">{statusText}</p>}
          {open && status === 'empty' && <p role="status" className="sr-only">{statusText}</p>}
          {open && status === 'failure' && <p role="alert" className="sr-only">{statusText}</p>}
        </div>
      )}
    </Field>
  );
}
