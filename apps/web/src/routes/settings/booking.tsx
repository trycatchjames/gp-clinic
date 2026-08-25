import { usePracticeId } from '@/lib/auth';
import { useAppointmentTypes, useSessionTemplates } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DAYS_OF_WEEK } from '@gp/contracts';

export function BookingSettingsRoute() {
  const practiceId = usePracticeId();
  const types = useAppointmentTypes(practiceId);
  const sessions = useSessionTemplates(practiceId);

  return (
    <>
      <PageHeader
        title="Booking setup"
        description="What can be booked, for how long, and who is available. The default MBS item on a type is a suggestion used to pre-fill billing — it never bills on its own."
      />

      <Card>
        <CardHeader>
          <CardTitle>Appointment types</CardTitle>
          <CardDescription>
            Seeded with defaults that reflect how Australian practices actually run their books.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {types.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-20">Code</TableHead>
                  <TableHead className="w-24">Minutes</TableHead>
                  <TableHead className="w-28">MBS item</TableHead>
                  <TableHead className="w-44">Booking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.data
                  ?.filter((type) => type.isActive)
                  .map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: type.colour }}
                          />
                          <div>
                            <p className="font-medium">{type.name}</p>
                            {type.description && (
                              <p className="text-muted-foreground text-xs">{type.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {type.shortCode}
                      </TableCell>
                      <TableCell className="tabular">{type.durationMinutes}</TableCell>
                      <TableCell className="tabular">
                        {type.defaultMbsItemNumber ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {type.requiresTriagePrompt ? (
                          <Badge variant="warning">Triage required</Badge>
                        ) : type.onlineBookable ? (
                          <Badge variant="secondary">Online</Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Phone only</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practitioner availability</CardTitle>
          <CardDescription>
            A session is a window with a slot size, not a list of pre-cut slots — so a 30-minute
            appointment consumes two 15-minute slots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : sessions.data?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No sessions configured yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practitioner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="w-20">Slot</TableHead>
                  <TableHead className="w-20">Slots</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...(sessions.data ?? [])]
                  .sort(
                    (a, b) =>
                      a.practitionerName.localeCompare(b.practitionerName) ||
                      DAYS_OF_WEEK.indexOf(a.dayOfWeek as never) -
                        DAYS_OF_WEEK.indexOf(b.dayOfWeek as never),
                  )
                  .map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.practitionerName}</TableCell>
                      <TableCell>{session.locationName}</TableCell>
                      <TableCell className="capitalize">{session.dayOfWeek}</TableCell>
                      <TableCell className="tabular">
                        {session.startsAt}–{session.endsAt}
                      </TableCell>
                      <TableCell className="tabular">{session.slotMinutes}m</TableCell>
                      <TableCell className="tabular">{session.slotCount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
