import * as React from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  ENTITY_TYPE_LABELS,
  ENTITY_TYPES,
  PRACTICE_TYPES,
  PRACTICE_TYPE_LABELS,
  isValidAbn,
  type EntityType,
  type PracticeType,
} from '@gp/contracts';
import { api, describeError, fieldErrors } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { usePractice } from '@/lib/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup } from '@/components/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Step 1. Creates the practice if there isn't one; edits it if there is.
 * The ABN is checksum-validated on the client too, so a typo is caught while the
 * card is still in the user's hand.
 */
export function StepIdentity({
  practiceId,
  onDone,
}: {
  practiceId: string | null;
  onDone: () => void;
}) {
  const { refreshUser } = useAuth();
  const existing = usePractice(practiceId ?? '');
  const [busy, setBusy] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [noAbn, setNoAbn] = React.useState(false);
  const [form, setForm] = React.useState({
    legalName: '',
    tradingName: '',
    entityType: 'company' as EntityType,
    practiceType: 'general_practice' as PracticeType,
    abn: '',
    acn: '',
    contactEmail: '',
    contactPhone: '',
  });

  React.useEffect(() => {
    if (practiceId && existing.data) {
      setForm({
        legalName: existing.data.legalName,
        tradingName: existing.data.tradingName,
        entityType: existing.data.entityType as EntityType,
        practiceType: existing.data.practiceType as PracticeType,
        abn: existing.data.abn ?? '',
        acn: existing.data.acn ?? '',
        contactEmail: existing.data.contactEmail ?? '',
        contactPhone: existing.data.contactPhone ?? '',
      });
      setNoAbn(!existing.data.abn);
    }
  }, [practiceId, existing.data]);

  const set =
    <K extends keyof typeof form>(key: K) =>
    (value: (typeof form)[K]) =>
      setForm((f) => ({ ...f, [key]: value }));

  const abnTouched = form.abn.replace(/\s/g, '').length > 0;
  const abnLooksWrong = abnTouched && !isValidAbn(form.abn);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const payload = {
      legalName: form.legalName,
      tradingName: form.tradingName,
      entityType: form.entityType,
      practiceType: form.practiceType,
      abn: noAbn || !form.abn ? undefined : form.abn.replace(/\s/g, ''),
      acn: form.entityType === 'company' && form.acn ? form.acn.replace(/\s/g, '') : undefined,
      contactEmail: form.contactEmail || undefined,
      contactPhone: form.contactPhone || undefined,
    };
    try {
      if (practiceId) {
        await api.updatePractice(practiceId, payload);
      } else {
        await api.createPractice(payload);
        await refreshUser();
      }
      onDone();
    } catch (error) {
      setErrors(fieldErrors(error));
      toast.error('Could not save the practice', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FieldGroup>
        <Field
          label="Legal entity name"
          htmlFor="legalName"
          required
          hint="The name on your ABN registration."
        >
          <Input
            id="legalName"
            required
            value={form.legalName}
            onChange={(e) => set('legalName')(e.target.value)}
            placeholder="Raman Family Medicine Pty Ltd"
          />
        </Field>
        <Field
          label="Trading name"
          htmlFor="tradingName"
          required
          hint="What patients call you. Appears on invoices and the appointment book."
        >
          <Input
            id="tradingName"
            required
            value={form.tradingName}
            onChange={(e) => set('tradingName')(e.target.value)}
            placeholder="Brunswick Family Practice"
          />
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field label="Entity type" required>
          <Select
            value={form.entityType}
            onValueChange={(value) => set('entityType')(value as EntityType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {ENTITY_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Practice type" required>
          <Select
            value={form.practiceType}
            onValueChange={(value) => set('practiceType')(value as PracticeType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRACTICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {PRACTICE_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <FieldGroup>
        <Field
          label="ABN"
          htmlFor="abn"
          error={errors.abn ?? (abnLooksWrong ? 'This ABN is not valid — please check the digits' : undefined)}
          hint="Checked against the ATO checksum so a mistyped digit is caught now."
        >
          <Input
            id="abn"
            inputMode="numeric"
            disabled={noAbn}
            value={form.abn}
            onChange={(e) => set('abn')(e.target.value)}
            aria-invalid={abnLooksWrong}
            placeholder="51 824 753 556"
            className="tabular"
          />
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="noAbn"
              checked={noAbn}
              onCheckedChange={(checked) => {
                setNoAbn(checked === true);
                if (checked) set('abn')('');
              }}
            />
            <Label htmlFor="noAbn" className="text-muted-foreground text-xs font-normal">
              I don't have an ABN yet
            </Label>
          </div>
        </Field>

        {form.entityType === 'company' && (
          <Field label="ACN" htmlFor="acn" error={errors.acn}>
            <Input
              id="acn"
              inputMode="numeric"
              value={form.acn}
              onChange={(e) => set('acn')(e.target.value)}
              placeholder="004 085 616"
              className="tabular"
            />
          </Field>
        )}
      </FieldGroup>

      <FieldGroup>
        <Field label="Practice email" htmlFor="contactEmail">
          <Input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set('contactEmail')(e.target.value)}
          />
        </Field>
        <Field label="Practice phone" htmlFor="contactPhone">
          <Input
            id="contactPhone"
            value={form.contactPhone}
            onChange={(e) => set('contactPhone')(e.target.value)}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={busy || (abnLooksWrong && !noAbn)}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {practiceId ? 'Save and continue' : 'Create practice'}
        </Button>
      </div>
    </form>
  );
}
