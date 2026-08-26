import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, Save, Trash2 } from 'lucide-react';
import { designSystemStates } from '@/fixtures/design-system-states';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/patterns/form-field';

const ownershipLayers = [
  {
    name: 'Primitive',
    path: 'components/ui',
    description: 'Accessible interaction mechanics, DOM semantics and visual variants.',
  },
  {
    name: 'Pure pattern',
    path: 'components/patterns',
    description: 'Reusable primitive compositions driven only by props and callbacks.',
  },
  {
    name: 'Capability-connected',
    path: 'features/<capability>/components',
    description: 'API state, permission-aware presentation and capability orchestration.',
  },
] as const;

export function FoundationsRoute() {
  const fixture = designSystemStates;
  const [workspaceLabel, setWorkspaceLabel] = React.useState<string>(fixture.form.workspaceLabel);
  const [email, setEmail] = React.useState<string>(fixture.form.invalidEmail);
  const [note, setNote] = React.useState<string>(fixture.form.handoverNote);
  const [defaultView, setDefaultView] = React.useState('today');
  const [showHints, setShowHints] = React.useState(true);
  const [density, setDensity] = React.useState('comfortable');
  const [announceChanges, setAnnounceChanges] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  function savePreferences(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="bg-muted/30 min-h-svh">
      <a
        href="#form-states"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('form-states')?.focus();
        }}
        className="bg-primary text-primary-foreground focus-visible:ring-ring absolute top-3 left-3 z-50 -translate-y-20 rounded-md px-4 py-2 text-sm font-medium focus:translate-y-0 focus-visible:ring-3 focus-visible:outline-none"
      >
        Skip to form states
      </a>

      <header className="bg-background border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Application foundations</p>
            <h1 className="text-2xl font-semibold tracking-tight">Accessible control gallery</h1>
          </div>
          <Badge variant="outline">Synthetic fixture · {fixture.id}</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        <section
          id="foundation-controls"
          data-evidence="foundation-controls"
          aria-labelledby="foundation-controls-heading"
          className="space-y-5"
        >
          <div className="max-w-3xl space-y-1">
            <h2 id="foundation-controls-heading" className="text-xl font-semibold">
              Foundation controls
            </h2>
            <p className="text-muted-foreground text-sm">
              Meaningful action, status and feedback states for repeatable staff workflows.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle asChild>
                  <h3>Actions</h3>
                </CardTitle>
                <CardDescription>Text and iconography make consequence clear.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button type="button">
                  <Save aria-hidden="true" />
                  Save changes
                </Button>
                <Button type="button" variant="secondary">
                  Review details
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="button" variant="destructive">
                  <Trash2 aria-hidden="true" />
                  Remove draft
                </Button>
                <Button type="button" disabled>
                  Continue
                </Button>
                <Button type="button" variant="outline" aria-busy="true">
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Saving…
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle asChild>
                  <h3>Status</h3>
                </CardTitle>
                <CardDescription>Labels and icons carry meaning alongside colour.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Badge variant="success">
                  <CheckCircle2 aria-hidden="true" />
                  {fixture.controls.statuses[0]}
                </Badge>
                <Badge variant="warning">
                  <AlertCircle aria-hidden="true" />
                  {fixture.controls.statuses[1]}
                </Badge>
                <Badge variant="outline">
                  <Info aria-hidden="true" />
                  {fixture.controls.statuses[2]}
                </Badge>
              </CardContent>
            </Card>

            <Alert variant="info" role="status">
              <Info aria-hidden="true" />
              <AlertTitle>Changes saved</AlertTitle>
              <AlertDescription>The latest preferences are available to this workspace.</AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle aria-hidden="true" />
              <AlertTitle>Changes were not saved</AlertTitle>
              <AlertDescription>
                Check the highlighted fields, then try again. Your entered values remain available.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section
          id="form-states"
          data-evidence="form-states"
          aria-labelledby="form-states-heading"
          tabIndex={-1}
          className="focus-visible:ring-ring scroll-mt-6 space-y-5 rounded-xl focus-visible:ring-3 focus-visible:outline-none"
        >
          <div className="max-w-3xl space-y-1">
            <h2 id="form-states-heading" className="text-xl font-semibold">
              Form states
            </h2>
            <p className="text-muted-foreground text-sm">
              Labels, descriptions, errors and availability remain perceivable without relying on colour.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle asChild>
                <h3>Workspace preferences</h3>
              </CardTitle>
              <CardDescription>Example state only; this fixture does not call an API.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePreferences} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Workspace label"
                    htmlFor="workspace-label"
                    required
                    hint="Used to distinguish this workspace in staff navigation."
                  >
                    <Input
                      value={workspaceLabel}
                      onChange={(event) => setWorkspaceLabel(event.target.value)}
                      required
                    />
                  </Field>

                  <Field
                    label="Notification email"
                    htmlFor="notification-email"
                    hint="Receives non-clinical workspace notices."
                    error="Enter an email address in the format name@example.com."
                  >
                    <Input
                      inputMode="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Field>

                  <Field
                    label="Default location"
                    htmlFor="default-location"
                    hint="Unavailable while this fixture is locked to one location."
                  >
                    <Input value={fixture.form.defaultLocation} disabled />
                  </Field>

                  <Field
                    label="Handover note"
                    htmlFor="handover-note"
                    hint="Keep the note short and operational; do not include patient information."
                  >
                    <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
                  </Field>

                  <Field
                    label="Default view"
                    htmlFor="default-view"
                    hint="Choose the view shown when this workspace opens."
                  >
                    {(controlProps) => (
                      <Select value={defaultView} onValueChange={setDefaultView}>
                        <SelectTrigger {...controlProps}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This week</SelectItem>
                          <SelectItem value="tasks">My tasks</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                </div>

                <div className="grid gap-5 border-t pt-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex min-h-6 items-center gap-3">
                      <Checkbox
                        id="show-keyboard-hints"
                        checked={showHints}
                        onCheckedChange={(checked) => setShowHints(checked === true)}
                        aria-describedby="show-keyboard-hints-description"
                      />
                      <Label htmlFor="show-keyboard-hints">Show keyboard hints</Label>
                    </div>
                    <p
                      id="show-keyboard-hints-description"
                      className="text-muted-foreground text-xs leading-relaxed"
                    >
                      Adds shortcut hints beside supported actions.
                    </p>
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Workspace density</legend>
                    <p id="density-description" className="text-muted-foreground text-xs">
                      Changes spacing, not the available information.
                    </p>
                    <RadioGroup
                      value={density}
                      onValueChange={setDensity}
                      aria-describedby="density-description"
                    >
                      <div className="flex min-h-6 items-center gap-3">
                        <RadioGroupItem value="comfortable" id="density-comfortable" />
                        <Label htmlFor="density-comfortable">Comfortable</Label>
                      </div>
                      <div className="flex min-h-6 items-center gap-3">
                        <RadioGroupItem value="compact" id="density-compact" />
                        <Label htmlFor="density-compact">Compact</Label>
                      </div>
                    </RadioGroup>
                  </fieldset>

                  <div className="space-y-2">
                    <div className="flex min-h-6 items-center gap-3">
                      <Switch
                        id="announce-changes"
                        checked={announceChanges}
                        onCheckedChange={setAnnounceChanges}
                        aria-describedby="announce-changes-description"
                      />
                      <Label htmlFor="announce-changes">Announce changes</Label>
                    </div>
                    <p
                      id="announce-changes-description"
                      className="text-muted-foreground text-xs leading-relaxed"
                    >
                      Announces dynamic save and validation messages.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                  <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
                    {saved ? 'Preferences saved for this synthetic fixture.' : 'No changes saved yet.'}
                  </p>
                  <Button type="submit">Save preferences</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="ownership-heading" className="space-y-5">
          <div className="max-w-3xl space-y-1">
            <h2 id="ownership-heading" className="text-xl font-semibold">
              Component ownership
            </h2>
            <p className="text-muted-foreground text-sm">
              Components live at the lowest layer that has enough knowledge to do their job.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ownershipLayers.map((layer) => (
              <Card key={layer.name} className="gap-3 py-5">
                <CardHeader className="gap-2">
                  <CardTitle asChild>
                    <h3>{layer.name}</h3>
                  </CardTitle>
                  <code className="text-muted-foreground text-xs">{layer.path}</code>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  {layer.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
