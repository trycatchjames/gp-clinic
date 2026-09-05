import * as React from 'react';
import { Search, Info } from 'lucide-react';
import { useMbsItems } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';

/** The MBS catalogue, with the rules that gate each item made visible. */
export function MbsRoute() {
  const [search, setSearch] = React.useState('');
  const items = useMbsItems(search || undefined);
  const itemData = items.data;

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof itemData>();
    for (const item of itemData ?? []) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list as never);
    }
    return [...map.entries()];
  }, [itemData]);

  return (
    <>
      <PageHeader
        title="MBS reference"
        description="A working subset of the Medicare Benefits Schedule, sufficient to demonstrate the billing workflows."
      />

      <Alert variant="info">
        <Info />
        <AlertTitle>Not an authoritative MBS</AlertTitle>
        <AlertDescription>
          Fees here are indicative. The authoritative source is mbsonline.gov.au, and the
          schedule is reindexed at least annually. A real deployment ingests the published MBS
          and updates on each release; items are versioned by effective date so historical
          invoices never reprice.
        </AlertDescription>
      </Alert>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search item number or description"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {items.isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <div className="space-y-6">
          {groups.map(([group, groupItems]) => (
            <Card key={group}>
              <CardContent className="space-y-2">
                <h2 className="text-sm font-semibold">{group}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Item</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-32">Duration</TableHead>
                      <TableHead className="w-28 text-right">Schedule fee</TableHead>
                      <TableHead className="w-28 text-right">Benefit</TableHead>
                      <TableHead className="w-56">Rules</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupItems?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="tabular font-mono font-medium">
                          {item.itemNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.description}
                          {item.notes && (
                            <p className="text-muted-foreground mt-0.5 text-xs">{item.notes}</p>
                          )}
                        </TableCell>
                        <TableCell className="tabular text-muted-foreground text-xs">
                          {formatDuration(item.minMinutes, item.maxMinutes)}
                        </TableCell>
                        <TableCell className="tabular text-right">
                          {formatCurrency(item.scheduleFeeCents)}
                        </TableCell>
                        <TableCell className="tabular text-right">
                          {formatCurrency(item.benefitCents)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.requiresMentalHealthSkillsTraining && (
                              <Badge variant="warning">Requires MHST</Badge>
                            )}
                            {item.requiresMyMedicare && (
                              <Badge variant="info">MyMedicare</Badge>
                            )}
                            {item.bulkBillIncentiveEligible && (
                              <Badge variant="secondary">Incentive eligible</Badge>
                            )}
                            {item.frequencyLimitMonths && (
                              <Badge variant="outline">
                                Every {item.frequencyLimitMonths}m
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function formatDuration(min: number | null | undefined, max: number | null | undefined): string {
  if (min && max) return `${min}–${max} min`;
  if (min) return `${min}+ min`;
  if (max) return `under ${max} min`;
  return '—';
}
