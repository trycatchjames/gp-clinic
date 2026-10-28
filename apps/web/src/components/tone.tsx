import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Tone = 'neutral' | 'success' | 'warning' | 'info' | 'danger';

/**
 * The semantic tones as pale surfaces. Put them on a registry `Badge` through
 * {@link StatusBadge}, or on an `Alert` with `className={toneClasses.warning}`.
 * The words always carry the meaning; the tone only reinforces it.
 */
export const toneClasses: Record<Tone, string> = {
  neutral: 'border-border bg-muted text-muted-foreground',
  success: 'border-success/20 bg-success-subtle text-success',
  warning: 'border-warning/20 bg-warning-subtle text-warning',
  info: 'border-info/20 bg-info-subtle text-info',
  danger: 'border-destructive/20 bg-destructive/10 text-destructive',
};

export function StatusBadge({
  tone,
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { tone: Tone }) {
  return <Badge variant="outline" className={cn(toneClasses[tone], className)} {...props} />;
}
