import * as React from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  Eye,
  FileClock,
  HelpCircle,
  Info,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ContextBanner } from '@/components/patterns/context-banner';
import { Field } from '@/components/patterns/form-field';
import { FilterBar, FilterField } from '@/components/patterns/filter-bar';
import { ListView, ListViewRow } from '@/components/patterns/list-view';
import { StatePanel } from '@/components/patterns/state-panel';
import { SummaryList } from '@/components/patterns/summary-list';

const ownershipLayers = [
  {
    atomic: 'Atom',
    name: 'Primitive',
    path: 'components/ui',
    description: 'Accessible interaction mechanics, DOM semantics and token-based variants.',
  },
  {
    atomic: 'Molecule',
    name: 'Pure pattern',
    path: 'components/patterns',
    description: 'Reusable primitive compositions driven only by props, slots and callbacks.',
  },
  {
    atomic: 'Organism',
    name: 'Capability-connected',
    path: 'features/<capability>/components',
    description: 'API state, permission-aware presentation and capability orchestration.',
  },
] as const;

const palette = [
  { name: 'Eucalyptus', use: 'Primary action', className: 'bg-primary text-primary-foreground' },
  { name: 'Wattle', use: 'Orientation', className: 'bg-accent text-accent-foreground' },
  { name: 'Paper', use: 'Work surface', className: 'bg-card text-card-foreground' },
  { name: 'Mineral', use: 'Record text', className: 'bg-foreground text-background' },
] as const;

function GalleryHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-2">
      <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">{eyebrow}</p>
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{description}</p>
    </div>
  );
}

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
  const [listQuery, setListQuery] = React.useState('');
  const [selectedListId, setSelectedListId] = React.useState<string | null>(null);
  const listRows = fixture.list.filter((item) =>
    `${item.name} ${item.facts.join(' ')}`.toLowerCase().includes(listQuery.toLowerCase()),
  );

  function savePreferences(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="bg-background min-h-svh">
      <a
        href="#foundation-controls"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('foundation-controls')?.focus();
        }}
        className="bg-primary text-primary-foreground focus-visible:ring-ring fixed top-3 left-3 z-50 -translate-y-20 rounded-md px-4 py-2 text-sm font-medium shadow-lg focus:translate-y-0 focus-visible:ring-3 focus-visible:outline-none"
      >
        Skip to component gallery
      </a>

      <header
        data-evidence="theme-foundations"
        className="bg-primary text-primary-foreground relative isolate overflow-hidden border-b"
      >
        <div
          aria-hidden="true"
          className="bg-accent/20 absolute -top-36 -right-28 -z-10 size-96 rounded-full blur-2xl"
        />
        <div
          aria-hidden="true"
          className="border-primary-foreground/15 absolute right-[16%] -bottom-48 -z-10 size-96 rounded-full border-[48px]"
        />
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground text-primary flex size-10 items-center justify-center rounded-xl shadow-sm">
                <Sparkles aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">GP Clinic</p>
                <p className="text-primary-foreground/70 text-xs">Product foundations</p>
              </div>
            </div>
            <Badge className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground max-w-[15rem] whitespace-normal">
              Synthetic fixture · {fixture.id}
            </Badge>
          </div>

          <div className="grid gap-8 pt-16 pb-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:pt-24">
            <div className="max-w-3xl space-y-5">
              <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
                Eucalyptus &amp; Wattle
              </p>
              <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
                Quiet confidence for busy care.
              </h1>
              <p className="text-primary-foreground/75 max-w-2xl text-base leading-relaxed sm:text-lg">
                A warm, precise interface language for the high-throughput moments where context,
                state and the next safe action must be immediately clear.
              </p>
            </div>
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-sm">
              {palette.map((colour) => (
                <div key={colour.name} className="border-primary-foreground/15 border-r border-b p-3 last:border-r-0 sm:p-4">
                  <div className={`mb-3 h-8 rounded-lg border border-black/10 ${colour.className}`} />
                  <p className="text-xs font-semibold">{colour.name}</p>
                  <p className="text-primary-foreground/65 mt-0.5 text-[11px]">{colour.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="Foundation sections" className="bg-card border-b">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-8">
          {[
            ['#foundation-controls', 'Controls'],
            ['#list-patterns', 'Lists'],
            ['#interactive-primitives', 'Interactions'],
            ['#workflow-patterns', 'Workflow patterns'],
            ['#form-states', 'Forms'],
            ['#ownership', 'Ownership'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="hover:bg-accent focus-visible:ring-ring shrink-0 rounded-md px-3 py-2 text-sm font-medium focus-visible:ring-3 focus-visible:outline-none"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl space-y-20 px-5 py-12 sm:px-8 sm:py-16">
        <section
          id="foundation-controls"
          aria-labelledby="foundation-controls-heading"
          tabIndex={-1}
          className="focus-visible:ring-ring scroll-mt-20 space-y-7 rounded-xl focus-visible:ring-3 focus-visible:outline-none"
        >
          <div>
            <GalleryHeading
              id="foundation-controls-heading"
              eyebrow="Atoms"
              title="Clear action and unmistakable state"
              description="Controls remain legible and predictable across routine, pending, unavailable and consequential moments. Semantic colour always travels with words or symbols."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle asChild>
                  <h3>Action hierarchy</h3>
                </CardTitle>
                <CardDescription>Consequence and availability stay visible.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button type="button">
                  <Save aria-hidden="true" />
                  Save changes
                </Button>
                <Button type="button" variant="secondary">Review details</Button>
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="button" variant="destructive">
                  <Trash2 aria-hidden="true" />
                  Remove draft
                </Button>
                <Button type="button" disabled>Continue</Button>
                <Button type="button" variant="outline" aria-busy="true">
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Saving…
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle asChild><h3>Status language</h3></CardTitle>
                <CardDescription>Brand and clinical status never borrow meaning.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Badge variant="success"><CheckCircle2 aria-hidden="true" />{fixture.controls.statuses[0]}</Badge>
                <Badge variant="warning"><AlertCircle aria-hidden="true" />{fixture.controls.statuses[1]}</Badge>
                <Badge variant="outline"><Info aria-hidden="true" />{fixture.controls.statuses[2]}</Badge>
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
          id="list-patterns"
          data-evidence="list-patterns"
          aria-labelledby="list-patterns-heading"
          className="space-y-4"
        >
          <div className="max-w-3xl space-y-1">
            <h2 id="list-patterns-heading" className="text-xl font-semibold">
              Search and list patterns
            </h2>
            <p className="text-muted-foreground text-sm">
              Keep filters compact and lead each row with the facts used to choose it.
            </p>
          </div>

          <div className="space-y-3">
            <FilterBar label="Example record search" summary={`${listRows.length} results`}>
              <FilterField
                label="Name or location"
                htmlFor="pattern-search"
                hint="Filter the synthetic records by name, suburb or postcode."
                hideLabel
                grow
              >
                {(controlProps) => (
                  <div className="relative">
                    <Search
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <Input
                      {...controlProps}
                      value={listQuery}
                      onChange={(event) => {
                        setListQuery(event.target.value);
                        setSelectedListId(null);
                      }}
                      placeholder="Name, suburb or postcode"
                      className="pl-8"
                    />
                  </div>
                )}
              </FilterField>
              <FilterField label="Status" htmlFor="pattern-status">
                {(controlProps) => (
                  <Select defaultValue="active">
                    <SelectTrigger {...controlProps} className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="all">All records</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FilterField>
            </FilterBar>

            <ListView
              label="Example records"
              items={listRows}
              getKey={(item) => item.id}
              selectedKey={selectedListId}
              onSelect={(item) => setSelectedListId(item.id)}
              renderItem={(item) => (
                <ListViewRow
                  title={item.name}
                  badges={item.similar ? <Badge variant="warning">Similar details</Badge> : null}
                  meta={item.facts}
                  trailing={item.reference}
                />
              )}
            />
          </div>
        </section>

        <section
          id="interactive-primitives"
          data-evidence="interactive-primitives"
          aria-labelledby="interactive-primitives-heading"
          className="scroll-mt-20 space-y-7"
        >
          <div>
            <GalleryHeading
              id="interactive-primitives-heading"
              eyebrow="Atoms in concert"
              title="Dense where it helps, spacious where it matters"
              description="Established primitives share one visual rhythm while preserving native roles, focus behaviour and task order."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <Card className="border-primary/15 overflow-hidden">
              <CardHeader className="border-b pb-5">
                <CardTitle asChild><h3>Appointment view</h3></CardTitle>
                <CardDescription>A compact table with an equivalent, named tab structure.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="today" className="gap-5">
                  <TabsList aria-label="Appointment range">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This week</TabsTrigger>
                    <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                  </TabsList>
                  <TabsContent value="today">
                    <Table aria-label="Synthetic appointments">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fixture.appointments.map((appointment) => (
                          <TableRow key={`${appointment.time}-${appointment.name}`}>
                            <TableCell className="tabular font-semibold">{appointment.time}</TableCell>
                            <TableCell>{appointment.name}</TableCell>
                            <TableCell className="text-muted-foreground">{appointment.kind}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={appointment.state === 'Ready' ? 'success' : 'outline'}>
                                {appointment.state}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="week" className="text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
                    Weekly density is supplied by the capability; tab selection does not fetch data here.
                  </TabsContent>
                  <TabsContent value="unassigned" className="text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
                    No synthetic unassigned appointments in this fixture.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle asChild><h3>Transient interaction</h3></CardTitle>
                <CardDescription>Menus explain choice; dialogs reserve space for consequence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Practice setup</p>
                    <div className="flex items-center gap-2">
                      <span className="tabular text-sm font-semibold">64%</span>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" aria-label="About setup progress" className="size-7">
                              <HelpCircle aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Progress is calculated by capability code.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Progress aria-label="Practice setup progress" value={64} />
                  <p className="text-muted-foreground text-xs">Four of six required setup tasks complete.</p>
                </div>

                <div className="bg-muted/55 flex flex-wrap items-center gap-2 rounded-xl border p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline">
                        <MoreHorizontal aria-hidden="true" />
                        More actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Synthetic appointment</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Eye aria-hidden="true" />View details</DropdownMenuItem>
                      <DropdownMenuItem><FileClock aria-hidden="true" />View history</DropdownMenuItem>
                      <DropdownMenuItem disabled>Print summary</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="destructive">Review removal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove this synthetic draft?</DialogTitle>
                        <DialogDescription>
                          This gallery action does not change data. A real dialog must name the affected
                          record, consequence, and safer alternative.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Keep draft</Button></DialogClose>
                        <DialogClose asChild><Button type="button" variant="destructive">Remove draft</Button></DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="workflow-patterns"
          data-evidence="workflow-patterns"
          aria-labelledby="workflow-patterns-heading"
          className="scroll-mt-20 space-y-8"
        >
          <div>
            <GalleryHeading
              id="workflow-patterns-heading"
              eyebrow="Molecules"
              title="Keep context attached to the work"
              description="Pure patterns provide hierarchy, density and state semantics. Capability code supplies the facts, permissions and callbacks."
            />
          </div>

          <div data-evidence="responsive-patterns" className="space-y-5">
            <ContextBanner
              contextLabel="Synthetic patient context"
              title={fixture.context.title}
              description={fixture.context.description}
              status={<Badge variant="success"><ShieldCheck aria-hidden="true" />Identity checked</Badge>}
              facts={fixture.context.facts}
              actions={
                <>
                  <Button type="button" variant="outline" size="sm">Change context</Button>
                  <Button type="button" size="sm">Open record<ArrowRight aria-hidden="true" /></Button>
                </>
              }
              notice={
                <span className="flex items-start gap-2">
                  <Info aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
                  Context patterns keep identity visible; capability code still enforces every
                  permission and cross-practice boundary.
                </span>
              }
            />

            <SummaryList items={fixture.summary} columns={3} density="compact" />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Truthful data states</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Similar-looking blanks are dangerous. Each state names what is known and what can happen next.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatePanel kind="loading" compact title="Loading appointments" description="Checking today’s appointment book." />
              <StatePanel
                kind="empty"
                compact
                title="No appointments match"
                description="The request succeeded. Adjust or clear the current filters."
                action={<Button variant="outline" size="sm">Clear filters</Button>}
              />
              <StatePanel
                kind="offline"
                compact
                title="Working from a cached copy"
                description="Last updated at 8:42 am. Saving is unavailable until reconnection."
                action={<Button variant="outline" size="sm"><RotateCcw aria-hidden="true" />Retry connection</Button>}
              />
              <StatePanel
                kind="unavailable"
                compact
                title="Clinical summary unavailable"
                description="Do not interpret this as no medicines, allergies or problems recorded."
              />
              <StatePanel
                kind="restricted"
                compact
                title="Access not available"
                description="Your current access does not include this workspace area."
              />
              <StatePanel
                kind="failure"
                compact
                title="Changes were not saved"
                description="Your entered values remain here. Review the error and try again."
                action={<Button variant="outline" size="sm">Try again</Button>}
              />
            </div>
          </div>
        </section>

        <section
          id="form-states"
          data-evidence="form-states"
          aria-labelledby="form-states-heading"
          className="scroll-mt-20 space-y-7"
        >
          <div>
            <GalleryHeading
              id="form-states-heading"
              eyebrow="Molecule"
              title="Forms explain themselves at the point of need"
              description="Labels, brief hints, validation and availability remain connected to each control. Failed saves preserve the entered work."
            />
          </div>

          <Card className="border-primary/15">
            <CardHeader className="border-b pb-5">
              <CardTitle asChild><h3>Workspace preferences</h3></CardTitle>
              <CardDescription>Example state only; this fixture does not call an API.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={savePreferences} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Workspace label" htmlFor="workspace-label" required hint="Used to distinguish this workspace in staff navigation.">
                    <Input value={workspaceLabel} onChange={(event) => setWorkspaceLabel(event.target.value)} required />
                  </Field>

                  <Field
                    label="Notification email"
                    htmlFor="notification-email"
                    hint="Receives non-clinical workspace notices."
                    error="Enter an email address in the format name@example.com."
                  >
                    <Input inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </Field>

                  <Field label="Default location" htmlFor="default-location" hint="Unavailable while this fixture is locked to one location.">
                    <Input value={fixture.form.defaultLocation} disabled />
                  </Field>

                  <Field label="Handover note" htmlFor="handover-note" hint="Keep the note short and operational; do not include patient information.">
                    <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
                  </Field>

                  <Field label="Default view" htmlFor="default-view" hint="Choose the view shown when this workspace opens.">
                    {(controlProps) => (
                      <Select value={defaultView} onValueChange={setDefaultView}>
                        <SelectTrigger {...controlProps}><SelectValue /></SelectTrigger>
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
                    <p id="show-keyboard-hints-description" className="text-muted-foreground text-xs leading-relaxed">
                      Adds shortcut hints beside supported actions.
                    </p>
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Workspace density</legend>
                    <p id="density-description" className="text-muted-foreground text-xs">Changes spacing, not the available information.</p>
                    <RadioGroup value={density} onValueChange={setDensity} aria-describedby="density-description">
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
                    <p id="announce-changes-description" className="text-muted-foreground text-xs leading-relaxed">
                      Announces dynamic save and validation messages.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/55 flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3">
                  <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
                    {saved ? 'Preferences saved for this synthetic fixture.' : 'No changes saved yet.'}
                  </p>
                  <Button type="submit">Save preferences</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section id="ownership" aria-labelledby="ownership-heading" className="scroll-mt-20 space-y-7">
          <div>
            <GalleryHeading
              id="ownership-heading"
              eyebrow="Composition"
              title="Atomic language, one ownership model"
              description="Atomic levels explain how the interface composes. Repository layers decide what knowledge each component may own."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ownershipLayers.map((layer, index) => (
              <Card key={layer.name} className="gap-4 overflow-hidden py-0">
                <div className="bg-secondary flex items-center justify-between border-b px-5 py-3">
                  <Badge variant="secondary" className="bg-card">{layer.atomic}</Badge>
                  <span className="text-primary tabular text-xs font-semibold">0{index + 1}</span>
                </div>
                <CardHeader className="gap-2 px-5">
                  <CardTitle asChild><h3>{layer.name}</h3></CardTitle>
                  <code className="text-muted-foreground text-xs break-all">{layer.path}</code>
                </CardHeader>
                <CardContent className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed">
                  {layer.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background mt-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CircleUserRound aria-hidden="true" className="size-4" />
            Designed for calm, accountable practice work.
          </p>
          <p className="text-background/60 text-xs">Synthetic UI evidence only · no patient data</p>
        </div>
      </footer>
    </div>
  );
}
