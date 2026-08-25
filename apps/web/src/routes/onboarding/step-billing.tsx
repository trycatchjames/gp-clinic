import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';
import {
  BILLING_COHORTS,
  BILLING_COHORT_LABELS,
  BILLING_POLICIES,
  BILLING_POLICY_DESCRIPTIONS,
  BILLING_POLICY_LABELS,
  formatCurrency,
  type BillingPolicy,
} from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { keys, useBillingSettings, useFeeSchedules } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Field } from '@/components/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

/** Step 7. Billing policy and the generated fee schedules. */
export function StepBilling({ practiceId, onDone }: { practiceId: string; onDone: () => void }) {
  const settings = useBillingSettings(practiceId);
  const schedules = useFeeSchedules(practiceId);
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const [policy, setPolicy] = React.useState<BillingPolicy>('mixed');
  const [multiplier, setMultiplier] = React.useState(1.75);
  const [cohorts, setCohorts] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (settings.data) {
      setPolicy(settings.data.billingPolicy as BillingPolicy);
      setMultiplier(settings.data.privateFeeMultiplier / 10000);
      setCohorts(settings.data.bulkBillCohorts);
    }
  }, [settings.data]);

  const locked = settings.data?.policyLockedByBbpip ?? false;

  async function save() {
    setBusy(true);
    try {
      await api.updateBillingSettings(practiceId, {
        billingPolicy: locked ? undefined : policy,
        privateFeeMultiplier: Math.round(multiplier * 10000),
        bulkBillCohorts: cohorts,
      });
      await queryClient.invalidateQueries({ queryKey: keys.billingSettings(practiceId) });
      await queryClient.invalidateQueries({ queryKey: keys.feeSchedules(practiceId) });
      toast.success('Billing setup saved');
      onDone();
    } catch (error) {
      toast.error('Could not save billing setup', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  // A worked example makes the multiplier concrete: MBS item 23 at 100% benefit.
  const exampleBenefitCents = 4505;
  const exampleFeeCents = Math.round((exampleBenefitCents * multiplier) / 500) * 500;

  return (
    <div className="space-y-6">
      {locked && (
        <Alert variant="warning">
          <Lock />
          <AlertTitle>Your billing policy is set by BBPIP participation</AlertTitle>
          <AlertDescription>
            Participating practices must bulk bill 100% of eligible services. Withdraw from the
            Bulk Billing Practice Incentive Program in the previous step to change this.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <h3 className="font-medium">How do you bill?</h3>
        <RadioGroup
          value={policy}
          onValueChange={(value) => setPolicy(value as BillingPolicy)}
          disabled={locked}
        >
          {BILLING_POLICIES.map((option) => (
            <label
              key={option}
              className="hover:bg-accent/40 flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors has-[:checked]:border-primary"
            >
              <RadioGroupItem value={option} className="mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{BILLING_POLICY_LABELS[option]}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {BILLING_POLICY_DESCRIPTIONS[option]}
                </p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {policy === 'mixed' && (
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">Who do you bulk bill?</h3>
            <p className="text-muted-foreground text-sm">
              These resolve into a suggested payer at billing time. The biller can always
              override with a reason.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {BILLING_COHORTS.map((cohort) => (
              <label
                key={cohort}
                className="hover:bg-accent/40 flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm"
              >
                <Checkbox
                  checked={cohorts.includes(cohort)}
                  onCheckedChange={(checked) =>
                    setCohorts((current) =>
                      checked ? [...current, cohort] : current.filter((c) => c !== cohort),
                    )
                  }
                />
                {BILLING_COHORT_LABELS[cohort]}
              </label>
            ))}
          </div>
        </div>
      )}

      {policy !== 'bulk_bill_all' && (
        <div className="space-y-3">
          <h3 className="font-medium">Private fees</h3>
          <div className="grid items-end gap-4 sm:grid-cols-2">
            <Field
              label="Fee multiplier"
              htmlFor="multiplier"
              hint="Private fees are generated as the MBS schedule fee × this multiplier, rounded to the nearest $5. You can override individual items later."
            >
              <Input
                id="multiplier"
                type="number"
                step="0.05"
                min="1"
                max="5"
                className="tabular"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value) || 1)}
              />
            </Field>
            <Card>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  Worked example — item 23
                </p>
                <div className="tabular flex justify-between">
                  <span>Your fee</span>
                  <span className="font-medium">{formatCurrency(exampleFeeCents)}</span>
                </div>
                <div className="tabular text-muted-foreground flex justify-between">
                  <span>Medicare benefit</span>
                  <span>{formatCurrency(exampleBenefitCents)}</span>
                </div>
                <Separator className="my-1" />
                <div className="tabular flex justify-between text-base">
                  <span className="font-medium">Patient pays</span>
                  <span className="font-semibold">
                    {formatCurrency(Math.max(0, exampleFeeCents - exampleBenefitCents))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-2">
        <h3 className="font-medium">Fee schedules</h3>
        <p className="text-muted-foreground text-sm">
          Created for you from the MBS catalogue. Bulk Bill and DVA are locked to their external
          schedules.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {schedules.data?.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between rounded-md border px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{schedule.name}</p>
                <p className="text-muted-foreground text-xs">{schedule.itemCount} items</p>
              </div>
              {schedule.isEditable ? (
                <Badge variant="secondary">Editable</Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <Lock className="size-3" />
                  Fixed
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => void save()} disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          Save and continue
        </Button>
      </div>
    </div>
  );
}
