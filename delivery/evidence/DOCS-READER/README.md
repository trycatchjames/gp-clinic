# Product documentation reader evidence

The product collaborator can read canonical Markdown through the six core-domain groups, search
the complete documentation, follow dependency and heading links, and read acceptance examples.
This is repository documentation tooling; clinical application behaviour and record ownership do
not change.

- [Core-domain overview](screenshots/core-domains-desktop.png)
- [Calendar document](screenshots/calendar-desktop.png)
- [Mobile billing document](screenshots/billing-mobile.png)
- [Mobile domain ownership table](screenshots/domain-table-mobile.png)
- [Main-flow Playwright trace](flows/trace.zip)
- [Main-flow video](flows/video.webm)
- [Runnable documentation artifact](product-docs.zip)

Validation: `pnpm gate` passed, including generation, lint, type checking, specification and slice
validation, registry and architecture checks, 29 unit tests, 39 pipeline tests and production
builds. The existing Storybook suite contains no stories; its command exited successfully and its
build passed. `pnpm test:docs` passed four Chromium flows against the packaged artifact: reading
and links, full-text search and recovery, mobile reading and tables, and static-server boundaries.

The ZIP needs no installation or database: unzip it, run `npm start`, and open
http://localhost:4174. It also includes a `.stackblitzrc` configured to start this command in a
browser WebContainer. The artifact was tested using local Node and Chromium; a hosted StackBlitz
session was not exercised. A local URL is not accessible to a remote collaborator; share the ZIP,
import it into their WebContainer, or host its `dist/` directory.
