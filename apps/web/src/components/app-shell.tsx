import * as React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPin,
  Receipt,
  Search,
  Stethoscope,
  Users,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn, initials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SyncIndicator } from '@/components/sync-indicator';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Roles that may see this item. Omitted means everyone. */
  roles?: string[];
}

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Practice',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/settings/practice', label: 'Practice details', icon: Building2 },
      { to: '/settings/locations', label: 'Locations', icon: MapPin },
    ],
  },
  {
    heading: 'Patients',
    items: [{ to: '/patients/search', label: 'Find a patient', icon: Search }],
  },
  {
    heading: 'People',
    items: [
      { to: '/settings/practitioners', label: 'Practitioners', icon: Stethoscope },
      { to: '/settings/team', label: 'Team and access', icon: Users },
    ],
  },
  {
    heading: 'Configuration',
    items: [
      { to: '/settings/booking', label: 'Booking setup', icon: CalendarDays },
      { to: '/settings/billing', label: 'Billing and fees', icon: Receipt },
      { to: '/mbs', label: 'MBS reference', icon: ClipboardList },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut, sessionStale } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="bg-background flex min-h-svh">
      <aside
        className={cn(
          'bg-card fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-xs font-bold">
            GP
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm leading-tight font-semibold">
              {user?.practiceName ?? 'No practice'}
            </p>
            <p className="text-muted-foreground text-[11px] leading-tight">
              Practice management
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto p-3">
          {NAV.map((group) => (
            <div key={group.heading}>
              <p className="text-muted-foreground px-3 pb-1.5 text-[11px] font-medium tracking-wider uppercase">
                {group.heading}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                      pathname === item.to
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto w-full justify-start gap-2 px-2 py-2">
                <Avatar>
                  <AvatarFallback>
                    {user ? initials(user.givenName, user.familyName) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm leading-tight font-medium">
                    {user?.givenName} {user?.familyName}
                  </p>
                  <p className="text-muted-foreground truncate text-[11px] leading-tight">
                    {user?.role?.replace(/_/g, ' ')}
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground size-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">
                  {user?.givenName} {user?.familyName}
                </p>
                <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => void signOut()}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/95 sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Menu className="size-4" />
          </Button>
          <div className="flex-1" />
          {user?.onboardingStatus === 'in_progress' && (
            <Link to="/onboarding">
              <Badge variant="warning" className="cursor-pointer">
                Setup in progress
              </Badge>
            </Link>
          )}
          <SyncIndicator />
        </header>

        {sessionStale && (
          <div className="bg-warning/15 border-warning/40 text-warning-foreground border-b px-4 py-2 text-sm lg:px-8">
            Showing cached data — this device could not reach the server, so nothing can be
            saved until it reconnects.
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
