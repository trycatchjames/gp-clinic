# Choosing a surface

## The problem

A task has to happen somewhere: on the page the user is already on, on a panel beside it, in a
dialog over it, or on a page of its own. Choosing wrongly is not a style mistake. In general
practice the surface decides whether the patient's identity and safety context stay visible while
someone acts, and an overlay that covers them turns an ordinary edit into a wrong-patient hazard.

This page decides which surface a task uses. The owning capability still decides what the user may
do and see.

## The rule that comes first

**Patient identity and clinical safety context stay visible while clinical or financial work
happens.** When a task concerns one patient, the surface MUST NOT obscure who that patient is, the
allergy and alert summary, or the responsibility context the capability requires. If the only way
to fit the task is to cover that context, the task belongs on a page that carries it, not on an
overlay that hides it.

A surface that covers patient context is acceptable only for a task that cannot be about the wrong
patient — signing in, practice settings, a global search — or for a confirmation that names the
patient in its own content.

## Choosing

| Surface | Use it for | Component |
|---|---|---|
| **Inline** | Changing one value where it already is, when the change is low-consequence and the surrounding record gives the context. | native controls, `Field` |
| **Edge-anchored panel** | Editing or reviewing one section of a record the user needs to keep seeing. The record stays on screen behind the panel. | `Sheet` (`DS-OVR-004`) |
| **Dialog** | A brief, self-contained decision that must be answered before anything else continues, ending in a clear result. | `Dialog` (`DS-OVR-001`), `ConsequenceConfirmation` (`DS-PAT-013`) |
| **Page** | Clinical work, a long or multi-step task, a worklist, a comparison, or anything needing more room than a panel affords. | route |

### Inline

Prefer it when the value is small, the consequence is low, and the user can see what they are
changing in its own context. Do not use it for a change that needs explanation, several fields, or
a confirmation.

### Edge-anchored panel

The default for editing a section of an existing record. Keep it to one task, with a specific
title, short context, the fields, validation, and its actions.

- Give it a distinct header, a scrolling field area, and a footer anchored at the bottom.
- Put the cancelling action before the primary action, with the primary action at the trailing
  edge. Keep that order on every panel and dialog.
- At narrow widths let it take the available width and scroll its contents. Keep the title and the
  close control reachable.
- Return focus to the control that opened it.
- Never nest one panel inside another, and never put several unrelated sections in one panel.

### Dialog

For a brief action that ends in a clear result and leaves the page intact on cancel: confirming a
consequential action, adding one short thing, answering one question. Same footer order as a panel.

A dialog that grows past a handful of fields, or that the user needs to consult the page behind to
complete, has outgrown the surface. Move it to a panel or a page.

### Page

Clinical work belongs on a page. A consultation, a patient record, a result worklist, a duplicate
comparison, and any multi-step task get their own route, carrying the identity and safety context
the capability requires.

Use a page too when the task needs the user to compare, scan, or move between sections — anything
an overlay would force them to close and reopen.

## Rules for every overlay

- One overlay at a time. An overlay MUST NOT open another.
- An overlay MUST NOT be the only route to a frequent or safety-critical task.
- Escape closes a transient surface only when closing cannot discard or complete work. When it
  would lose work, the capability's dirty-state contract decides; see
  [saving work](saving-work.md).
- Opening, scrolling, or closing an overlay MUST NOT imply clinical review, selection, or save.
- Every overlay returns focus to the control that invoked it.

## First reference

None yet. No shipped screen uses an edge-anchored panel: `Sheet` was specified and demonstrated by
DS-018, and patient search, onboarding and settings are page-based. The first capability to edit a
record section in a panel becomes this page's first reference — record it here, with the date and
who asked for it, when it ships.

## Settled by

Written 29 October 2026 as part of moving the design system onto a pattern footing. The
patient-context rule is derived from the wrong-patient requirements in
[../../../cross-cutting/clinical-safety/principles.md](../../../cross-cutting/clinical-safety/principles.md)
and the destructive-action contract; the footer and focus rules are taken from the `Sheet` and
`Dialog` contracts in [../components.md](../components.md). No capability decision is recorded
here — this page chooses a surface, it does not grant an action.
