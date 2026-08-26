---
name: reviewing-architecture
description: Review a GP Clinic pull request for domain ownership, dependency direction, database design, contracts and test quality. Use for the architecture review lane; do not request broad refactors unrelated to the slice.
---

# Architecture change review

Compare the diff with `spec/architecture`, affected domain owners, contracts and accepted ADRs.
Trace new dependencies and state transitions rather than reviewing file organization alone.

Check for direct writes across domain owners, cyclic synchronous dependencies, duplicated truth,
incorrect lifecycle coupling, mutable historical snapshots, unsafe migration constraints/indexes,
lost concurrency semantics, contract drift and tests that only mirror the implementation.

For every finding explain the violated invariant or concrete maintenance/failure mode, exact
location, and smallest slice-scoped correction. Put desirable but unrelated redesigns in a
follow-up recommendation rather than blocking the PR. Do not modify the checkout.

