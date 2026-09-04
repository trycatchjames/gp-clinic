import * as React from 'react';
import { formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { BBPIP } from '@gp/contracts';

type MyMedicareStatus = 'not_registered' | 'registration_in_progress' | 'registered';
type AccreditationStatus = 'not_accredited' | 'in_progress' | 'accredited' | 'lapsed';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { keys, useRegistrations } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup } from '@/components/patterns/form-field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

/**
 * Step 4. The programme registrations that determine what the practice can bill.
 * BBPIP is the sharp one: it requires MyMedicare and obliges 100% bulk billing of
 * eligible services, so the obligation is stated before the switch is flipped.
 */
export function StepRegistrations({
  practiceId,
  onDone,
}: {
  practiceId: string;
  onDone: () => void;
}) {
  const registrations = useRegistrations(practiceId);
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({
    prodaOrganisationName: '',
    myMedicareStatus: 'not_registered' as MyMedicareStatus,
    myMedicareRegisteredOn: '',
    bbpipParticipating: false,
    bbpipEffectiveFrom: '',
    accreditationStatus: 'not_accredited' as AccreditationStatus,
    accreditingBody: '',
    accreditationExpiresOn: '',
    pipParticipating: false,
    wipParticipating: false,
  });

  React.useEffect(() => {
    if (registrations.data) {
      setForm({
        prodaOrganisationName: registrations.data.prodaOrganisationName ?? '',
        myMedicareStatus: registrations.data.myMedicareStatus as MyMedicareStatus,
        myMedicareRegisteredOn: registrations.data.myMedicareRegisteredOn ?? '',
        bbpipParticipating: registrations.data.bbpipParticipating,
        bbpipEffectiveFrom: registrations.data.bbpipEffectiveFrom ?? '',
        accreditationStatus: registrations.data.accreditationStatus as AccreditationStatus,
        accreditingBody: registrations.data.accreditingBody ?? '',
        accreditationExpiresOn: registrations.data.accreditationExpiresOn ?? '',
        pipParticipating: registrations.data.pipParticipating,
        wipParticipating: registrations.data.wipParticipating,
      });
    }
  }, [registrations.data]);

  const myMedicareRegistered = form.myMedicareStatus === 'registered';

  async function save() {
    setBusy(true);
    try {
      await api.updatePracticeRegistrations(practiceId, {
        prodaOrganisationName: form.prodaOrganisationName || undefined,
        myMedicareStatus: form.myMedicareStatus,
        myMedicareRegisteredOn: form.myMedicareRegisteredOn || undefined,
        bbpipParticipating: form.bbpipParticipating,
        bbpipEffectiveFrom: form.bbpipEffectiveFrom || undefined,
        accreditationStatus: form.accreditationStatus,
        accreditingBody: form.accreditingBody || undefined,
        accreditationExpiresOn: form.accreditationExpiresOn || undefined,
        pipParticipating: form.pipParticipating,
        wipParticipating: form.wipParticipating,
      });
      await queryClient.invalidateQueries({ queryKey: keys.registrations(practiceId) });
      await queryClient.invalidateQueries({ queryKey: keys.billingSettings(practiceId) });
      toast.success('Registrations saved');
      onDone();
    } catch (error) {
      toast.error('Could not save', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Field
        label="PRODA organisation name"
        htmlFor="proda"
        hint="Provider Digital Access — where your Organisation Register entry lives."
      >
        <Input
          id="proda"
          value={form.prodaOrganisationName}
          onChange={(e) => setForm((f) => ({ ...f, prodaOrganisationName: e.target.value }))}
        />
      </Field>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">MyMedicare</h3>
          <p className="text-muted-foreground text-sm">
            Voluntary patient registration with your practice. Since 1 July 2025 it gates the
            GP Chronic Condition Management Plan items, longer telehealth, and the General
            Practice in Aged Care Incentive.
          </p>
        </div>

        <FieldGroup>
          <Field label="Registration status">
            <Select
              value={form.myMedicareStatus}
              onValueChange={(value) =>
                setForm((f) => ({
                  ...f,
                  myMedicareStatus: value as MyMedicareStatus,
                  // Withdrawing MyMedicare necessarily withdraws BBPIP.
                  bbpipParticipating: value === 'registered' ? f.bbpipParticipating : false,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_registered">Not registered</SelectItem>
                <SelectItem value="registration_in_progress">Registration in progress</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Registered on" htmlFor="mmDate">
            <Input
              id="mmDate"
              type="date"
              disabled={!myMedicareRegistered}
              value={form.myMedicareRegisteredOn}
              onChange={(e) =>
                setForm((f) => ({ ...f, myMedicareRegisteredOn: e.target.value }))
              }
            />
          </Field>
        </FieldGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Bulk Billing Practice Incentive Program</h3>
          <p className="text-muted-foreground text-sm">
            From {formatDate(BBPIP.commencedOn, { style: 'long' })},
            participating practices receive an additional {BBPIP.loadingPercent}% on every
            dollar of MBS benefit earned from eligible services, split{' '}
            {BBPIP.practitionerSharePercent}/{100 - BBPIP.practitionerSharePercent} between the
            practice and the GP.
          </p>
        </div>

        {!myMedicareRegistered ? (
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>MyMedicare registration is required first</AlertTitle>
            <AlertDescription>
              A practice must be registered for MyMedicare and have added BBPIP in the
              Organisation Register before it can participate.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant={form.bbpipParticipating ? 'warning' : 'info'}>
            <ShieldCheck />
            <AlertTitle>
              Participation means bulk billing {BBPIP.requiredBulkBillingPercent}% of eligible
              services
            </AlertTitle>
            <AlertDescription>
              A single privately billed eligible service puts the incentive at risk. Once you
              opt in, your billing policy is set to bulk bill everything, and the billing screen
              will warn before anyone raises a private invoice for an eligible service.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between rounded-md border px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="bbpip">Participate in BBPIP</Label>
            <p className="text-muted-foreground text-xs">
              Optional. You can opt out at any time.
            </p>
          </div>
          <Switch
            id="bbpip"
            checked={form.bbpipParticipating}
            disabled={!myMedicareRegistered}
            onCheckedChange={(checked) =>
              setForm((f) => ({
                ...f,
                bbpipParticipating: checked,
                bbpipEffectiveFrom:
                  checked && !f.bbpipEffectiveFrom
                    ? new Date().toISOString().slice(0, 10)
                    : f.bbpipEffectiveFrom,
              }))
            }
          />
        </div>

        {form.bbpipParticipating && (
          <Field label="Effective from" htmlFor="bbpipFrom">
            <Input
              id="bbpipFrom"
              type="date"
              value={form.bbpipEffectiveFrom}
              onChange={(e) => setForm((f) => ({ ...f, bbpipEffectiveFrom: e.target.value }))}
            />
          </Field>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Accreditation and incentives</h3>
          <p className="text-muted-foreground text-sm">
            Accreditation against the RACGP Standards (5th edition) is required for most
            incentive programs.
          </p>
        </div>

        <FieldGroup columns={3}>
          <Field label="Accreditation status">
            <Select
              value={form.accreditationStatus}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, accreditationStatus: value as AccreditationStatus }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_accredited">Not accredited</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="accredited">Accredited</SelectItem>
                <SelectItem value="lapsed">Lapsed</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Accrediting body" htmlFor="body">
            <Input
              id="body"
              placeholder="AGPAL or QPA"
              value={form.accreditingBody}
              onChange={(e) => setForm((f) => ({ ...f, accreditingBody: e.target.value }))}
            />
          </Field>
          <Field label="Certificate expires" htmlFor="accExpiry">
            <Input
              id="accExpiry"
              type="date"
              value={form.accreditationExpiresOn}
              onChange={(e) =>
                setForm((f) => ({ ...f, accreditationExpiresOn: e.target.value }))
              }
            />
          </Field>
        </FieldGroup>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <Label htmlFor="pip">Practice Incentives Program</Label>
            <Switch
              id="pip"
              checked={form.pipParticipating}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, pipParticipating: checked }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border px-4 py-3">
            <Label htmlFor="wip">Workforce Incentive Program</Label>
            <Switch
              id="wip"
              checked={form.wipParticipating}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, wipParticipating: checked }))}
            />
          </div>
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
