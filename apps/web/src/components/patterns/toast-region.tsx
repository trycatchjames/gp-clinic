import * as React from 'react';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ToastTone = 'success' | 'failure' | 'status';

export type ToastMessage = {
  /**
   * Stable for one occurrence of one event. Re-supplying the same id with the same text is how a
   * caller says "this is still the same message", and it is what keeps a background refresh from
   * announcing unchanged content again.
   */
  id: string;
  tone: ToastTone;
  /** Names the object and the action. Success wording is only correct after a durable commit. */
  title: string;
  /** For a failure: what did not happen and what remains unchanged. */
  description?: React.ReactNode;
  /** The safe next step. A failure that has one MUST offer it here rather than in prose. */
  action?: { label: string; onSelect: () => void };
  /** Announced text, when the visible wording is not the whole meaning on its own. */
  announcement?: string;
};

export type ToastRegionProps = {
  toasts: readonly ToastMessage[];
  onDismiss: (id: string) => void;
  /** Names the landmark a screen-reader user navigates to in order to reach the actions. */
  label?: string;
  dismissLabel?: string;
  className?: string;
};

// A triangle, a tick and an information mark differ in outline as well as in colour, so tone
// survives a monochrome display or a colour-vision difference.
const tones = {
  success: {
    icon: CircleCheck,
    word: 'Completed',
    frame: 'border-primary/30 bg-accent',
    mark: 'text-primary',
  },
  failure: {
    icon: TriangleAlert,
    word: 'Failed',
    frame: 'border-destructive/40 bg-destructive/5',
    mark: 'text-destructive',
  },
  status: {
    icon: Info,
    word: 'Update',
    frame: 'border-border bg-surface',
    mark: 'text-muted-foreground',
  },
} satisfies Record<ToastTone, { icon: typeof Info; word: string; frame: string; mark: string }>;

function announcementText(toast: ToastMessage) {
  if (toast.announcement) return toast.announcement;
  const detail = typeof toast.description === 'string' ? ` ${toast.description}` : '';
  return `${tones[toast.tone].word}. ${toast.title}${detail}`;
}

/**
 * A live region that already exists when its text arrives is announced reliably; one that is
 * inserted together with its text often is not. Both regions are therefore mounted for the life of
 * the component and only their contents change.
 *
 * The visible stack is deliberately NOT a live region. Announcing a container that holds buttons
 * makes assistive technology read the controls as part of the message, and it would announce each
 * toast twice once the hidden mirror has already spoken. The visible stack is a labelled landmark
 * instead, so the operator hears the message from the mirror and can then navigate to the landmark
 * to use the action or dismiss it.
 */
export function ToastRegion({
  toasts,
  onDismiss,
  label = 'Notifications',
  dismissLabel = 'Dismiss',
  className,
}: ToastRegionProps) {
  const polite = toasts.filter((toast) => toast.tone !== 'failure');
  const assertive = toasts.filter((toast) => toast.tone === 'failure');

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="false">
        {polite.map((toast) => (
          <p key={toast.id}>{announcementText(toast)}</p>
        ))}
      </div>
      {/*
        Interruption is reserved for work that failed. A routine confirmation that cuts across what
        an operator is currently reading costs more attention than it returns.
      */}
      <div className="sr-only" aria-live="assertive" aria-atomic="false">
        {assertive.map((toast) => (
          <p key={toast.id}>{announcementText(toast)}</p>
        ))}
      </div>

      {toasts.length > 0 && (
        <section
          aria-label={label}
          className={cn(
            'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end',
            className,
          )}
        >
          <ol className="flex w-full max-w-sm flex-col gap-2">
            {toasts.map((toast) => {
              const tone = tones[toast.tone];
              const Icon = tone.icon;
              return (
                <li
                  key={toast.id}
                  className={cn(
                    'pointer-events-auto flex items-start gap-3 rounded-md border p-3 shadow-md',
                    tone.frame,
                  )}
                >
                  <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', tone.mark)} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {/* Tone is carried by a word as well as by the icon and the border colour. */}
                    <p className="text-sm leading-snug font-medium">
                      <span className="sr-only">{tone.word}. </span>
                      {toast.title}
                    </p>
                    {toast.description && (
                      <div className="text-muted-foreground text-sm leading-snug">
                        {toast.description}
                      </div>
                    )}
                    {toast.action && (
                      <div className="pt-1">
                        <Button size="sm" variant="outline" onClick={toast.action.onSelect}>
                          {toast.action.label}
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0"
                    aria-label={`${dismissLabel}: ${toast.title}`}
                    onClick={() => onDismiss(toast.id)}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </>
  );
}
