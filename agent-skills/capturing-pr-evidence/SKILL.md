---
name: capturing-pr-evidence
description: Capture deterministic screenshots and Playwright flow evidence for a GP Clinic delivery slice. Use when UI behaviour or visual states change; do not use synthetic mockups as proof of implemented functionality.
---

# Capture PR evidence

1. Read the slice manifest, capability `review.yaml`, screen contract and acceptance scenarios.
2. Start from the named synthetic fixture and exercise the real app through Playwright. Do not use
   real patient, staff, practice or credential data.
3. Capture every screenshot ID selected by the slice at a deterministic viewport and state. Store
   reviewable PNGs under `delivery/evidence/<slice-id>/screenshots/<evidence-id>.png`.
4. Record the primary flow with Playwright video and trace enabled. Videos, traces and the HTML
   report remain workflow artifacts; link them from the PR instead of committing large recordings.
5. Include loading, empty, failure, restricted, offline or safety states when the screen contract
   or slice names them. A mocked component is insufficient when the story crosses API boundaries.
6. Inspect the images for clipping, stale/demo leakage and incorrect state before marking evidence
   complete. Run the evidence validator and report the exact commands and fixture used.

Never edit an image to hide a product defect. Fix the implementation and recapture it.

