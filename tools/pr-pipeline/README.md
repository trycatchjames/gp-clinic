# Local PR pipeline

This private workspace package owns the GitHub inspection and delivery loop. Product applications
never import it, and the package can later move to its own repository without changing product
runtime code.

The implementation and LLM review agents run on this computer through the installed `claude` or
`codex` CLI. GitHub Actions runs deterministic CI only. No model API key is stored in GitHub, and
this package does not install a cron entry, daemon, launch agent or scheduler.

## Run one cycle

From a clean checkout:

```bash
pnpm pipeline:status
pnpm pipeline:run
```

Codex is the default provider. Use `--provider claude` to select a locally authenticated Claude
CLI explicitly. One invocation performs
at most one action:

1. trusted feedback on the bottom-most affected stacked PR;
2. a missing consolidated, risk-aware review for a current PR head;
3. the next dependency-ready `agent:queued` delivery slice; or
4. nothing, when the configured PR limit is reached or no slice is ready.

Before a slice PR is opened, the pipeline records the flows the slice manifest declares and commits
each video to `delivery/evidence/<SLICE>/flows/<flow>.webm`, so the recording is reviewable from the
PR itself. UI-bearing feedback refreshes those recordings before publishing the updated head;
harness-only feedback skips that cost. GitHub Actions records no video; it still publishes traces and the HTML report as build
artifacts. Recording needs the local app stack (`pnpm db:up`, migrated, seeded, API running), and a
flow that fails or produces no recording stops the run before anything is published.

Implementation agents may edit and test the checkout but cannot commit, push or call GitHub.
Review agents are read-only. The pipeline owns labels, the marked status sections in descriptions,
commits, atomic stack rebases, pushes, PR creation and review statuses. It does not post routine PR
or issue comments. It refuses a dirty worktree, an unrecognised
provider, a diverged `main`, an already-existing slice branch or concurrent local invocation.

Useful options:

```bash
pnpm pipeline:run -- --dry-run
pnpm pipeline:run -- --review-only 12 --provider codex
pnpm pipeline:run -- --skip-reviews
pnpm pipeline:run -- --help
```

`--skip-reviews` is a recovery/debugging option; the next normal invocation detects and runs the
missing consolidated review before it claims another slice.

## Local prerequisites

- `gh` is authenticated to the repository and Git uses SSH or another non-interactive credential;
- at least one of `claude` or `codex` is installed and signed in;
- Node 22, pnpm 10.18.2 and project dependencies are installed;
- Playwright Chromium and the local database prerequisites exist for slices that need them.

The command loads the repository-root `.env` when present, then reads `GITHUB_TOKEN`,
`GITHUB_REPOSITORY`, `PIPELINE_MAX_OPEN_PRS`,
`TRUSTED_REVIEWERS` and `AGENT_PROVIDER` when present. Otherwise it obtains the GitHub token and
repository from `gh`, uses repository defaults, and defaults to Codex. The checked-in and local
default is `PIPELINE_MAX_OPEN_PRS=1`; increasing it explicitly re-enables stacked delivery.

Run `pnpm --filter @gp/pr-pipeline test` for the decision and local-command unit tests.
