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
4. nothing, when the stack is full or no slice is ready.

Implementation agents may edit and test the checkout but cannot commit, push or call GitHub.
Review agents are read-only. The pipeline itself owns labels, comments, commits, atomic stack
rebases, pushes, PR creation and review statuses. It refuses a dirty worktree, an unrecognised
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

The command reads `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `PIPELINE_MAX_OPEN_PRS`,
`TRUSTED_REVIEWERS` and `AGENT_PROVIDER` when present. Otherwise it obtains the GitHub token and
repository from `gh`, uses repository defaults, and defaults to Codex.

Run `pnpm --filter @gp/pr-pipeline test` for the decision and local-command unit tests.
