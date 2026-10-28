# Empty, restricted and failed outcomes

## The problem

"Nothing here" is several different claims, and a screen that renders them identically tells the
user something untrue. No results, no permission to see results, results that could not be
loaded, and results that are stale are four different facts with four different next steps. In a
clinical system the difference between "this patient has no allergies recorded" and "the allergy
list could not be loaded" is the whole point.

## Rules

- A failure MUST NOT render as empty.
- Unavailable or restricted MUST NOT render as none-known, zero or absent.
- An empty outcome names the scope that was searched and offers a valid next step where one
  exists.
- A restricted outcome leaks no protected content, and offers an escalation path only where the
  capability configures one.
- A partial outcome names what failed and keeps the verified content usable, disabling only the
  actions that depend on the failed part.
- Stale content shows its freshness, and an unsafe mutation requires a refresh first.
- One empty outcome per screen, carrying exactly one mark. Two competing empty treatments on one
  screen is a defect.

## First reference

Patient search, `apps/web/src/routes/patients/search.tsx`, and practice locations,
`apps/web/src/routes/settings/locations.tsx`. Patient search is the stronger reference: it
distinguishes no results, a restricted record and a failed search on real data, settled by
PATSEARCH-002.

## Settled by

State panel by DS-017; the single-empty-outcome rule by DS-032 ("read one empty outcome per
screen instead of two competing marks"), which removed a second empty-state component rather than
documenting it. The restricted and failure behaviour was settled by PATSEARCH-002, merged
28 October 2026, under
[../../../cross-cutting/privacy/specification.md](../../../cross-cutting/privacy/specification.md)
and [../../../cross-cutting/error-handling/requirements.md](../../../cross-cutting/error-handling/requirements.md).

## Contracts

### DS-PAT-005 State Panel

- **Need:** Give empty, loading, unavailable, offline, restricted, and failure outcomes visibly and
  semantically different presentations with an optional safe recovery action.
- **Owner:** `apps/web/src/components/patterns/state-panel.tsx`.
- **Semantics:** Named section/region; loading carries busy/live semantics and failure carries alert
  semantics when newly inserted. Iconography supplements the state title and description.
- **Public contract:** Requires kind and title; accepts description, details, action, and compact
  density. Capability copy names scope, failed dependency, freshness, or recovery. `details` carries
  evidence the reader needs, such as what was searched for; a caller MUST NOT pass decoration that
  competes with the mark the state already supplies.
- **States:** Each supported kind has distinct structure, icon, and semantic-token treatment. Empty
  never substitutes for failure/unavailable; restricted never leaks protected content; offline
  labels cached content and unsafe writes separately.
- **Keyboard and focus:** The panel itself does not take focus unless a screen deliberately targets
  its heading/summary after a failed action. Recovery action is fully named and follows the message.
- **Responsive/content:** Copy and action stack without truncation. Compact changes spacing, not
  meaning or target size.
- **Required stories:** `Empty`, `Loading`, `Unavailable`, `Offline`, `Restricted`, `Failure`,
  `WithRecovery`, `Compact`, `ContentStress`, and `Narrow`.
- **Evidence:** `state-panel-kinds`, `state-panel-recovery`, and `state-panel-narrow`.
- **Used by:** [Patient search](../../../capabilities/patient-search/spec.md#screen-contract-patient-search),
  [calendar day](../../../capabilities/calendar/spec.md#screen-contract-calendar-day), and
  [patient record workspace](../../../capabilities/patient-record/spec.md#screen-contract-patient-record-workspace).
- **Excludes:** Detecting the state, retry safety, cached-data policy, permission escalation, and
  capability-specific copy.
