# PR pipeline

This package owns the GitHub polling and dispatch loop. Product applications never import it.
It is intentionally a private workspace package so it can later move to a standalone repository
without changing product runtime code.

The loop keeps at most three `agent:managed` pull requests open. It prioritises trusted review
feedback on the bottom-most affected pull request, then claims the next dependency-ready
`agent:queued` issue. Ordinary PR comments only become work when they contain an explicit agent
command; formal change requests and inline review comments are automatically actionable.

Run `pnpm --filter @gp/pr-pipeline test` for pure decision tests and add `-- --dry-run` to the poll
command to inspect its next action without mutating GitHub.
