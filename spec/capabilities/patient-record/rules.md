# Patient record rules

- Every open, switch and mutation is bound to one internal patient identifier and visible identity banner.
- Clinical summary data distinguishes absent, not assessed, none known and unknown states.
- Medicare details and IHI, when present, are attributes with provenance, not the product's patient identity key.
- Completed clinical content is amended additively; demographic corrections retain audit history.
- Restricted items apply field/item-level policy and do not make ordinary absence indistinguishable from hidden content.
