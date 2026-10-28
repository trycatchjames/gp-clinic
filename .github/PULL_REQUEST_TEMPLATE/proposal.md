# What this decides

<!-- The questions settled, in the words they were asked. Plain product language: no capability
     IDs, no file paths. Someone who was not in the session should understand what changed. -->

# What changes for staff

<!-- What a receptionist, nurse, practice manager or GP will be able to do that they could not
     before, or will do differently. One short paragraph or a few bullets. -->

# What gets built next

<!-- Each slice this releases, one line each: the actor and the outcome. Say that each has passed
     its readiness review, so the pipeline has nothing left to decide. -->

# Still open

<!-- Questions deferred to a later session, research still needed, or a decision a clinician
     should confirm before the work is built. Write "Nothing" if there is nothing. -->

# Safety

<!-- What a wrong, late, missing or failed record could cause, and what the interface must never
     imply. Write "No clinical or billing consequence" only when that is true. -->

---

<details>
<summary>What changed in the repository</summary>

- **Proposal:** `spec/proposals/P-###-....md`
- **Specification promoted:** the domain, capability, acceptance, cross-cutting and contract
  files this changed
- **Decision record:** the ADR added or amended, or "none"
- **Slices released:** `delivery/slices/....yaml`, each with its `ready` date and `decided_by`
- **Queue:** the topic removed from `spec/grill-queue.md`, and anything deferred added back

Validation run: `pnpm lint:spec`, `pnpm lint:slices`, `pnpm gate`.

</details>
