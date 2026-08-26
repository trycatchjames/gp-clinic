import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, MapPin } from 'lucide-react';
import {
  AUSTRALIAN_STATES,
  AUSTRALIAN_TIMEZONES,
  DEFAULT_TIMEZONE_BY_STATE,
  type AustralianState,
  type AustralianTimezone,
} from '@gp/contracts';
import { api, describeError } from '@/lib/api';
import { useLocations } from '@/lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { keys } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup } from '@/components/patterns/form-field';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/** Step 2. Provider numbers, books, banking and fee schedules all hang off a location. */
export function StepLocation({
  practiceId,
  onDone,
}: {
  practiceId: string;
  onDone: () => void;
}) {
  const locations = useLocations(practiceId);
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    streetAddress: '',
    suburb: '',
    state: 'VIC' as AustralianState,
    postcode: '',
    timezone: 'Australia/Melbourne' as AustralianTimezone,
    phone: '',
    fax: '',
    hpiO: '',
    medicareMinorId: '',
  });

  const set =
    <K extends keyof typeof form>(key: K) =>
    (value: (typeof form)[K]) =>
      setForm((f) => ({ ...f, [key]: value }));

  // Offered as a default when the state changes, never forced — Broken Hill exists.
  const onStateChange = (value: string) => {
    const state = value as AustralianState;
    setForm((f) => ({
      ...f,
      state,
      timezone: DEFAULT_TIMEZONE_BY_STATE[state] ?? f.timezone,
    }));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.createLocation(practiceId, {
        ...form,
        phone: form.phone || undefined,
        fax: form.fax || undefined,
        hpiO: form.hpiO || undefined,
        medicareMinorId: form.medicareMinorId || undefined,
        isPrimary: (locations.data?.length ?? 0) === 0,
      });
      await queryClient.invalidateQueries({ queryKey: keys.locations(practiceId) });
      setForm((f) => ({ ...f, name: '', streetAddress: '', suburb: '', postcode: '', hpiO: '', medicareMinorId: '' }));
      toast.success('Location added');
    } catch (error) {
      toast.error('Could not add the location', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  const existing = locations.data ?? [];

  return (
    <div className="space-y-6">
      {existing.length > 0 && (
        <div className="space-y-2">
          {existing.map((location) => (
            <Card key={location.id}>
              <CardContent className="flex items-start gap-3">
                <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{location.name}</p>
                    {location.isPrimary && <Badge variant="secondary">Main site</Badge>}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {location.streetAddress}, {location.suburb} {location.state}{' '}
                    {location.postcode}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {location.timezone}
                    {location.hpiO ? ` · HPI-O ${location.hpiO}` : ' · No HPI-O yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <Field label="Location name" htmlFor="name" required hint="How your team refers to this site.">
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            placeholder="Brunswick"
          />
        </Field>

        <Field label="Street address" htmlFor="streetAddress" required>
          <Input
            id="streetAddress"
            required
            value={form.streetAddress}
            onChange={(e) => set('streetAddress')(e.target.value)}
            placeholder="142 Sydney Road"
          />
        </Field>

        <FieldGroup columns={3}>
          <Field label="Suburb" htmlFor="suburb" required>
            <Input
              id="suburb"
              required
              value={form.suburb}
              onChange={(e) => set('suburb')(e.target.value)}
            />
          </Field>
          <Field label="State" required>
            <Select value={form.state} onValueChange={onStateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUSTRALIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Postcode" htmlFor="postcode" required>
            <Input
              id="postcode"
              required
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              className="tabular"
              value={form.postcode}
              onChange={(e) => set('postcode')(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <Field
          label="Timezone"
          required
          hint="Chosen explicitly rather than guessed from the state — a group practice can span states, and Broken Hill runs on its own time."
        >
          <Select
            value={form.timezone}
            onValueChange={(value) => set('timezone')(value as AustralianTimezone)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUSTRALIAN_TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace('Australia/', '').replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <FieldGroup>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" value={form.phone} onChange={(e) => set('phone')(e.target.value)} />
          </Field>
          <Field
            label="Fax"
            htmlFor="fax"
            hint="Still real in this industry — pathology and hospitals use it."
          >
            <Input id="fax" value={form.fax} onChange={(e) => set('fax')(e.target.value)} />
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field
            label="HPI-O"
            htmlFor="hpiO"
            hint="Healthcare Provider Identifier — Organisation. Needed for eScripts and My Health Record. You can add it later."
          >
            <Input
              id="hpiO"
              className="tabular"
              value={form.hpiO}
              onChange={(e) => set('hpiO')(e.target.value)}
            />
          </Field>
          <Field
            label="Medicare Minor ID"
            htmlFor="medicareMinorId"
            hint="Used for claiming and banking at this site."
          >
            <Input
              id="medicareMinorId"
              className="tabular"
              value={form.medicareMinorId}
              onChange={(e) => set('medicareMinorId')(e.target.value)}
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-between">
          <Button type="submit" variant="outline" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            Add location
          </Button>
          <Button type="button" onClick={onDone} disabled={existing.length === 0}>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
