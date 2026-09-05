# Web component ownership

The authoritative visual language, atomic model, state contract, and maintained foundation
inventory live in the
[`spec/product/design-system/`](../../../../../spec/product/design-system/README.md) contract.
The `/foundations` route is the executable gallery.

Choose the lowest layer that can express the component without taking ownership of data or rules.

| Layer | Location | Owns | Must not own |
|---|---|---|---|
| Primitive | `components/ui` | Accessible interaction mechanics, visual variants and DOM semantics | API calls, permissions, domain state or routes |
| Pure pattern | `components/patterns` | Reusable compositions of primitives driven only by props and callbacks | SDK queries, authenticated context or capability rules |
| Capability-connected component | `features/<capability>/components` | API/query state, permission-aware presentation and capability-specific orchestration | Another domain's mutations or the only copy of a server-side rule |

Routes assemble capability features into screens. A component moves upward only when it needs the
higher layer's knowledge; a connected component is not made generic by hiding its API dependency.

## Search and list standard

- Keep the primary query visible and place secondary filters, active-filter state and result count
  in one compact region.
- Lead rows with the name or task object. Put the facts people use to distinguish candidates next;
  internal and external reference numbers stay secondary.
- Keep normal rows to two lines. Use a separate detail region only after selection.
- Focus movement never selects. Selection needs a non-colour cue and a clear way back to the query.
- Put reusable density, hierarchy, responsive and keyboard behaviour in `components/patterns` and
  demonstrate it on `/foundations` before a capability adopts it.

Atomic labels describe composition, not folders: primitives are atoms, pure patterns are molecules,
capability components are organisms, and routes supply templates and pages. Do not add `atoms/`,
`molecules/`, or `organisms/` directories alongside the ownership layers above.
