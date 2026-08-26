# Consultation lifecycle

```text
draft → in_progress → completed
draft/in_progress → abandoned
completed → amended (repeatable amendment events; completed source remains)
completed → reopened → completed   (exceptional, privileged)
```

| Transition | Actor | Preconditions | Effect |
|---|---|---|---|
| create draft | clinical writer | correct patient context | records creator/context; not yet appointment “in consultation” until start |
| draft → in_progress | responsible/participating clinician | identity/context confirmed | sets actual start; appointment may advance atomically |
| in_progress → completed | author with `encounter.complete` | durable note; required actions resolved; warnings acknowledged | signature/completion instant; appointment billing handoff |
| draft/in_progress → abandoned | owner or privileged supervisor | reason; no issued artefact left ambiguous | retains drafts/audit, reverses operational status safely |
| completed → amended | authorised clinical author | reason/link to source | append-only correction/addition, notification review if external artefact affected |
| completed → reopened | `encounter.reopen` | exceptional correction policy | logs reason; original completion remains; downstream effects reviewed |

Automatic timeout may release an edit lock but never abandons or completes an encounter.
