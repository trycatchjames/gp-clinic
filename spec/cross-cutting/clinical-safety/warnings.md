# Warning contract

## Categories

- **hard stop:** action cannot safely/legally continue (wrong/missing patient context, invalid state, unauthorised prescriber, lost concurrency, audit failure);
- **override warning:** action may be appropriate after review (authorised overbook, possible duplicate, locally known allergy match, stale assessment);
- **attention flag:** persistent fact needing awareness (unassessed allergies, open urgent recall, sensitive contact restriction);
- **information:** non-risk confirmation or help.

## Required warning content

Warnings name the affected patient/object, the risk/fact, source or trigger, safe next action, and whether/how override is available. They never use colour alone. An override captures user, practitioner context, reason, time, warning version and outcome.

## Specific safety surfaces

- Patient switching while a draft exists requires save/discard/recover decision and shows both identities.
- Similar-name/DOB candidates are visually distinct and never auto-selected.
- Allergy display differentiates active reaction, asked-none-known and not assessed.
- Prescription issue displays the current allergy state and patient/prescriber/location.
- Result correction or patient reassignment reopens clinical review.
- Closing result/recall shows remaining linked actions and prevents false closure.
- Completing consultation shows unsaved note/action failures and blocks until resolved.
- Deceased/inactive patient actions warn and require appropriate permission/reason.
- Manual external-status recording is labelled “recorded by user”, not confirmed by payer/provider.

## Anti-fatigue rules

Warnings must not recur within the same resolved decision unless context changes. The system measures trigger, override and abandonment rates without collecting unnecessary clinical text. High override rates require governance review, not automatic suppression.
