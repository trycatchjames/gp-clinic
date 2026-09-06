import * as React from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavigationSection = {
  key: string;
  label: string;
  href: string;
  /**
   * How much work the section holds. Zero is shown as zero: "nothing there" and "not counted" are
   * different claims, and only one of them is safe to skip past.
   */
  count?: number;
  /** Something in the section is overdue or urgent. The caller decides what qualifies. */
  attention?: boolean;
  /** What the count means, for the section's accessible name. */
  countLabel?: string;
};

export type SectionNavigationProps = {
  label: string;
  sections: readonly NavigationSection[];
  currentKey: string;
  /** Reported so a router can take the navigation instead of the browser. */
  onNavigate?: (section: NavigationSection, event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

/**
 * The peer sections of a workspace.
 *
 * These are links, not tabs. Moving between them changes location, and the tab model would promise
 * a panel switch that does not happen. A section the caller does not supply is simply absent; what
 * a user may reach is decided on the server, never by this list.
 */
export function SectionNavigation({
  label,
  sections,
  currentKey,
  onNavigate,
  className,
}: SectionNavigationProps) {
  const currentRef = React.useRef<HTMLAnchorElement>(null);

  // At a narrow width the list scrolls, and the current section can start off screen. Bringing it
  // into view means the operator's location is never the part they cannot see.
  React.useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [currentKey]);

  return (
    <nav aria-label={label} className={cn('overflow-x-auto', className)}>
      <ul className="flex min-w-max items-stretch gap-1">
        {sections.map((section) => {
          const current = section.key === currentKey;
          const counted = section.count !== undefined;

          return (
            <li key={section.key}>
              <a
                ref={current ? currentRef : undefined}
                href={section.href}
                // `aria-current` marks a location, where `aria-selected` would claim a tab.
                aria-current={current ? 'page' : undefined}
                aria-label={
                  counted
                    ? `${section.label}, ${section.count} ${section.countLabel ?? 'items'}${
                        section.attention ? ', needs attention' : ''
                      }`
                    : section.attention
                      ? `${section.label}, needs attention`
                      : undefined
                }
                onClick={(event) => onNavigate?.(section, event)}
                className={cn(
                  'focus-visible:ring-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap outline-none focus-visible:ring-[3px]',
                  // The current section carries a leading rule as well as a tint, so it survives
                  // being seen by someone who does not distinguish the colour.
                  current
                    ? 'bg-accent text-primary border-primary border-b-2 font-medium'
                    : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent',
                )}
              >
                <span>{section.label}</span>
                {section.attention && (
                  <CircleAlert aria-hidden="true" className="text-destructive size-3.5" />
                )}
                {counted && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                      section.attention
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {section.count}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
