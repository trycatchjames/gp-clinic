# Naming a screen and its context

## The problem

Before anyone acts on a screen they need to know what it is showing, whose it is, and how fresh
it is. In a system where several patients, practitioners and locations are in play, a screen that
does not say which one it is about is a wrong-patient hazard, and a screen showing cached data
without saying so invites a decision on stale facts.

## Rules

- Every screen says what it is showing, before anything on it can be acted on.
- A screen about one patient, practitioner or location names them, and that context stays
  available at narrow widths and at 200% zoom.
- Say how fresh the content is wherever it can be stale, cached or offline, and label the
  as-of time rather than implying it is live.
- Context that carries safety meaning — allergies, alerts, responsibility — is not decoration and
  is not collapsed away by compact density.
- A banner states context and status. It does not decide clinical meaning.

## First reference

None on real data. `PageHeader` and `ContextBanner` were specified and demonstrated by DS-030 and
DS-004; only the gallery consumes `ContextBanner`. The first patient-scoped screen becomes this
page's first reference.

## Settled by

Page header by DS-030 ("say what a screen is showing and how fresh it is before anyone acts on
it"), context banner by DS-004.

## Contracts

### DS-PAT-025 Page Header

- **Need:** Name the screen, say exactly which scope it is showing, and say how fresh that is, so no
  one acts on a stale queue or on the wrong location or date without noticing.
- **Owner:** `apps/web/src/components/patterns/page-header.tsx`.
- **Semantics:** A `banner`-free header region holding the screen's heading, its scope as named
  facts, a freshness statement and the screen-level actions. Scope is a definition list so a missing
  fact is visible rather than silently absent. The freshness sentence is announced politely and
  moves no focus.
- **Public contract:** Requires the title. Accepts the heading level, a short description, the scope
  facts as label and value pairs, a freshness state carrying an as-of instant, the IANA timezone,
  whether the view is refreshing or known to be stale, a refresh action, and the screen-level
  actions. The caller owns routing, fetching, every word and the judgement that something is stale.
- **States:** Current, refreshing, stale, and freshness not known. A refreshing header keeps the
  previous scope and as-of visible rather than blanking them, because a screen that forgets what it
  was showing while it reloads invites acting on the wrong one. Freshness that is not known says so
  rather than showing nothing, and MUST NOT be rendered as current. A repeated refresh that changes
  nothing MUST NOT announce again.
- **Keyboard and focus:** The refresh control follows the freshness it refreshes in reading order.
  Refreshing MUST NOT move focus or reorder the actions. The heading is not focusable and the header
  never takes focus on arrival.
- **Responsive/content:** The title wraps rather than truncating. Scope facts wrap as a group and
  keep their labels. Actions wrap beneath at a narrow width and every one stays reachable.
- **Required stories:** `Default`, `WithScope`, `Refreshing`, `Stale`, `UnknownFreshness`,
  `ContentStress`, `Narrow`, and `KeyboardFlow`.
- **Evidence:** `page-header-states`, `page-header-stale`, `page-header-narrow`, and
  `page-header-keyboard`.
- **Used by:** [Calendar day](../../../capabilities/calendar/spec.md#screen-contract-calendar-day),
  [results inbox](../../../capabilities/results/spec.md#screen-contract-results-inbox), and
  [task worklist](../../../capabilities/tasks/spec.md#screen-contract-task-worklist).
- **Excludes:** Routing, fetching and refresh scheduling, deciding that a view is stale, permission
  for any action, breadcrumbs, and the record identity that `DS-PAT-004` carries.

### DS-PAT-004 Context Banner

- **Need:** Keep the active record or workflow identity and key metadata visible while staff act.
- **Owner:** `apps/web/src/components/patterns/context-banner.tsx`.
- **Semantics:** Named section with context label, heading, optional description/status, labelled
  facts, actions, and notice region.
- **Public contract:** Accepts text/content slots and an array of labelled facts with optional
  tabular treatment. It does not know whether the context is a patient, practitioner, appointment,
  location, invoice, or other record.
- **States:** Long/missing facts, status, notice, and actions remain structurally distinct. The
  caller supplies unavailable/restricted/freshness meaning rather than omitting it ambiguously.
- **Keyboard and focus:** Actions follow the context in task order. Updating facts or status does not
  steal focus.
- **Responsive/content:** Actions wrap below context at narrow widths. Facts wrap deliberately and
  required identity/status remains visible; the banner does not become hover-only or horizontally
  clipped.
- **Required stories:** `Default`, `WithStatus`, `WithNotice`, `WithActions`, `MissingOptionalFacts`,
  `ContentStress`, and `Narrow`.
- **Evidence:** `context-banner-states` and `context-banner-narrow`.
- **Used by:** [Patient record workspace](../../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace),
  [consultation workspace](../../../capabilities/consultations/spec.md#screen-contract-consultation-workspace),
  and [calendar day](../../../capabilities/calendar/spec.md#screen-contract-calendar-day).
- **Excludes:** Identity verification, patient/allergy semantics, permission filtering, freshness
  calculation, and action availability.

