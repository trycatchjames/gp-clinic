# Web component ownership

The authoritative visual language, atomic model, state contract, and maintained foundation
inventory live in [`spec/product/design-system.md`](../../../../../spec/product/design-system.md).
The `/foundations` route is the executable gallery.

Choose the lowest layer that can express the component without taking ownership of data or rules.

| Layer | Location | Owns | Must not own |
|---|---|---|---|
| Primitive | `components/ui` | Accessible interaction mechanics, visual variants and DOM semantics | API calls, permissions, domain state or routes |
| Pure pattern | `components/patterns` | Reusable compositions of primitives driven only by props and callbacks | SDK queries, authenticated context or capability rules |
| Capability-connected component | `features/<capability>/components` | API/query state, permission-aware presentation and capability-specific orchestration | Another domain's mutations or the only copy of a server-side rule |

Routes assemble capability features into screens. A component moves upward only when it needs the
higher layer's knowledge; a connected component is not made generic by hiding its API dependency.

Atomic labels describe composition, not folders: primitives are atoms, pure patterns are molecules,
capability components are organisms, and routes supply templates and pages. Do not add `atoms/`,
`molecules/`, or `organisms/` directories alongside the ownership layers above.
