import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type FieldControlProps = {
  id: string;
  'aria-describedby'?: string;
  'aria-errormessage'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
};

type FieldProps = {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode | ((controlProps: FieldControlProps) => React.ReactNode);
};

type AccessibleChildProps = Partial<FieldControlProps>;

function joinIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(' ');
  return value || undefined;
}

/**
 * A pure form composition that keeps the visible label, supporting description,
 * and validation error connected to its control. Use the render-prop form when
 * the accessible control is nested inside another primitive such as Select.
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
}: FieldProps) {
  const generatedId = React.useId();
  const controlId = htmlFor ?? generatedId;
  const descriptionId = hint ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const controlProps: FieldControlProps = {
    id: controlId,
    'aria-describedby': joinIds(descriptionId, errorId),
    'aria-errormessage': errorId,
    'aria-invalid': error ? true : undefined,
    'aria-required': required ? true : undefined,
  };

  let control: React.ReactNode;
  if (typeof children === 'function') {
    control = children(controlProps);
  } else if (htmlFor && React.isValidElement<AccessibleChildProps>(children)) {
    const childProps = children.props;
    control = React.cloneElement(children, {
      ...controlProps,
      id: childProps.id ?? controlProps.id,
      'aria-describedby': joinIds(childProps['aria-describedby'], controlProps['aria-describedby']),
      'aria-errormessage': childProps['aria-errormessage'] ?? controlProps['aria-errormessage'],
      'aria-invalid': childProps['aria-invalid'] ?? controlProps['aria-invalid'],
      'aria-required': childProps['aria-required'] ?? controlProps['aria-required'],
    });
  } else {
    control = children;
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={controlId}>
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-destructive">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </Label>
      {control}
      {hint && (
        <p id={descriptionId} className="text-muted-foreground text-xs leading-relaxed">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-xs font-medium">
          Error: {error}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({
  columns = 2,
  className,
  children,
}: {
  columns?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
