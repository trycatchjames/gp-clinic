# Patient-search rules

Search behaviour follows [`../../cross-cutting/search/requirements.md`](../../cross-cutting/search/requirements.md). Before registration, the system searches exact and normalised combinations and presents candidates; it never decides identity from a score. Search by Medicare/phone/address may return multiple family members. Merged-source selection redirects with survivor confirmation. A total search failure blocks the “no existing patient” assertion, although a governed emergency/provisional path may be available with duplicate-risk flag.
