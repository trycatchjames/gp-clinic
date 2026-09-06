import { CircleCheck, CloudOff, GitCompareArrows, LoaderCircle, PencilLine, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export type SaveStateAction = { label: string; onSelect: () => void };

/**
 * The states are deliberately six rather than a saved/unsaved pair. Work that is only held on this
 * device, work whose save failed and work that another author has overtaken all differ in what the
 * operator must do next, and the design-system invariant is that they must not be made to look
 * equivalent.
 */
export type SaveStateValue =
  /** Edited since the last durable save. Nothing has been sent. */
  | { kind: 'unsaved' }
  /** A save is in flight. The outcome is not yet known. */
  | { kind: 'saving' }
  /** Durably committed. This is the only wording allowed to say "saved". */
  | { kind: 'saved'; at: string | number | Date }
  /** Recovered or held locally. Not on the record, however recent it looks. */
  | { kind: 'local'; at: string | number | Date }
  /** The save failed and the entered text is still here. */
  | { kind: 'failed'; reason: string; retry?: SaveStateAction }
  /** Another author committed a newer version; no free-text merge is attempted. */
  | { kind: 'conflict'; reason: string; reconcile?: SaveStateAction };

export type SaveStateProps = {
  value: SaveStateValue;
  /** Required for any instant, per the shared display-formatting contract. */
  timeZone: string;
  /** Names what is being saved, so the state is not ambiguous among several editors. */
  label?: string;
  className?: string;
};

type Presentation = {
  icon: typeof CircleCheck;
  /** The state itself, in the tone's colour. Short enough to scan in a dense header. */
  text: string;
  /** The caller's reason, in ordinary text. A whole sentence in red is harder to read, not louder. */
  detail?: string;
  /** What assistive technology hears. Never abbreviated the way the visible text may be. */
  announcement: string;
  frame: string;
  mark: string;
  spin?: boolean;
};

function presentation(value: SaveStateValue, timeZone: string, subject: string): Presentation {
  switch (value.kind) {
    case 'unsaved':
      return {
        icon: PencilLine,
        text: 'Unsaved changes',
        announcement: `${subject} has unsaved changes.`,
        frame: 'text-muted-foreground',
        mark: 'text-muted-foreground',
      };
    case 'saving':
      return {
        icon: LoaderCircle,
        text: 'Saving',
        announcement: `Saving ${subject}.`,
        frame: 'text-muted-foreground',
        mark: 'text-muted-foreground',
        spin: true,
      };
    case 'saved':
      return {
        icon: CircleCheck,
        text: `Saved ${formatTime(value.at, timeZone)}`,
        announcement: `${subject} saved to the record at ${formatDateTime(value.at, timeZone)}.`,
        frame: 'text-muted-foreground',
        mark: 'text-primary',
      };
    case 'local':
      return {
        icon: CloudOff,
        // The invariant is that locally recovered work must not look durably saved, so the word
        // "saved" does not appear and the qualification is part of the visible text, not a tooltip.
        text: `On this device only ${formatTime(value.at, timeZone)} — not on the record`,
        announcement: `${subject} is held on this device only since ${formatDateTime(value.at, timeZone)}. It has not been saved to the record.`,
        frame: 'text-foreground',
        mark: 'text-foreground',
      };
    case 'failed':
      return {
        icon: TriangleAlert,
        text: 'Not saved.',
        detail: value.reason,
        announcement: `${subject} was not saved. ${value.reason}`,
        frame: 'text-destructive',
        mark: 'text-destructive',
      };
    case 'conflict':
      return {
        icon: GitCompareArrows,
        text: 'Changed elsewhere.',
        detail: value.reason,
        announcement: `${subject} was changed elsewhere. ${value.reason}`,
        frame: 'text-foreground',
        mark: 'text-foreground',
      };
  }
}

function actionOf(value: SaveStateValue): SaveStateAction | undefined {
  if (value.kind === 'failed') return value.retry;
  if (value.kind === 'conflict') return value.reconcile;
  return undefined;
}

/**
 * Reports whether the caller's work is durably on the record, beside the editor that produced it.
 *
 * It announces politely and never moves focus: autosave that pulls the cursor out of a clinical
 * note costs more than the message is worth. The announcement is a separate hidden line rather than
 * the visible text, because the visible text is abbreviated for a dense header and the spoken form
 * must not be.
 */
export function SaveState({ value, timeZone, label, className }: SaveStateProps) {
  const subject = label ?? 'This work';
  const view = presentation(value, timeZone, subject);
  const Icon = view.icon;
  const action = actionOf(value);

  return (
    <div className={cn('flex flex-wrap items-start gap-x-3 gap-y-2 text-sm', className)}>
      {/* Icon and state stay on one line together; only the action is allowed to wrap away. */}
      <span className={cn('flex min-w-0 items-start gap-2', view.frame)}>
        <Icon
          aria-hidden="true"
          className={cn(
            'mt-0.5 size-4 shrink-0',
            view.mark,
            view.spin && 'animate-spin motion-reduce:animate-none',
          )}
        />
        <span>
          {view.text}
          {view.detail && <span className="text-foreground"> {view.detail}</span>}
        </span>
      </span>
      {/*
        A polite status line, not an alert: a failed autosave is important but the operator is
        mid-sentence, and the visible state plus the recovery control carry the urgency.
      */}
      <span role="status" className="sr-only">
        {view.announcement}
      </span>
      {action && (
        <Button size="sm" variant="outline" onClick={action.onSelect}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
