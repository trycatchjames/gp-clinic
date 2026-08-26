# Component contract: Clinical note editor

## Purpose

Supports rapid, intelligible clinical narrative with optional structure and safe draft/version behaviour.

## Content and behaviour

The editor may offer labelled sections for reason, history, examination/findings, assessment and plan/review/safety-netting, plus a continuous free-text mode. Practice templates insert a clearly previewed starting structure and never overwrite existing text. Structured records created elsewhere appear as links/actions, not pasted opaque text.

Always show author, patient context, draft/completed state and last server/local save. Undo/redo and keyboard navigation work predictably. Pasting preserves text without executing active content. Empty sections are not automatically populated as normal/negative.

## Conflict/recovery

Concurrent edits create a comparison/reconciliation state with both versions; no automatic free-text merge. Crash/navigation/session-lock recovery binds draft to patient, encounter and author and shows its timestamp before restore.

## Completion/amendment

Completed note renders read-only with author/effective/recorded times and amendment chain. Amendment editor cannot alter original text and requires reason/context.
