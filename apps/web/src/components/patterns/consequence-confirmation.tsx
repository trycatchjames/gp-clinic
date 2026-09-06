import * as React from 'react';
import { PencilLine, TriangleAlert } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/patterns/form-field';
import { cn } from '@/lib/utils';

export type ConsequenceSeverity = 'destructive' | 'corrective';

export type ConsequenceReason = {
  label: string;
  hint?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export type ConsequenceAcknowledgement = {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const severities = {
  destructive: {
    icon: TriangleAlert,
    frame: 'text-destructive border-destructive/25 bg-destructive/5',
    confirm: 'destructive',
  },
  corrective: {
    icon: PencilLine,
    frame: 'text-primary border-primary/25 bg-primary/5',
    confirm: 'default',
  },
} satisfies Record<
  ConsequenceSeverity,
  {
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    frame: string;
    confirm: 'destructive' | 'default';
  }
>;

function Disclosure({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-muted-foreground text-sm">{term}</dt>
      <dd className="min-w-0 text-sm font-medium break-words">{children}</dd>
    </div>
  );
}

/**
 * The reviewed shape of a destructive or corrective confirmation.
 *
 * The cross-cutting destructive-action contract requires the target, context, consequence,
 * retained history, downstream effects and safer alternative to be visible before the operator
 * commits. Naming each of those as its own slot is the point of this molecule: a capability that
 * omits one leaves a visibly empty disclosure rather than a confirmation that quietly says less
 * than the contract requires. Deciding that an action is consequential, and every word describing
 * the consequence, stays with the capability.
 */
export function ConsequenceConfirmation({
  open,
  onOpenChange,
  severity = 'destructive',
  title,
  target,
  context,
  consequence,
  retained,
  downstream,
  alternative,
  reason,
  acknowledgement,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  submitting = false,
  failure,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  severity?: ConsequenceSeverity;
  title: string;
  target: React.ReactNode;
  context?: React.ReactNode;
  consequence: React.ReactNode;
  retained?: React.ReactNode;
  downstream?: React.ReactNode;
  alternative?: React.ReactNode;
  reason?: ConsequenceReason;
  acknowledgement?: ConsequenceAcknowledgement;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  submitting?: boolean;
  failure?: React.ReactNode;
  className?: string;
}) {
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const reasonRef = React.useRef<HTMLTextAreaElement>(null);
  const failureRef = React.useRef<HTMLDivElement>(null);
  const baseId = React.useId();
  const acknowledgementId = `${baseId}-acknowledgement`;
  const preconditionId = `${baseId}-precondition`;
  const appearance = severities[severity];
  const Icon = appearance.icon;

  const unmet: string[] = [];
  if (reason && reason.value.trim().length === 0) unmet.push('enter a reason');
  if (acknowledgement && !acknowledgement.checked) unmet.push('tick the acknowledgement');
  const precondition = unmet.length > 0 ? `To continue, ${unmet.join(' and ')}.` : undefined;

  // A failed submission must reach an operator who is not watching the button. The dialog stays
  // open with the reason and acknowledgement intact, and focus moves to what went wrong.
  React.useEffect(() => {
    if (failure) failureRef.current?.focus();
  }, [failure]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Every dismissal path — Escape, overlay, the close control and Cancel — is refused while
        // the mutation is in flight, because abandoning the dialog would leave its outcome unknown.
        if (!next && submitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className={cn('sm:max-w-xl', className)}
        data-severity={severity}
        onOpenAutoFocus={(event) => {
          // Opening onto the consequential action would let a held Enter key confirm before the
          // consequence has been read. Focus lands on what the operator must deal with first: a
          // failure carried over from the last attempt, then the reason, then the disclosures.
          event.preventDefault();
          if (failure) failureRef.current?.focus();
          else if (reason) reasonRef.current?.focus();
          else bodyRef.current?.focus();
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-3 text-left">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border',
                appearance.frame,
              )}
            >
              <Icon aria-hidden className="size-4.5" />
            </span>
            <div className="min-w-0 space-y-2">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{consequence}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div
          ref={bodyRef}
          tabIndex={-1}
          // The right padding keeps the disclosure text clear of the scrollbar, which otherwise
          // overlays the last few characters of a wrapped value on a narrow screen.
          className="max-h-[50vh] space-y-4 overflow-y-auto pr-2 outline-hidden"
        >
          <dl className="space-y-2 border-y py-3">
            <Disclosure term="Action applies to">{target}</Disclosure>
            {context && <Disclosure term="Context">{context}</Disclosure>}
            {retained && <Disclosure term="Kept in the record">{retained}</Disclosure>}
            {downstream && <Disclosure term="Also changes">{downstream}</Disclosure>}
          </dl>

          {alternative && (
            <div className="bg-muted/50 space-y-1 rounded-lg border px-3 py-2.5">
              <p className="text-xs font-semibold tracking-wide uppercase">Safer alternative</p>
              <div className="text-muted-foreground text-sm">{alternative}</div>
            </div>
          )}

          {reason && (
            <Field label={reason.label} hint={reason.hint} error={reason.error} required>
              {(controlProps) => (
                <Textarea
                  {...controlProps}
                  ref={reasonRef}
                  rows={3}
                  value={reason.value}
                  onChange={(event) => reason.onChange(event.target.value)}
                  disabled={submitting}
                />
              )}
            </Field>
          )}

          {acknowledgement && (
            <div className="flex items-start gap-2.5">
              <Checkbox
                id={acknowledgementId}
                checked={acknowledgement.checked}
                onCheckedChange={(checked) => acknowledgement.onChange(checked === true)}
                disabled={submitting}
                className="mt-0.5"
              />
              <label htmlFor={acknowledgementId} className="text-sm leading-relaxed">
                {acknowledgement.label}
              </label>
            </div>
          )}
        </div>

        {failure && (
          <div
            ref={failureRef}
            role="alert"
            tabIndex={-1}
            className="border-destructive/40 bg-destructive/5 text-destructive rounded-lg border px-3 py-2.5 text-sm outline-hidden"
          >
            {failure}
          </div>
        )}

        {precondition && (
          <p id={preconditionId} className="text-muted-foreground text-xs sm:text-right">
            {precondition}
          </p>
        )}

        {/*
          The stack order is deliberate on a narrow screen: cancel keeps the thumb-resting position
          at the bottom and the consequential action sits furthest from it, with more separation
          between the two than the default footer gives.
        */}
        <DialogFooter className="max-sm:gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={appearance.confirm}
            disabled={submitting || Boolean(precondition)}
            aria-describedby={precondition ? preconditionId : undefined}
            onClick={onConfirm}
          >
            <Icon aria-hidden className="size-4" />
            {submitting ? 'Working…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
