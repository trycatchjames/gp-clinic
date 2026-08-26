import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, TriangleAlert, UserPlus } from 'lucide-react';
import {
  PRACTITIONER_KINDS,
  PRACTITIONER_KIND_LABELS,
  PRACTICE_ROLES,
  ROLE_LABELS,
  type PractitionerKind,
  type PracticeRole,
} from '@gp/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { api, describeError } from '@/lib/api';
import { keys, useLocations, usePractitioners } from '@/lib/queries';
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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Step 5. Practitioners, and their provider numbers per location — modelled as a
 * matrix rather than a single field, because that is how Medicare issues them.
 */
export function StepTeam({ practiceId, onDone }: { practiceId: string; onDone: () => void }) {
  const practitioners = usePractitioners(practiceId);
  const locations = useLocations(practiceId);
  const queryClient = useQueryClient();
  const [busy, setBusy] = React.useState(false);
  const [inviting, setInviting] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    title: 'Dr',
    givenName: '',
    familyName: '',
    kind: 'gp' as PractitionerKind,
    ahpraRegistrationNumber: '',
    prescriberNumber: '',
    vocationalRegistration: true,
    mentalHealthSkillsTraining: false,
    isSupervisor: false,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: keys.practitioners(practiceId) });

  async function addPractitioner(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.createPractitioner(practiceId, {
        ...form,
        title: form.title || undefined,
        ahpraRegistrationNumber: form.ahpraRegistrationNumber || undefined,
        prescriberNumber: form.prescriberNumber || undefined,
      });
      await refresh();
      setForm((f) => ({ ...f, givenName: '', familyName: '', ahpraRegistrationNumber: '', prescriberNumber: '' }));
      toast.success('Practitioner added');
    } catch (error) {
      toast.error('Could not add the practitioner', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  async function setProviderNumber(
    practitionerId: string,
    locationId: string,
    providerNumber: string,
  ) {
    try {
      await api.setProviderNumber(practiceId, practitionerId, {
        locationId,
        providerNumber: providerNumber || undefined,
      });
      await refresh();
    } catch (error) {
      toast.error('Could not save the provider number', { description: describeError(error) });
    }
  }

  const list = practitioners.data ?? [];
  const hasProviderNumber = list.some((p) => p.providerNumbers.some((n) => n.providerNumber));

  return (
    <div className="space-y-6">
      {list.length > 0 && (
        <div className="space-y-3">
          {list.map((practitioner) => (
            <Card key={practitioner.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{practitioner.displayName}</p>
                    <p className="text-muted-foreground text-sm">
                      {practitioner.kindLabel}
                      {practitioner.ahpraRegistrationNumber
                        ? ` · AHPRA ${practitioner.ahpraRegistrationNumber}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {practitioner.vocationalRegistration && (
                      <Badge variant="secondary">Vocationally registered</Badge>
                    )}
                    {practitioner.mentalHealthSkillsTraining && (
                      <Badge variant="info">MHST — 2715/2717</Badge>
                    )}
                    {practitioner.isSupervisor && <Badge variant="secondary">Supervisor</Badge>}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInviting(practitioner.id)}
                    >
                      <UserPlus className="size-3.5" />
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Medicare provider numbers
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {practitioner.providerNumbers.map((entry) => (
                      <div key={entry.locationId} className="flex items-center gap-2">
                        <span className="text-muted-foreground w-32 shrink-0 truncate text-sm">
                          {entry.locationName}
                        </span>
                        <Input
                          className="tabular h-8"
                          defaultValue={entry.providerNumber ?? ''}
                          placeholder="Not set"
                          onBlur={(e) => {
                            if (e.target.value !== (entry.providerNumber ?? '')) {
                              void setProviderNumber(
                                practitioner.id,
                                entry.locationId,
                                e.target.value,
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {practitioner.warnings.length > 0 && (
                  <Alert variant="warning">
                    <TriangleAlert />
                    <AlertDescription>
                      <ul className="list-disc space-y-0.5 pl-4">
                        {practitioner.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      <form onSubmit={addPractitioner} className="space-y-5">
        <h3 className="font-medium">Add a practitioner</h3>

        <FieldGroup columns={3}>
          <Field label="Title" htmlFor="title">
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label="Given name" htmlFor="given" required>
            <Input
              id="given"
              required
              value={form.givenName}
              onChange={(e) => setForm((f) => ({ ...f, givenName: e.target.value }))}
            />
          </Field>
          <Field label="Family name" htmlFor="family" required>
            <Input
              id="family"
              required
              value={form.familyName}
              onChange={(e) => setForm((f) => ({ ...f, familyName: e.target.value }))}
            />
          </Field>
        </FieldGroup>

        <FieldGroup columns={3}>
          <Field label="Kind" required>
            <Select
              value={form.kind}
              onValueChange={(value) => setForm((f) => ({ ...f, kind: value as PractitionerKind }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRACTITIONER_KINDS.map((kind) => (
                  <SelectItem key={kind} value={kind}>
                    {PRACTITIONER_KIND_LABELS[kind]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="AHPRA registration" htmlFor="ahpra">
            <Input
              id="ahpra"
              className="tabular"
              value={form.ahpraRegistrationNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, ahpraRegistrationNumber: e.target.value }))
              }
            />
          </Field>
          <Field label="Prescriber number" htmlFor="prescriber">
            <Input
              id="prescriber"
              className="tabular"
              value={form.prescriberNumber}
              onChange={(e) => setForm((f) => ({ ...f, prescriberNumber: e.target.value }))}
            />
          </Field>
        </FieldGroup>

        <div className="grid gap-3">
          <ToggleRow
            id="vocational"
            label="Vocationally registered"
            hint="Specialist recognition as a GP. Determines the higher MBS fee tier."
            checked={form.vocationalRegistration}
            onChange={(checked) => setForm((f) => ({ ...f, vocationalRegistration: checked }))}
          />
          <ToggleRow
            id="mhst"
            label="Mental Health Skills Training (GPMHSC)"
            hint="Required for MBS items 2715 and 2717. Without it, only 2700 and 2701 are offered at billing."
            checked={form.mentalHealthSkillsTraining}
            onChange={(checked) =>
              setForm((f) => ({ ...f, mentalHealthSkillsTraining: checked }))
            }
          />
          <ToggleRow
            id="supervisor"
            label="Can supervise registrars"
            hint="Required to be nominated as a registrar's supervisor."
            checked={form.isSupervisor}
            onChange={(checked) => setForm((f) => ({ ...f, isSupervisor: checked }))}
          />
        </div>

        <div className="flex justify-between">
          <Button type="submit" variant="outline" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add practitioner
          </Button>
          <Button type="button" onClick={onDone} disabled={!hasProviderNumber}>
            Continue
          </Button>
        </div>

        {!hasProviderNumber && list.length > 0 && (
          <p className="text-muted-foreground text-xs">
            At least one practitioner needs a provider number at a location before the practice
            can be activated.
          </p>
        )}
      </form>

      <InviteDialog
        practiceId={practiceId}
        practitionerId={inviting}
        practitioners={list}
        onClose={() => setInviting(null)}
      />
      {locations.isError && <p className="text-destructive text-sm">Could not load locations.</p>}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function InviteDialog({
  practiceId,
  practitionerId,
  practitioners,
  onClose,
}: {
  practiceId: string;
  practitionerId: string | null;
  practitioners: { id: string; displayName: string; kind: string }[];
  onClose: () => void;
}) {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<PracticeRole>('general_practitioner');
  const [busy, setBusy] = React.useState(false);
  const [acceptUrl, setAcceptUrl] = React.useState<string | null>(null);
  const practitioner = practitioners.find((p) => p.id === practitionerId);

  React.useEffect(() => {
    if (practitionerId) {
      setAcceptUrl(null);
      setEmail('');
      const kind = practitioners.find((p) => p.id === practitionerId)?.kind;
      setRole(
        kind === 'gp_registrar'
          ? 'gp_registrar'
          : kind === 'nurse' || kind === 'nurse_practitioner'
            ? 'practice_nurse'
            : 'general_practitioner',
      );
    }
  }, [practitionerId, practitioners]);

  async function invite() {
    if (!practitioner) return;
    setBusy(true);
    try {
      const [givenName, ...rest] = practitioner.displayName.replace(/^Dr\s+/, '').split(' ');
      const result = await api.inviteMember(practiceId, {
        email: email.trim(),
        givenName,
        familyName: rest.join(' ') || givenName,
        role,
        practitionerId: practitioner.id,
      });
      setAcceptUrl(result.acceptUrl ?? null);
      toast.success('Invitation created');
    } catch (error) {
      toast.error('Could not send the invitation', { description: describeError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={Boolean(practitionerId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite {practitioner?.displayName}</DialogTitle>
          <DialogDescription>
            They will set their own password. Invitations are single use and expire after 14
            days.
          </DialogDescription>
        </DialogHeader>

        {acceptUrl ? (
          <Alert variant="info">
            <AlertTitle>Invitation link</AlertTitle>
            <AlertDescription>
              <p>
                This prototype does not send email. Copy this link to the invitee — it is shown
                once.
              </p>
              <code className="bg-muted mt-2 block w-full overflow-x-auto rounded p-2 text-[11px]">
                {acceptUrl}
              </code>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Field label="Email" htmlFor="inviteEmail" required>
              <Input
                id="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Role" required>
              <Select value={role} onValueChange={(value) => setRole(value as PracticeRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        <DialogFooter>
          {acceptUrl ? (
            <Button onClick={onClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => void invite()} disabled={busy || !email}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                Send invitation
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
