import * as React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/lib/auth';
import { LoginRoute } from '@/routes/login';
import { RegisterRoute } from '@/routes/register';
import { AcceptInvitationRoute } from '@/routes/accept-invitation';
import { OnboardingRoute } from '@/routes/onboarding';
import { DashboardRoute } from '@/routes/dashboard';
import { PatientSearchRoute } from '@/routes/patients/search';
import { PracticeSettingsRoute } from '@/routes/settings/practice';
import { LocationsSettingsRoute } from '@/routes/settings/locations';
import { PractitionersSettingsRoute } from '@/routes/settings/practitioners';
import { TeamSettingsRoute } from '@/routes/settings/team';
import { BookingSettingsRoute } from '@/routes/settings/booking';
import { BillingSettingsRoute } from '@/routes/settings/billing';
import { MbsRoute } from '@/routes/mbs';
import { FoundationsRoute } from '@/routes/foundations';

function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
}

/**
 * Guards are components rather than router loaders: auth state lives in React
 * context, and a loader that has to await it just adds a second source of truth.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" />;
  // A user with no practice has nowhere to go but setup.
  if (!user.practiceId) return <Navigate to="/onboarding" />;
  return <AppShell>{children}</AppShell>;
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (user) return <Navigate to={user.practiceId ? '/' : '/onboarding'} />;
  return <>{children}</>;
}

function RequireUser({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

const rootRoute = createRootRoute({ component: () => <Outlet /> });

// Written out rather than generated in a loop: TanStack Router infers the typed
// route table from these literals, which is what makes <Link to> type-safe.
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <RequireGuest>
      <LoginRoute />
    </RequireGuest>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <RequireGuest>
      <RegisterRoute />
    </RequireGuest>
  ),
});

const foundationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/foundations',
  component: FoundationsRoute,
});

const acceptInvitationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accept-invitation',
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: AcceptInvitationRoute,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: () => (
    <RequireUser>
      <OnboardingRoute />
    </RequireUser>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <RequireAuth>
      <DashboardRoute />
    </RequireAuth>
  ),
});

const practiceSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/practice',
  component: () => (
    <RequireAuth>
      <PracticeSettingsRoute />
    </RequireAuth>
  ),
});

const locationsSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/locations',
  component: () => (
    <RequireAuth>
      <LocationsSettingsRoute />
    </RequireAuth>
  ),
});

const practitionersSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/practitioners',
  component: () => (
    <RequireAuth>
      <PractitionersSettingsRoute />
    </RequireAuth>
  ),
});

const teamSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/team',
  component: () => (
    <RequireAuth>
      <TeamSettingsRoute />
    </RequireAuth>
  ),
});

const bookingSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/booking',
  component: () => (
    <RequireAuth>
      <BookingSettingsRoute />
    </RequireAuth>
  ),
});

const billingSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings/billing',
  component: () => (
    <RequireAuth>
      <BillingSettingsRoute />
    </RequireAuth>
  ),
});

const patientSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients/search',
  component: () => (
    <RequireAuth>
      <PatientSearchRoute />
    </RequireAuth>
  ),
});

const mbsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mbs',
  component: () => (
    <RequireAuth>
      <MbsRoute />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  foundationsRoute,
  acceptInvitationRoute,
  onboardingRoute,
  dashboardRoute,
  patientSearchRoute,
  practiceSettingsRoute,
  locationsSettingsRoute,
  practitionersSettingsRoute,
  teamSettingsRoute,
  bookingSettingsRoute,
  billingSettingsRoute,
  mbsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultNotFoundComponent: () => <Navigate to="/" />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
