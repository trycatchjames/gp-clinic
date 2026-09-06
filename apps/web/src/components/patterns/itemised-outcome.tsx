import {
  Ban,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleSection } from '@/components/patterns/collapsible-section';
import { cn } from '@/lib/utils';

export type ItemisedPreviewStatus = 'ready' | 'blocked';
export type ItemisedResultStatus = 'applied' | 'failed' | 'skipped';
export type ItemisedStatus = ItemisedPreviewStatus | ItemisedResultStatus;

type ItemisedItemBase = {
  key: string;
  /** The record, named as the operator knows it. */
  name: string;
  /** Why this record is blocked, failed or was skipped, in the caller's words. */
  detail?: string;
  /** One recovery or resolution step for this record alone. */
  action?: { label: string; onSelect: () => void };
};

export type ItemisedPreviewItem = ItemisedItemBase & { status: ItemisedPreviewStatus };
export type ItemisedResultItem = ItemisedItemBase & { status: ItemisedResultStatus };

type ItemisedOutcomeBaseProps = {
  /** Names the operation and the set it covers. The caller owns the verb. */
  heading: string;
  /** Singular and plural noun for what is being counted. */
  noun: readonly [string, string];
  /**
   * Optional disclosure for the records that succeeded. They need no further work, so hiding them
   * keeps the ones that do at the top; omit it and every record stays listed.
   */
  appliedDisclosure?: { open: boolean; onOpenChange: (open: boolean) => void };
  level?: 2 | 3 | 4;
  className?: string;
};

/**
 * The phase decides which outcomes may be claimed. A preview has not run, so nothing in it may say
 * `applied`; a result has, so nothing in it may still say `ready`. Keeping that in the type stops a
 * caller reporting work as done before it has happened.
 */
export type ItemisedOutcomeProps =
  | (ItemisedOutcomeBaseProps & {
      phase: 'preview';
      items: readonly ItemisedPreviewItem[];
      pending?: never;
    })
  | (ItemisedOutcomeBaseProps & {
      phase: 'result';
      items: readonly ItemisedResultItem[];
      /** Records the operation has not reached yet. No outcome is claimed for them. */
      pending?: number;
    });

type StatusView = {
  icon: typeof CircleCheck;
  word: string;
  mark: string;
  /** Order in the list. Whatever needs the operator comes first. */
  rank: number;
};

const statusViews = {
  failed: { icon: TriangleAlert, word: 'Failed', mark: 'text-destructive', rank: 0 },
  blocked: { icon: Ban, word: 'Blocked', mark: 'text-destructive', rank: 1 },
  skipped: { icon: CircleMinus, word: 'Skipped', mark: 'text-muted-foreground', rank: 2 },
  ready: { icon: CircleDashed, word: 'Ready', mark: 'text-muted-foreground', rank: 3 },
  applied: { icon: CircleCheck, word: 'Done', mark: 'text-primary', rank: 4 },
} satisfies Record<ItemisedStatus, StatusView>;

function ItemRow({ item }: { item: ItemisedPreviewItem | ItemisedResultItem }) {
  const view = statusViews[item.status];
  const Icon = view.icon;

  return (
    <li className="flex flex-wrap items-start gap-x-3 gap-y-1 border-t px-3 py-2 first:border-t-0">
      <span className="flex min-w-0 flex-1 items-start gap-2">
        <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', view.mark)} />
        <span className="min-w-0">
          {/*
            The outcome is a word as well as an icon and a colour. A reason wraps in full: a hidden
            clause is how a partial result starts reading as a complete one.
          */}
          <span className={cn('font-medium', view.mark)}>{view.word}</span>
          <span className="text-foreground"> · {item.name}</span>
          {item.detail && <span className="text-muted-foreground block">{item.detail}</span>}
        </span>
      </span>
      {item.action && (
        <Button size="sm" variant="outline" onClick={item.action.onSelect}>
          {item.action.label}
        </Button>
      )}
    </li>
  );
}

function ItemList({
  items,
  label,
}: {
  items: readonly (ItemisedPreviewItem | ItemisedResultItem)[];
  label: string;
}) {
  return (
    <ul aria-label={label} className="rounded-md border">
      {items.map((item) => (
        <ItemRow key={item.key} item={item} />
      ))}
    </ul>
  );
}

/**
 * What an operation across many records would do, and then what it did.
 *
 * The component performs nothing and judges nothing. It exists so a batch cannot be reported as a
 * single success or a single failure, and so every record that did not change keeps its name and
 * its reason where the operator can act on it.
 */
export function ItemisedOutcome(props: ItemisedOutcomeProps) {
  const { heading, noun, appliedDisclosure, level = 3, className, phase, items } = props;
  const pending = phase === 'result' ? (props.pending ?? 0) : 0;
  const [singular, plural] = noun;
  const Heading = `h${level}` as const;

  const counts = items.reduce<Partial<Record<ItemisedStatus, number>>>((totals, item) => {
    totals[item.status] = (totals[item.status] ?? 0) + 1;
    return totals;
  }, {});

  const total = items.length + pending;
  const failed = counts.failed ?? 0;

  const ordered = [...items].sort(
    (left, right) => statusViews[left.status].rank - statusViews[right.status].rank,
  );
  // Only the succeeded records may be put away. Anything still needing a decision stays on screen.
  const collapsible = appliedDisclosure
    ? ordered.filter((item) => item.status === 'applied')
    : [];
  const listed = ordered.filter((item) => !collapsible.includes(item));

  const parts = (Object.keys(statusViews) as ItemisedStatus[])
    .sort((left, right) => statusViews[left].rank - statusViews[right].rank)
    .flatMap((status) => {
      const count = counts[status] ?? 0;
      return count > 0 ? [`${count} ${statusViews[status].word.toLowerCase()}`] : [];
    });
  if (pending > 0) parts.push(`${pending} still to do`);

  return (
    <section aria-label={heading} className={cn('grid gap-3', className)}>
      <Heading className="text-base font-semibold">{heading}</Heading>
      {/*
        A failed result interrupts; a preview never does, because nothing has happened yet. The
        summary counts every record the list accounts for, so a total can never outrun its items.
      */}
      <p
        role={phase === 'result' && failed > 0 ? 'alert' : 'status'}
        className="text-sm tabular-nums"
      >
        <span className="font-medium">
          {total} {total === 1 ? singular : plural}
        </span>
        <span className="text-muted-foreground"> · {parts.join(' · ')}</span>
        {pending > 0 && (
          <LoaderCircle
            aria-hidden="true"
            className="text-muted-foreground ml-2 inline size-3.5 animate-spin align-[-2px] motion-reduce:animate-none"
          />
        )}
      </p>

      {listed.length > 0 && (
        <ItemList items={listed} label={`${heading}, ${phase === 'preview' ? 'records' : 'outcomes'}`} />
      )}

      {appliedDisclosure && collapsible.length > 0 && (
        <CollapsibleSection
          title={`${collapsible.length} ${collapsible.length === 1 ? singular : plural} done`}
          summary="No further action"
          level={level === 4 ? 4 : ((level + 1) as 3 | 4)}
          open={appliedDisclosure.open}
          onOpenChange={appliedDisclosure.onOpenChange}
        >
          <ItemList items={collapsible} label={`${heading}, completed`} />
        </CollapsibleSection>
      )}
    </section>
  );
}
