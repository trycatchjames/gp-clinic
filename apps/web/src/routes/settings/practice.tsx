import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { formatAbn } from '@gp/contracts';
import { usePracticeId } from '@/lib/auth';
import { usePractice, useRegistrations } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

export function PracticeSettingsRoute() {
  const practiceId = usePracticeId();
  const practice = usePractice(practiceId);
  const registrations = useRegistrations(practiceId);

  if (practice.isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <>
      <PageHeader
        title="Practice details"
        description="The business identity behind every invoice, referral and patient communication."
        actions={
          <Button variant="outline" asChild>
            <Link to="/onboarding">
              Open setup wizard
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Detail label="Legal entity name" value={practice.data?.legalName} />
          <Detail label="Trading name" value={practice.data?.tradingName} />
          <Detail
            label="Entity type"
            value={practice.data?.entityType.replace(/_/g, ' ')}
            capitalise
          />
          <Detail
            label="Practice type"
            value={practice.data?.practiceType.replace(/_/g, ' ')}
            capitalise
          />
          <Detail
            label="ABN"
            value={practice.data?.abn ? formatAbn(practice.data.abn) : 'Not recorded'}
            mono
          />
          <Detail label="ACN" value={practice.data?.acn ?? 'Not applicable'} mono />
          <Detail label="Email" value={practice.data?.contactEmail ?? '—'} />
          <Detail label="Phone" value={practice.data?.contactPhone ?? '—'} />
          <Detail
            label="Status"
            value={
              <Badge variant={practice.data?.onboardingStatus === 'active' ? 'success' : 'warning'}>
                {practice.data?.onboardingStatus === 'active' ? 'Active' : 'Setup in progress'}
              </Badge>
            }
          />
          <Detail label="Activated" value={formatDate(practice.data?.activatedAt)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrations and programs</CardTitle>
          <CardDescription>
            These determine what the practice can bill and which incentives it qualifies for.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Detail
            label="MyMedicare"
            value={
              <Badge
                variant={
                  registrations.data?.myMedicareStatus === 'registered' ? 'success' : 'outline'
                }
              >
                {registrations.data?.myMedicareStatus.replace(/_/g, ' ') ?? '—'}
              </Badge>
            }
          />
          <Detail
            label="Registered on"
            value={formatDate(registrations.data?.myMedicareRegisteredOn)}
          />
          <Detail
            label="BBPIP"
            value={
              <Badge variant={registrations.data?.bbpipParticipating ? 'warning' : 'outline'}>
                {registrations.data?.bbpipParticipating ? 'Participating' : 'Not participating'}
              </Badge>
            }
          />
          <Detail
            label="BBPIP effective from"
            value={formatDate(registrations.data?.bbpipEffectiveFrom)}
          />
          <Detail
            label="Accreditation"
            value={
              <Badge
                variant={
                  registrations.data?.accreditationStatus === 'accredited' ? 'success' : 'outline'
                }
              >
                {registrations.data?.accreditationStatus.replace(/_/g, ' ') ?? '—'}
              </Badge>
            }
          />
          <Detail
            label="Certificate expires"
            value={formatDate(registrations.data?.accreditationExpiresOn)}
          />
          <Detail label="Accrediting body" value={registrations.data?.accreditingBody ?? '—'} />
          <Detail
            label="Incentive programs"
            value={
              [
                registrations.data?.pipParticipating ? 'PIP' : null,
                registrations.data?.wipParticipating ? 'WIP' : null,
              ]
                .filter(Boolean)
                .join(', ') || 'None'
            }
          />
          <Detail
            label="PRODA organisation"
            value={registrations.data?.prodaOrganisationName ?? '—'}
          />
        </CardContent>
      </Card>
    </>
  );
}

function Detail({
  label,
  value,
  mono,
  capitalise,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  capitalise?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p>
      <div
        className={[
          'text-sm',
          mono ? 'tabular font-mono' : '',
          capitalise ? 'capitalize' : '',
        ].join(' ')}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}
