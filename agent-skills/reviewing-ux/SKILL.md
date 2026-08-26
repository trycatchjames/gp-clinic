---
name: reviewing-ux
description: Review GP Clinic PR screenshots and Playwright flow evidence for story validity, task clarity, safe failure handling and accessibility. Use for UI-bearing slices; do not review visual taste without the actor, scenario and screen contract.
---

# UX evidence review

Read the slice, actor/persona, screen contract, acceptance scenarios and PR evidence before judging
the interface. Review the implemented flow, not isolated aesthetics.

Evaluate:

- whether the actor can identify the next action and complete the stated outcome;
- information hierarchy, terminology, density and continuity across the flow;
- loading, empty, failure, offline, unavailable, restricted and conflict recovery;
- whether safety warnings explain consequence and recovery without creating false success;
- keyboard path, focus, labels, error association, contrast and non-colour cues;
- consistency with existing primitives and patterns without sacrificing task clarity.

Separate story-invalidating problems from refinements. Cite the screenshot/flow and exact moment,
describe the user consequence, and propose a testable improvement. Missing required evidence is a
blocking review finding. Do not modify the checkout.

