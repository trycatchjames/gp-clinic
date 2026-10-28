# Web component ownership

The authoritative visual language, state contract, UX patterns and maintained component inventory
live in the
[`spec/product/experience/`](../../../../../spec/product/experience/README.md) contract.
Storybook is the executable gallery; `/foundations` remains as the delivered `UI-001` evidence
surface.

Each pattern page owns one product problem and is authoritative for the components listed at its
foot. Read the page before changing one of them.

Choose the lowest layer that can express the component without taking ownership of data or rules.

| Layer | Location | Owns | Must not own |
|---|---|---|---|
| Primitive | `components/ui` | Accessible interaction mechanics, visual variants and DOM semantics | API calls, permissions, domain state or routes |
| Pure pattern | `components/patterns` | Reusable compositions of primitives driven only by props and callbacks | SDK queries, authenticated context or capability rules |
| Capability-connected component | `features/<capability>/components` | API/query state, permission-aware presentation and capability-specific orchestration | Another domain's mutations or the only copy of a server-side rule |

Routes assemble capability features into screens. A component moves upward only when it needs the
higher layer's knowledge; a connected component is not made generic by hiding its API dependency.

Do not add `atoms/`, `molecules/` or `organisms/` directories alongside the ownership layers above.
A component's layer is where it lives and what it may know, not a label borrowed from a taxonomy.

## Search and list standard

See [finding records](../../../../../spec/product/experience/patterns/finding-records.md) for the
full pattern. In short:

- Keep the primary query visible and place secondary filters, active-filter state and result count
  in one compact region.
- Lead rows with the name or task object. Put the facts people use to distinguish candidates next;
  internal and external reference numbers stay secondary.
- Keep normal rows to two lines. Use a separate detail region only after selection.
- Focus movement never selects. Selection needs a non-colour cue and a clear way back to the query.
- Put reusable density, hierarchy, responsive and keyboard behaviour in `components/patterns` and
  demonstrate it in the gallery before a capability adopts it.
