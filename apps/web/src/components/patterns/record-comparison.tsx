import * as React from 'react';
import { ArrowLeftRight, Equal, TriangleAlert } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export type ComparisonStatus = 'same' | 'differs' | 'conflict';
export type ComparisonChoice = 'left' | 'right' | 'both';

export type ComparisonRow = {
  key: string;
  label: string;
  /** `null` where the side does not hold this fact. It is named, never left blank. */
  left: React.ReactNode | null;
  right: React.ReactNode | null;
  status: ComparisonStatus;
  /**
   * Present when the reviewer must choose. `value` starts as `null` and stays that way until they
   * choose: the pattern proposes no survivor, because no automatic best record is permitted.
   */
  choice?: {
    value: ComparisonChoice | null;
    onChange: (value: ComparisonChoice) => void;
    allowBoth?: boolean;
  };
};

export type RecordComparisonProps = {
  /** Names the comparison as a whole, for example "Potential duplicate records". */
  label: string;
  /** Names each side. Every value carries the side it came from, at every width. */
  leftLabel: string;
  rightLabel: string;
  rows: readonly ComparisonRow[];
  /** What a side that does not hold a fact says. Never an empty space. */
  missingLabel?: string;
  level?: 2 | 3 | 4;
  className?: string;
};

const statusViews = {
  same: { icon: Equal, word: 'Same', mark: 'text-muted-foreground', frame: 'border-border' },
  differs: {
    icon: ArrowLeftRight,
    word: 'Differs',
    mark: 'text-foreground',
    frame: 'border-border',
  },
  conflict: {
    icon: TriangleAlert,
    word: 'Conflict',
    mark: 'text-destructive',
    frame: 'border-destructive/40',
  },
} satisfies Record<
  ComparisonStatus,
  { icon: typeof Equal; word: string; mark: string; frame: string }
>;

function Side({
  sideLabel,
  value,
  missingLabel,
}: {
  sideLabel: string;
  value: React.ReactNode | null;
  missingLabel: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{sideLabel}</p>
      {/*
        A side that does not hold the fact says so. A blank cell reads as agreement, which is the
        one thing a comparison must never accidentally claim.
      */}
      {value === null ? (
        <p className="text-muted-foreground text-sm italic">{missingLabel}</p>
      ) : (
        <div className="text-sm break-words">{value}</div>
      )}
    </div>
  );
}

/**
 * Two records or two versions, fact by fact.
 *
 * The pattern shows the difference and collects a decision. It never makes one: which record
 * survives, which facts are dangerous to disagree on, and whether the reviewer may see a fact at
 * all stay with the capability.
 */
export function RecordComparison({
  label,
  leftLabel,
  rightLabel,
  rows,
  missingLabel = 'Not recorded',
  level = 3,
  className,
}: RecordComparisonProps) {
  const groupId = React.useId();
  const Heading = `h${level}` as const;

  return (
    <section aria-label={label} className={cn('grid gap-3', className)}>
      <ul className="grid gap-3">
        {rows.map((row) => {
          const view = statusViews[row.status];
          const Icon = view.icon;
          const factId = `${groupId}-${row.key}`;

          return (
            <li key={row.key} className={cn('grid gap-3 rounded-md border p-3', view.frame)}>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <Heading id={factId} className="text-sm font-semibold">
                  {row.label}
                </Heading>
                {/*
                  The difference is a word as well as a mark and a frame, so it survives being read
                  aloud, printed, or seen by someone who does not distinguish the tint.
                */}
                <span className={cn('flex items-center gap-1.5 text-xs font-medium', view.mark)}>
                  <Icon aria-hidden="true" className="size-3.5" />
                  {view.word}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Side sideLabel={leftLabel} value={row.left} missingLabel={missingLabel} />
                <Side sideLabel={rightLabel} value={row.right} missingLabel={missingLabel} />
              </div>

              {row.choice && (
                <RadioGroup
                  aria-labelledby={factId}
                  // No option is preselected. The reviewer chooses, or the fact stays unresolved.
                  value={row.choice.value ?? ''}
                  onValueChange={(value) => row.choice?.onChange(value as ComparisonChoice)}
                  className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-3"
                >
                  {(
                    [
                      { value: 'left' as const, label: `Keep ${leftLabel}` },
                      { value: 'right' as const, label: `Keep ${rightLabel}` },
                      ...(row.choice.allowBoth
                        ? [{ value: 'both' as const, label: 'Keep both' }]
                        : []),
                    ]
                  ).map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem
                        id={`${factId}-${option.value}`}
                        value={option.value}
                      />
                      <Label htmlFor={`${factId}-${option.value}`} className="text-sm font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
