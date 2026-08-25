import { MapPin, Clock, PhoneCall, Accessibility } from 'lucide-react';
import { AFTER_HOURS_ARRANGEMENT_LABELS, DAYS_OF_WEEK, type AfterHoursArrangement } from '@gp/contracts';
import type { LocationDto } from '@gp/sdk';
import { usePracticeId } from '@/lib/auth';
import { useBusinessHours, useLocations } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { Separator } from '@/components/ui/separator';

export function LocationsSettingsRoute() {
  const practiceId = usePracticeId();
  const locations = useLocations(practiceId);

  if (locations.isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <>
      <PageHeader
        title="Locations"
        description="Provider numbers, appointment books, banking and fee schedules are all scoped to a location — a group practice with sites in two states is two of everything."
      />

      {locations.data?.length === 0 ? (
        <EmptyState
          icon={<MapPin className="size-8" />}
          title="No locations yet"
          description="Add your first site in the setup wizard."
        />
      ) : (
        <div className="space-y-4">
          {locations.data?.map((location) => (
            <LocationCard key={location.id} practiceId={practiceId} location={location} />
          ))}
        </div>
      )}
    </>
  );
}

function LocationCard({
  practiceId,
  location,
}: {
  practiceId: string;
  location: LocationDto;
}) {
  const hours = useBusinessHours(practiceId, location.id);

  const facilities = [
    location.wheelchairAccess && 'Wheelchair access',
    location.accessibleToilet && 'Accessible toilet',
    location.hearingLoop && 'Hearing loop',
    location.onSiteParking && 'Parking',
    location.publicTransportNearby && 'Public transport',
    location.treatmentRoom && 'Treatment room',
    location.procedureRoom && 'Procedure room',
    location.onSitePathologyCollection && 'Pathology collection',
  ].filter(Boolean) as string[];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              {location.name}
              {location.isPrimary && <Badge variant="secondary">Main site</Badge>}
              {!location.isActive && <Badge variant="outline">Inactive</Badge>}
            </CardTitle>
            <CardDescription>
              {location.streetAddress}, {location.suburb} {location.state} {location.postcode}
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="size-3" />
            {location.timezone.replace('Australia/', '').replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <Detail label="Phone" value={location.phone ?? '—'} />
          <Detail label="Fax" value={location.fax ?? '—'} />
          <Detail label="HPI-O" value={location.hpiO ?? 'Not recorded'} mono />
          <Detail label="Medicare Minor ID" value={location.medicareMinorId ?? 'Not recorded'} mono />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <Clock className="size-3.5" />
            Opening hours
          </p>
          {hours.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : hours.data?.length ? (
            <div className="grid gap-1 text-sm sm:grid-cols-2">
              {DAYS_OF_WEEK.map((day) => {
                const row = hours.data?.find((h) => h.dayOfWeek === day);
                return (
                  <div key={day} className="flex justify-between gap-4 py-0.5">
                    <span className="capitalize">{day}</span>
                    <span className="tabular text-muted-foreground">
                      {row?.isOpen
                        ? `${row.opensAt?.slice(0, 5)}–${row.closesAt?.slice(0, 5)}${
                            row.breakStartsAt
                              ? ` (closed ${row.breakStartsAt.slice(0, 5)}–${row.breakEndsAt?.slice(0, 5)})`
                              : ''
                          }`
                        : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Not recorded yet.</p>
          )}
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
            <PhoneCall className="size-3.5" />
            After hours (RACGP GP1.3)
          </p>
          {location.afterHoursArrangement ? (
            <p className="text-sm">
              {
                AFTER_HOURS_ARRANGEMENT_LABELS[
                  location.afterHoursArrangement as AfterHoursArrangement
                ]
              }
              {location.afterHoursProviderName ? ` — ${location.afterHoursProviderName}` : ''}
              {location.afterHoursContact ? ` · ${location.afterHoursContact}` : ''}
            </p>
          ) : (
            <p className="text-warning text-sm">
              Not recorded. Patients must be told how to get care when you are closed.
            </p>
          )}
        </div>

        {facilities.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase">
                <Accessibility className="size-3.5" />
                Facilities and access
              </p>
              <div className="flex flex-wrap gap-1.5">
                {facilities.map((facility) => (
                  <Badge key={facility} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-muted-foreground text-xs tracking-wide uppercase">{label}</p>
      <p className={mono ? 'tabular font-mono text-sm' : 'text-sm'}>{value}</p>
    </div>
  );
}
