import * as React from 'react';
import {
  CheckCircle2,
  FileText,
  LoaderCircle,
  RotateCcw,
  TriangleAlert,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Field } from './form-field';

export type FileInputItemState = 'selected' | 'uploading' | 'failed' | 'complete' | 'rejected';

export type FileInputItem = {
  id: string;
  name: string;
  sizeLabel?: string;
  state: FileInputItemState;
  statusText: string;
  removable?: boolean;
  retryable?: boolean;
};

export type FileInputFieldProps = {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  id?: string;
  accept?: string;
  capture?: boolean | 'user' | 'environment';
  multiple?: boolean;
  disabled?: boolean;
  items: readonly FileInputItem[];
  onFilesSelected: (files: readonly File[]) => void;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
};

const stateIcons = {
  selected: FileText,
  uploading: LoaderCircle,
  failed: TriangleAlert,
  complete: CheckCircle2,
  rejected: TriangleAlert,
} satisfies Record<FileInputItemState, typeof FileText>;

/** A controlled file chooser/drop target. It never reads or interprets selected file content. */
export function FileInputField({
  label,
  hint,
  error,
  required,
  id,
  accept,
  capture,
  multiple,
  disabled,
  items,
  onFilesSelected,
  onRemove,
  onRetry,
  className,
}: FileInputFieldProps) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const chooseLabel = multiple ? 'Choose files' : 'Choose file';

  function emitFiles(files: FileList | readonly File[] | null) {
    if (disabled || !files || files.length === 0) return;
    onFilesSelected(Array.from(files));
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
        <div className="grid min-w-0 gap-3">
          <input
            {...controlProps}
            ref={inputRef}
            type="file"
            tabIndex={-1}
            accept={accept}
            capture={capture}
            multiple={multiple}
            disabled={disabled}
            className="sr-only"
            onChange={(event) => {
              emitFiles(event.currentTarget.files);
              event.currentTarget.value = '';
            }}
          />

          <div
            role="group"
            aria-label={`Drop files for ${label}`}
            data-drag-active={dragActive || undefined}
            className={cn(
              'grid min-w-0 justify-items-start gap-2 rounded-md border border-dashed p-4 transition-colors',
              'data-[drag-active=true]:border-primary data-[drag-active=true]:bg-accent',
              disabled && 'bg-muted/40 opacity-60',
            )}
            onDragEnter={(event) => {
              event.preventDefault();
              if (!disabled) setDragActive(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDragActive(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              emitFiles(event.dataTransfer.files);
            }}
          >
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-describedby={controlProps['aria-describedby']}
              onClick={() => inputRef.current?.click()}
            >
              <Upload aria-hidden="true" />
              {chooseLabel}
            </Button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {multiple ? 'Choose files or drop them here.' : 'Choose a file or drop it here.'}
            </p>
          </div>

          {items.length > 0 && (
            <ul aria-label={`${label} files`} aria-live="polite" className="grid min-w-0 gap-2">
              {items.map((item) => {
                const StateIcon = stateIcons[item.state];
                const failed = item.state === 'failed' || item.state === 'rejected';
                return (
                  <li
                    key={item.id}
                    data-state={item.state}
                    aria-busy={item.state === 'uploading' || undefined}
                    className={cn(
                      'flex min-w-0 flex-wrap items-start gap-3 rounded-md border p-3',
                      failed && 'border-destructive/60',
                    )}
                  >
                    <StateIcon
                      aria-hidden="true"
                      className={cn(
                        'mt-0.5 size-4 shrink-0 text-muted-foreground',
                        item.state === 'uploading' && 'motion-safe:animate-spin',
                        failed && 'text-destructive',
                        item.state === 'complete' && 'text-success',
                      )}
                    />
                    <span className="min-w-40 flex-1">
                      <span className="block break-all text-sm font-medium">{item.name}</span>
                      {item.sizeLabel && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.sizeLabel}
                        </span>
                      )}
                      <span
                        className={cn(
                          'mt-1 block text-xs leading-relaxed',
                          failed ? 'font-medium text-destructive' : 'text-muted-foreground',
                        )}
                      >
                        {item.statusText}
                      </span>
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {item.retryable && onRetry && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onRetry(item.id)}
                        >
                          <RotateCcw aria-hidden="true" />
                          Retry
                        </Button>
                      )}
                      {item.removable && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => onRemove(item.id)}
                        >
                          <X aria-hidden="true" />
                          Remove
                        </Button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Field>
  );
}
