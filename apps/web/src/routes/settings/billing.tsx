import * as React from 'react';
import { toast } from 'sonner';
import { Lock, Search } from 'lucide-react';
import { BILLING_POLICY_LABELS, BILLING_COHORT_LABELS, type BillingCohort, type BillingPolicy } from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { usePracticeId } from '@/lib/auth';
import { keys, useBillingSettings, useFeeScheduleItems, useFeeSchedules } from '@/lib/queries';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export function BillingSettingsRoute() {
  const practiceId = usePracticeId();
  const settings = useBillingSettings(practiceId);
  const schedules = useFeeSchedules(practiceId);
  const queryClient = useQueryClient();
  const [scheduleId, setScheduleId] = React.useState<string | undefined>();
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (!scheduleId && schedules.data?.length) setScheduleId(schedules.data[0].id);
  }, [schedules.data, scheduleId]);

  const items = useFeeScheduleItems(practiceId, scheduleId, search || undefined);
  const currentSchedule = schedules.data?.find((s) => s.id === scheduleId);

  async function updateFee(itemId: string, dollars: string) {
    if (!scheduleId) return;
    const cents = Math.round(Number(dollars) * 100);
    if (!Number.isFinite(cents) || cents < 0) return;
    try {
      await api.updateFeeScheduleItem(practiceId, scheduleId, itemId, { feeCents: cents });
      await queryClient.invalidateQueries({
        queryKey: keys.feeScheduleItems(practiceId, scheduleId, search || undefined),
      });
      toast.success('Fee updated');
    } catch (error) {
      toast.error('Could not update the fee', { description: describeError(error) });
    }
  }

  return (
    <>
      <PageHeader
        title="Billing and fees"
        description="The gap is what the patient actually experiences, and what RACGP C1.5 requires you to disclose before the service — so it is shown next to every fee."
      />

      <Card>
        <CardHeader>
          <CardTitle>Billing policy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {settings.isLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">Policy</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {BILLING_POLICY_LABELS[settings.data?.billingPolicy as BillingPolicy] ?? '—'}
                  </p>
                  {settings.data?.policyLockedByBbpip && (
                    <Badge variant="warning" className="gap-1">
                      <Lock className="size-3" />
                      Locked by BBPIP
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  Private multiplier
                </p>
                <p className="tabular font-medium">
                  {((settings.data?.privateFeeMultiplier ?? 0) / 10000).toFixed(2)}×
                </p>
              </div>
              {(settings.data?.bulkBillCohorts.length ?? 0) > 0 && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    Bulk billed cohorts
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {settings.data?.bulkBillCohorts.map((cohort) => (
                      <Badge key={cohort} variant="secondary">
                        {BILLING_COHORT_LABELS[cohort as BillingCohort] ?? cohort}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div>
              <CardTitle>Fee schedules</CardTitle>
              <CardDescription>
                Bulk Bill and DVA are locked to their external schedules and cannot be edited.
              </CardDescription>
            </div>
            {schedules.data && (
              <Tabs value={scheduleId} onValueChange={setScheduleId}>
                <TabsList>
                  {schedules.data.map((schedule) => (
                    <TabsTrigger key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
            <div className="relative max-w-sm">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search item number or description"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Item</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-32 text-right">Fee</TableHead>
                  <TableHead className="w-32 text-right">Benefit</TableHead>
                  <TableHead className="w-32 text-right">Patient gap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.data?.slice(0, 80).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="tabular font-mono">{item.itemCode}</TableCell>
                    <TableCell className="text-sm">{item.description}</TableCell>
                    <TableCell className="text-right">
                      {currentSchedule?.isEditable ? (
                        <Input
                          className="tabular ml-auto h-8 w-24 text-right"
                          defaultValue={(item.feeCents / 100).toFixed(2)}
                          onBlur={(e) => {
                            if (
                              Math.round(Number(e.target.value) * 100) !== item.feeCents
                            ) {
                              void updateFee(item.id, e.target.value);
                            }
                          }}
                        />
                      ) : (
                        <span className="tabular">{formatCurrency(item.feeCents)}</span>
                      )}
                    </TableCell>
                    <TableCell className="tabular text-muted-foreground text-right">
                      {formatCurrency(item.benefitCents)}
                    </TableCell>
                    <TableCell className="tabular text-right font-semibold">
                      {formatCurrency(item.gapCents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {(items.data?.length ?? 0) > 80 && (
            <p className="text-muted-foreground pt-3 text-xs">
              Showing the first 80 of {items.data?.length}. Search to narrow the list.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
