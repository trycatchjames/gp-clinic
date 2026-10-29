# Product documentation reader

A standalone reader for the repository's product documentation. The six core domains follow
[`core-domains.md`](../../spec/product/core-domains.md). The library also includes domain records,
shared requirements, contracts, decisions, research, proposals, acceptance examples and review
manifests. Repository instructions and application source are excluded.

From the repository root:

```bash
pnpm install
pnpm dev:docs
```

Open http://localhost:4174. No API, sign-in, database or clinical demo data is required.
Markdown changes reload the reader. Search covers document titles, paths and content. Each
document and heading has a shareable URL; relative links open the referenced document or folder.
The reader is read-only: edit the canonical Markdown in the repository.

## Share an artifact

```bash
pnpm docs:artifact
```

This generates `test-results/product-docs.zip` and its extracted folder. The ZIP contains a
snapshot of the rendered documentation, a Node server and a package manifest with **no runtime
dependencies**. Unzip it and run `npm start`, then open http://localhost:4174. Set `PORT` to use a
different port.

For a browser WebContainer, import the extracted files into a Node.js project in StackBlitz.
The included `.stackblitzrc` disables dependency installation and runs `npm start`, following
[StackBlitz's project configuration](https://developer.stackblitz.com/platform/webcontainers/project-config).
Share the resulting StackBlitz project with your collaborator. The artifact server serves only
`dist/`; it does not expose the repository filesystem.

Alternatively, deploy the generated `dist/` directory to a static host. Keep access appropriate
for your product documentation. The local URL is available only on your own machine unless you
provide hosting or forwarding. Rebuild the artifact when Markdown changes.

## Validation

```bash
pnpm --filter @gp/docs build
pnpm test:docs
```

The Playwright flow covers the domain order, relative links, acceptance examples, search,
document URLs, missing documents and mobile navigation. Screenshots, video and traces are
written under `test-results/docs/`.
