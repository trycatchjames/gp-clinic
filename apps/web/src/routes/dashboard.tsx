import * as React from 'react';
import { Link } from '@tanstack/react-router';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Receipt,
  Stethoscope,
  Users,
} from 'lucide-react';
import { BBPIP } from '@gp/contracts';
import { useAuth, usePracticeId } from '@/lib/auth';
import {
  useAppointmentTypes,
  useBillingSettings,
  useLocations,
  useOnboarding,
  usePractice,
  usePractitioners,
  useRegistrations,
} from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export function DashboardRoute() {
  const { user } = useAuth();
  const practiceId = usePracticeId();
  const practice = usePractice(practiceId);
  const onboarding = useOnboarding(practiceId);
  const registrations = useRegistrations(practiceId);
  const billing = useBillingSettings(practiceId);
  const locations = useLocations(practiceId);
  const practitioners = usePractitioners(practiceId);
  const types = useAppointmentTypes(practiceId);

  const warnings = (practitioners.data ?? []).flatMap((p) =>
    p.warnings.map((warning) => ({ practitioner: p.displayName, warning })),
  );

  const outstanding = (onboarding.data?.recommended ?? []).filter((item) => !item.satisfied);

  return (
    <>
      <PageHeader
        title={`Good morning, ${user?.givenName ?? ''}`}
        description={
          practice.data
            ? `${practice.data.tradingName} · ${practice.data.legalName}`
            : undefined
        }
        actions={
          practice.data?.onboardingStatus === 'active' ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="size-3" />
              Active
            </Badge>
          ) : (
            <Button asChild>
              <Link to="/onboarding">
                Continue setup
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )
        }
      />

      {practice.data?.onboardingStatus === 'in_progress' && onboarding.data && (
        <Card>
          <CardHeader>
            <CardTitle>Finish setting up</CardTitle>
            <CardDescription>
              {onboarding.data.canActivate
                ? 'Everything required is done — you can activate the practice.'
                : 'A few required items are still outstanding.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={onboarding.data.completionPercent} />
            <Button asChild size="sm">
              <Link to="/onboarding">Open setup</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={MapPin}
          label="Locations"
          value={locations.data?.length}
          detail={
            locations.data ? `${locations.data.filter((l) => l.isActive).length} active` : undefined
          }
          to="/settings/locations"
          loading={locations.isLoading}
        />
        <StatCard
          icon={Stethoscope}
          label="Practitioners"
          value={practitioners.data?.length}
          detail={
            practitioners.data ? pluralise(practitioners.data.filter((p) => p.kind === 'gp').length, 'GP') : undefined
          }
          to="/settings/practitioners"
          loading={practitioners.isLoading}
        />
        <StatCard
          icon={CalendarDays}
          label="Appointment types"
          value={types.data?.filter((t) => t.isActive).length}
          detail={
            types.data
              ? `${types.data.filter((t) => t.onlineBookable).length} bookable online`
              : undefined
          }
          to="/settings/booking"
          loading={types.isLoading}
        />
        <StatCard
          icon={Receipt}
          label="Billing policy"
          value={
            billing.data?.billingPolicy === 'bulk_bill_all'
              ? 'Bulk bill'
              : billing.data?.billingPolicy === 'private'
                ? 'Private'
                : 'Mixed'
          }
          detail={billing.data?.policyLockedByBbpip ? 'Set by BBPIP' : undefined}
          to="/settings/billing"
          loading={billing.isLoading}
        />
      </div>

      {registrations.data?.bbpipParticipating && (
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>
            Participating in the Bulk Billing Practice Incentive Program
          </AlertTitle>
          <AlertDescription>
            You must bulk bill {BBPIP.requiredBulkBillingPercent}% of eligible services to
            receive the {BBPIP.loadingPercent}% loading, split{' '}
            {BBPIP.practitionerSharePercent}/{100 - BBPIP.practitionerSharePercent} with your
            practitioners. Effective from {formatDate(registrations.data.bbpipEffectiveFrom)}.
            The billing screen warns before anyone privately bills an eligible service.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Needs attention
            </CardTitle>
            <CardDescription>
              Setup problems that would cause a rejected claim or an unsupervised registrar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {practitioners.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : warnings.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nothing outstanding.</p>
            ) : (
              <ul className="space-y-2">
                {warnings.map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{item.practitioner}</span>
                    <span className="text-muted-foreground"> — {item.warning}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4" />
              Recommended setup
            </CardTitle>
            <CardDescription>
              Not blocking, but worth completing before you see patients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {onboarding.isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : outstanding.length === 0 ? (
              <p className="text-muted-foreground text-sm">All recommended items are done.</p>
            ) : (
              <ul className="space-y-2">
                {outstanding.map((item) => (
                  <li key={item.key} className="text-sm">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs">{item.rationale}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            What this prototype covers
          </CardTitle>
          <CardDescription>
            Practice setup is built end to end. Scheduling, the clinical record and billing are
            specified in <code className="text-xs">docs/</code> and{' '}
            <code className="text-xs">features/</code>, and modelled in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Coverage title="Built" items={['Practice registration and onboarding', 'Locations, hours and after-hours', 'Practitioners and provider numbers', 'Team, roles and invitations', 'Fee schedules and billing policy']} tone="success" />
          <Coverage title="Modelled" items={['Patients and entitlements', 'Appointment book and arrivals', 'Consultation and health summary', 'Invoices, payments and claims']} tone="info" />
          <Coverage title="Specified" items={['Prescribing and RTPM', 'Results, recalls and reminders', 'Chronic condition management', 'Accreditation evidence']} tone="secondary" />
        </CardContent>
      </Card>
    </>
  );
}

function pluralise(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  to,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  detail?: string;
  to: string;
  loading?: boolean;
}) {
  return (
    <Link to={to}>
      <Card className="hover:border-foreground/20 h-full gap-3 py-4 transition-colors">
        <CardContent className="space-y-1">
          <div className="text-muted-foreground flex items-center gap-2 text-xs tracking-wide uppercase">
            <Icon className="size-3.5" />
            {label}
          </div>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="tabular text-2xl font-semibold">{value ?? '—'}</p>
          )}
          {detail && <p className="text-muted-foreground text-xs">{detail}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}

function Coverage({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'success' | 'info' | 'secondary';
}) {
  return (
    <div className="space-y-2">
      <Badge variant={tone}>{title}</Badge>
      <ul className="text-muted-foreground space-y-1 text-xs">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
