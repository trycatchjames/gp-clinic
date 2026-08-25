import { TriangleAlert, GraduationCap } from 'lucide-react';
import { usePracticeId } from '@/lib/auth';
import { usePractitioners } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export function PractitionersSettingsRoute() {
  const practiceId = usePracticeId();
  const practitioners = usePractitioners(practiceId);

  if (practitioners.isLoading) return <Skeleton className="h-96 w-full" />;

  const withWarnings = (practitioners.data ?? []).filter((p) => p.warnings.length > 0);

  return (
    <>
      <PageHeader
        title="Practitioners"
        description="Credentials, provider numbers and supervision. RACGP GP3.1 requires the practice to hold evidence of qualifications, registration and training for its clinical team."
      />

      {withWarnings.length > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-4">
              {withWarnings.flatMap((p) =>
                p.warnings.map((warning) => (
                  <li key={`${p.id}-${warning}`}>
                    <span className="font-medium">{p.displayName}</span> — {warning}
                  </li>
                )),
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {practitioners.data?.map((practitioner) => (
          <Card key={practitioner.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>{practitioner.displayName}</CardTitle>
                  <CardDescription>{practitioner.kindLabel}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {!practitioner.isActive && <Badge variant="outline">Inactive</Badge>}
                  {practitioner.vocationalRegistration && (
                    <Badge variant="secondary">Vocationally registered</Badge>
                  )}
                  {practitioner.mentalHealthSkillsTraining ? (
                    <Badge variant="info" className="gap-1">
                      <GraduationCap className="size-3" />
                      MHST
                    </Badge>
                  ) : practitioner.kind === 'gp' || practitioner.kind === 'gp_registrar' ? (
                    <Badge variant="outline">No MHST — 2700/2701 only</Badge>
                  ) : null}
                  {practitioner.isSupervisor && <Badge variant="secondary">Supervisor</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
                <Detail
                  label="AHPRA registration"
                  value={practitioner.ahpraRegistrationNumber ?? '—'}
                  mono
                />
                <Detail
                  label="Registration expires"
                  value={formatDate(practitioner.ahpraExpiresOn)}
                />
                <Detail label="Prescriber number" value={practitioner.prescriberNumber ?? '—'} mono />
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Medicare provider numbers — one per location
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Provider number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {practitioner.providerNumbers.map((entry) => (
                      <TableRow key={entry.locationId}>
                        <TableCell>{entry.locationName}</TableCell>
                        <TableCell className="tabular font-mono">
                          {entry.providerNumber ?? (
                            <span className="text-warning font-sans">Not set</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {practitioner.supervision && (
                <div className="bg-muted/50 space-y-1 rounded-md p-3 text-sm">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Supervision
                  </p>
                  <p>
                    Supervised by{' '}
                    <span className="font-medium">{practitioner.supervision.supervisorName}</span>{' '}
                    · {practitioner.supervision.supervisionLevel} ·{' '}
                    {practitioner.supervision.trainingTerm ?? 'term not recorded'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(practitioner.supervision.effectiveFrom)} to{' '}
                    {formatDate(practitioner.supervision.effectiveTo)}
                    {practitioner.supervision.requiresOnSiteSupervisor &&
                      ' · requires a supervisor rostered on site'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
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
