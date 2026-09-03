import * as React from 'react';
import { StatePanel } from '@/components/patterns/state-panel';

export function EmptyState({
  icon,
  title,
  description,
  action,
  density = 'comfortable',
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /**
   * `compact` keeps guidance to a couple of lines so it does not outweigh the
   * records it sits beside on a dense, mid-task screen.
   */
  density?: 'compact' | 'comfortable';
}) {
  return (
    <StatePanel
      kind="empty"
      title={title}
      description={description}
      details={icon ? <span aria-hidden="true">{icon}</span> : undefined}
      action={action}
      compact={density === 'compact'}
    />
  );
}
