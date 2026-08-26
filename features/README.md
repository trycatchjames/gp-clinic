# Legacy Gherkin Specifications

> **Non-authoritative.** Executable examples for the authoritative Version 1 specification live
> beside capabilities under [`../spec/capabilities`](../spec/capabilities). These earlier feature
> files are retained as research/implementation history and cannot override [`../SPEC.md`](../SPEC.md).

These are earlier behavioural examples for the GP practice management prototype. They are the
counterpart to the legacy workflow documents in [`../docs`](../docs).

## Everything here is currently inactive

**Every feature file is tagged `@inactive`.** Nothing in this directory runs as an automated test
yet. They are living specifications first — written so that a GP, a practice manager or a
developer can read them and agree on what the software should do — and they become the acceptance
suite as each workflow is implemented.

## Metadata convention

Every file opens with a machine-readable metadata block, followed by tags, followed by the
`Feature`:

```gherkin
# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/10-practice-setup/01-practice-registration-and-onboarding.md
#   standards: [C3.1, C3.2]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @onboarding
Feature: Practice registration
```

| Metadata key | Meaning |
|---|---|
| `status` | `inactive` \| `active` \| `deprecated`. All are `inactive` today. |
| `implemented` | Whether the behaviour exists in the application |
| `automation` | `none` \| `partial` \| `full` — how much of this file is automated |
| `spec` | The workflow document this file specifies |
| `standards` | RACGP Standards (5th ed.) criteria this behaviour is evidence for |
| `domain` | The bounded context |
| `last_reviewed` | When a human last read this file against reality |

## Tags

| Tag | Meaning |
|---|---|
| `@inactive` | **Excluded from every test run.** Present on every file today. |
| `@not-implemented` | The behaviour does not exist yet |
| `@implemented` | The behaviour exists; the file is ready to be activated |
| `@practice-setup`, `@patient-management`, `@scheduling`, `@clinical`, `@billing`, `@practice-operations` | Domain |
| `@safety-critical` | Failure could harm a patient. These get automated first. |
| `@compliance` | Failure creates a regulatory, billing-integrity or privacy exposure |
| `@offline` | Specifies behaviour when the client has no connectivity |
| `@medicare` | Depends on MBS or Medicare program rules that change over time |

## Activating a feature file

1. Implement the behaviour.
2. Write the step definitions.
3. Change `status: inactive` → `active`, `implemented: false` → `true`,
   `automation: none` → `partial`/`full`.
4. Replace the `@inactive` tag with `@implemented` and remove `@not-implemented`.
5. The runner picks it up — the test command filters on `not @inactive`.

Until step 4, the file is documentation.

## Checking the files

```bash
pnpm lint:features
```

`scripts/lint-features.mjs` verifies that every file has a complete metadata block, that
`status: inactive` and the `@inactive` tag agree with each other, that the `spec:` path points at
a document that exists, and that every feature file referenced from `docs/` exists here.

## Intended runner

When these are activated, the intended stack is `@cucumber/cucumber` with TypeScript step
definitions, running the API in-process and the web app through Playwright for the UI-level
scenarios. That choice is not yet made in code — nothing in this repo depends on it.
