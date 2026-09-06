import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CollapsibleSectionProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Stays visible whether the section is open or closed.
   *
   * This is the whole reason the component exists rather than a bare disclosure: the consultation
   * workspace requires that a collapsed summary "still exposes safety indicators", so anything an
   * operator must not miss belongs here and not in the collapsible body.
   */
  indicators?: React.ReactNode;
  /** A count or short state shown beside the title, so closing does not hide how much is inside. */
  summary?: string;
  level?: 2 | 3 | 4;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * A section whose body can be closed while its safety indicators stay on screen.
 *
 * The body is unmounted when closed rather than hidden, so nothing inside it can be reached by
 * keyboard or read by assistive technology while it is not visible — a control a sighted operator
 * cannot see must not still be in the tab order.
 */
export function CollapsibleSection({
  title,
  open,
  onOpenChange,
  indicators,
  summary,
  level = 3,
  id,
  className,
  children,
}: CollapsibleSectionProps) {
  const generatedId = React.useId();
  const sectionId = id ?? generatedId;
  const bodyId = `${sectionId}-body`;
  const Heading = `h${level}` as const;

  return (
    <section className={cn('grid gap-3 rounded-md border p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Heading className="min-w-0 text-base font-semibold">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={open ? bodyId : undefined}
            onClick={() => onOpenChange(!open)}
            className="focus-visible:ring-ring flex items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-[3px]"
          >
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'size-4 shrink-0 transition-transform motion-reduce:transition-none',
                !open && '-rotate-90',
              )}
            />
            <span>{title}</span>
            {/* The count is short and reads badly broken over two lines beside a wrapped title. */}
            {summary && (
              <span className="text-muted-foreground shrink-0 font-normal whitespace-nowrap">
                {summary}
              </span>
            )}
          </button>
        </Heading>
        {indicators && <div className="flex flex-wrap items-center gap-2">{indicators}</div>}
      </div>
      {open && <div id={bodyId}>{children}</div>}
    </section>
  );
}
