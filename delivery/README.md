# Delivery control plane

This directory describes review-sized product work and its human evidence. It does not contain
the pipeline engine: polling, GitHub state transitions and stack operations live independently in
`tools/pr-pipeline`.

## Slice lifecycle

`backlog -> queued -> working -> in_review -> accepted -> delivered`

- `backlog`: shaped but not eligible for agent pickup.
- `queued`: eligible when dependencies are delivered and the open-PR limit has capacity.
- `working`: claimed by one agent run.
- `in_review`: implemented in an open PR with its required evidence.
- `accepted`: human-approved and waiting to merge.
- `delivered`: merged into the stack trunk.

The GitHub issue is the queue item; its body points to the authoritative manifest under `slices/`.
The manifest defines scope and traceability. GitHub labels are operational projections, not product
truth.

## Stack rules

- At most three agent-managed PRs are open.
- PRs form one native GitHub stack, bottom to top.
- Human review proceeds bottom to top; upper PRs remain visible for context.
- Feedback is applied to the layer that owns the change. Descendants are rebased and pushed
  atomically only after all local rebases succeed.
- Merges happen from the bottom up. The pipeline never approves or resolves human review threads.

## Evidence

Small deterministic screenshots are committed under `evidence/<slice-id>/screenshots/` so they can
render directly in a PR. Playwright videos, traces and HTML reports are uploaded as workflow
artifacts and linked from the PR. All evidence must use synthetic demo data.

