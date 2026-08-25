import { Button } from '@/components/ui/button';
import { useAppointmentTypes } from '@/lib/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

/**
 * Step 6. The seeded types reflect how Australian practices actually run their
 * books. The default MBS item is a billing *suggestion* — nothing bills itself.
 */
export function StepBooking({ practiceId, onDone }: { practiceId: string; onDone: () => void }) {
  const types = useAppointmentTypes(practiceId);

  return (
    <div className="space-y-5">
      <Alert variant="info">
        <Info />
        <AlertTitle>These are ready to use, and you can change any of them</AlertTitle>
        <AlertDescription>
          The MBS item shown against each type is a suggestion used to pre-fill the billing
          screen at the end of a consultation. Nothing is ever billed automatically — the
          practitioner always confirms.
        </AlertDescription>
      </Alert>

      {types.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment type</TableHead>
                <TableHead className="w-24">Minutes</TableHead>
                <TableHead className="w-28">MBS item</TableHead>
                <TableHead className="w-40">Online</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.data?.map((type) => (
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
                  <TableCell className="tabular">{type.durationMinutes}</TableCell>
                  <TableCell className="tabular">
                    {type.defaultMbsItemNumber ?? <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {type.requiresTriagePrompt ? (
                      <Badge variant="warning">Triage required</Badge>
                    ) : type.onlineBookable ? (
                      <Badge variant="secondary">Bookable</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Phone only</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onDone}>Continue</Button>
      </div>
    </div>
  );
}
