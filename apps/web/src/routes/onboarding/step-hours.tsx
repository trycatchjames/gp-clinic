import * as React from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  AFTER_HOURS_ARRANGEMENTS,
  AFTER_HOURS_ARRANGEMENT_LABELS,
  DAYS_OF_WEEK,
  type AfterHoursArrangement,
  type AustralianState,
  type AustralianTimezone,
  type DayOfWeek,
} from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { keys, useBusinessHours, useLocations } from '@/lib/queries';
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
import { Field } from '@/components/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface DayRow {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
  breakStartsAt: string;
  breakEndsAt: string;
}

const DEFAULT_ROWS: DayRow[] = DAYS_OF_WEEK.map((day) => ({
  dayOfWeek: day,
  isOpen: !['saturday', 'sunday'].includes(day),
  opensAt: '08:00',
  closesAt: '18:00',
  breakStartsAt: '',
  breakEndsAt: '',
}));

/**
 * Step 3. Opening hours drive the appointment book; the after-hours arrangement is
 * required by RACGP GP1.3 and is published on the practice information sheet.
 */
export function StepHours({ practiceId, onDone }: { practiceId: string; onDone: () => void }) {
  const locations = useLocations(practiceId);
  const queryClient = useQueryClient();
  const [locationId, setLocationId] = React.useState<string | undefined>();
  const [rows, setRows] = React.useState<DayRow[]>(DEFAULT_ROWS);
  const [busy, setBusy] = React.useState(false);
  const [afterHours, setAfterHours] = React.useState({
    arrangement: '' as '' | AfterHoursArrangement,
    providerName: '',
    contact: '',
  });

  React.useEffect(() => {
    if (!locationId && locations.data?.length) setLocationId(locations.data[0].id);
  }, [locations.data, locationId]);

  const existingHours = useBusinessHours(practiceId, locationId);
  const currentLocation = locations.data?.find((l) => l.id === locationId);

  React.useEffect(() => {
    if (existingHours.data?.length) {
      setRows(
        DAYS_OF_WEEK.map((day) => {
          const found = existingHours.data.find((h) => h.dayOfWeek === day);
          return {
            dayOfWeek: day,
            isOpen: found?.isOpen ?? false,
            opensAt: found?.opensAt?.slice(0, 5) ?? '08:00',
            closesAt: found?.closesAt?.slice(0, 5) ?? '18:00',
            breakStartsAt: found?.breakStartsAt?.slice(0, 5) ?? '',
            breakEndsAt: found?.breakEndsAt?.slice(0, 5) ?? '',
          };
        }),
      );
    }
  }, [existingHours.data]);

  React.useEffect(() => {
    if (currentLocation) {
      setAfterHours({
        arrangement: (currentLocation.afterHoursArrangement as AfterHoursArrangement) ?? '',
        providerName: currentLocation.afterHoursProviderName ?? '',
        contact: currentLocation.afterHoursContact ?? '',
      });
    }
  }, [currentLocation]);

  const updateRow = (day: DayOfWeek, patch: Partial<DayRow>) =>
    setRows((current) => current.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)));

  async function save() {
    if (!locationId) return;
    setBusy(true);
    try {
      await api.setBusinessHours(practiceId, locationId, {
        days: rows.map((row) => ({
          dayOfWeek: row.dayOfWeek,
          isOpen: row.isOpen,
          opensAt: row.isOpen ? row.opensAt : undefined,
          closesAt: row.isOpen ? row.closesAt : undefined,
          breakStartsAt: row.isOpen && row.breakStartsAt ? row.breakStartsAt : undefined,
          breakEndsAt: row.isOpen && row.breakEndsAt ? row.breakEndsAt : undefined,
        })),
      });

      if (afterHours.arrangement && currentLocation) {
        await api.updateLocation(practiceId, locationId, {
          name: currentLocation.name,
          streetAddress: currentLocation.streetAddress,
          suburb: currentLocation.suburb,
          state: currentLocation.state as AustralianState,
          postcode: currentLocation.postcode,
          timezone: currentLocation.timezone as AustralianTimezone,
          afterHoursArrangement: afterHours.arrangement,
          afterHoursProviderName: afterHours.providerName || undefined,
          afterHoursContact: afterHours.contact || undefined,
        });
      }

      await queryClient.invalidateQueries({ queryKey: keys.locations(practiceId) });
      await queryClient.invalidateQueries({
        queryKey: keys.businessHours(practiceId, locationId),
      });
      toast.success('Hours saved');
      onDone();
    } catch (error) {
      toast.error('Could not save the hours', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {(locations.data?.length ?? 0) > 1 && (
        <Field label="Location">
          <Select value={locationId} onValueChange={setLocationId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.data?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.dayOfWeek}
            className="grid grid-cols-[7rem_auto_1fr] items-center gap-3 rounded-md border px-3 py-2"
          >
            <span className="text-sm font-medium capitalize">{row.dayOfWeek}</span>
            <Switch
              checked={row.isOpen}
              onCheckedChange={(checked) => updateRow(row.dayOfWeek, { isOpen: checked })}
              aria-label={`Open on ${row.dayOfWeek}`}
            />
            {row.isOpen ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="time"
                  className="tabular w-28"
                  value={row.opensAt}
                  onChange={(e) => updateRow(row.dayOfWeek, { opensAt: e.target.value })}
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="time"
                  className="tabular w-28"
                  value={row.closesAt}
                  onChange={(e) => updateRow(row.dayOfWeek, { closesAt: e.target.value })}
                />
                <span className="text-muted-foreground ml-2 text-xs">break</span>
                <Input
                  type="time"
                  className="tabular w-28"
                  value={row.breakStartsAt}
                  onChange={(e) => updateRow(row.dayOfWeek, { breakStartsAt: e.target.value })}
                />
                <Input
                  type="time"
                  className="tabular w-28"
                  value={row.breakEndsAt}
                  onChange={(e) => updateRow(row.dayOfWeek, { breakEndsAt: e.target.value })}
                />
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Closed</span>
            )}
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <Alert variant="info">
          <AlertTitle>Care outside opening hours</AlertTitle>
          <AlertDescription>
            RACGP GP1.3 requires the practice to have arrangements for care outside normal
            opening hours, and C1.1 requires patients to be told what they are. What you record
            here is published on your practice information sheet.
          </AlertDescription>
        </Alert>

        <Field label="After-hours arrangement">
          <Select
            value={afterHours.arrangement}
            onValueChange={(value) =>
              setAfterHours((a) => ({ ...a, arrangement: value as AfterHoursArrangement }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an arrangement" />
            </SelectTrigger>
            <SelectContent>
              {AFTER_HOURS_ARRANGEMENTS.map((arrangement) => (
                <SelectItem key={arrangement} value={arrangement}>
                  {AFTER_HOURS_ARRANGEMENT_LABELS[arrangement]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {afterHours.arrangement && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={
                afterHours.arrangement === 'hospital_ed_referral'
                  ? 'Hospital name'
                  : 'Service or co-op name'
              }
              htmlFor="ahProvider"
            >
              <Input
                id="ahProvider"
                value={afterHours.providerName}
                onChange={(e) =>
                  setAfterHours((a) => ({ ...a, providerName: e.target.value }))
                }
              />
            </Field>
            <Field label="Contact number or address" htmlFor="ahContact">
              <Input
                id="ahContact"
                value={afterHours.contact}
                onChange={(e) => setAfterHours((a) => ({ ...a, contact: e.target.value }))}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => void save()} disabled={busy || !locationId}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          Save and continue
        </Button>
      </div>
    </div>
  );
}
