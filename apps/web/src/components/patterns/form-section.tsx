import * as React from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FormSectionProps = {
  title: string;
  /** Why this section is being asked for. Associated with the group, not floating beside it. */
  description?: React.ReactNode;
  /**
   * Heading level, so a section sits correctly under the screen's own heading. A form that jumps
   * from h1 to h3 is unnavigable by heading for a screen-reader user.
   */
  level?: 2 | 3 | 4;
  /** How many fields in this section still need correcting. Rendered only when it is above zero. */
  errorCount?: number;
  /** Marks a section a role may fill in later, so an incomplete one is not read as a failure. */
  optional?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

function problemLabel(count: number) {
  return count === 1 ? '1 problem to correct' : `${count} problems to correct`;
}

/**
 * One labelled region of a long form.
 *
 * A registration spans eight regions and a consultation several more, and the difference between a
 * section and a visual gap has to be programmatic: this is a labelled group, so an operator can
 * navigate the form by heading and hear which region they are in. It carries no fields of its own —
 * the Field contract still owns every label, hint and error inside it.
 */
export function FormSection({
  title,
  description,
  level = 2,
  errorCount = 0,
  optional,
  id,
  className,
  children,
}: FormSectionProps) {
  const generatedId = React.useId();
  const sectionId = id ?? generatedId;
  const titleId = `${sectionId}-title`;
  const descriptionId = description ? `${sectionId}-description` : undefined;
  const Heading = `h${level}` as const;

  return (
    <section
      id={sectionId}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn('grid gap-4', className)}
    >
      <div className="grid gap-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Heading id={titleId} className="text-base font-semibold">
            {title}
          </Heading>
          {/*
            "Optional" is a fact about the section, not a styling choice: a section a role fills in
            later must not read as one they failed to complete.
          */}
          {optional && <span className="text-muted-foreground text-sm">Optional</span>}
        </div>
        {description && (
          <p id={descriptionId} className="text-muted-foreground text-sm">
            {description}
          </p>
        )}
        {errorCount > 0 && (
          <p className="text-destructive flex items-center gap-1.5 text-sm font-medium">
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            {problemLabel(errorCount)}
          </p>
        )}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
