import * as React from 'react';
import { StatePanel } from '@/components/patterns/state-panel';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <StatePanel
      kind="empty"
      title={title}
      description={description}
      details={icon ? <span aria-hidden="true">{icon}</span> : undefined}
      action={action}
    />
  );
}
