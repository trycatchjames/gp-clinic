# Existing Australian software observations

This is comparative workflow research, not a requirement to reproduce a product. Sources are public product help; wording and layouts are not copied.

## Recurring mental models

- **Appointment book plus waiting room.** Best Practice, MedicalDirector, Zedmed and Genie's public legacy manual treat the appointment book as a live operations surface. Arrival starts visible waiting time; the clinician starts care; completion hands work to billing. Multiple practitioner schedules and location filters are normal. [BP-WAITING; BP-VISIT; MD-APPTS; ZED-WAITING; GENIE-APPTS]
- **Clinical summary plus timeline/tree.** A compact always-visible region holds allergies, medicines and key problems, while consultation entries, results, letters and actions are chronological or category-filterable. Direct access to related clinical work from patient context is a repeated pattern. [MD-TIMELINE; BP-ALLERGIES; GENIE-CLINICAL; MEDIRECORDS-DASHBOARD]
- **Provider inbox and unmatched queue.** Results are grouped by responsible clinician, require action and may generate recall/follow-up. Items without a confident patient or provider match remain visible for resolution, and review should not remove an item before associated action is durably recorded. [BP-RESULTS; MD-RESULTS; ZED-RESULTS; MEDIRECORDS-RESULTS]
- **Configuration-driven templates.** Appointment types, reminder reasons, fees, session patterns, document templates and result actions are practice-configurable to reduce repeated entry.
- **Keyboard support.** Mature desktop products expose shortcuts for appointment book, waiting room, search and inbox because users repeat these flows all day.
- **Source-linked contact history.** Patient contact attempts are most useful when linked to the result, recall or reminder that caused them, not only stored as generic notes. [BP-REMINDERS]

## Useful patterns retained conceptually

- preview a patient record without starting a consultation;
- display scheduled time, arrival time, wait duration and status together;
- create an appointment from an empty slot with practitioner/date/time prefilled;
- open unchecked results for one patient from the patient record while retaining inbox responsibility;
- show future appointments and outstanding follow-up in patient context;
- allow predefined reasons while retaining a controlled free-text explanation where needed;
- preserve document/result provenance and the action taken in the patient timeline.

## Friction and risks the new specification avoids

- Terminology such as recall, reminder, action and outstanding request differs between products, creating migration and training ambiguity. Canonical definitions are obligation-based.
- Colour-heavy legacy screens can carry status without accessible text/icon semantics. Colour is supplementary only.
- “Delete” is sometimes offered for appointments, results, recalls or clinical artefacts. Version 1 uses cancellation, entered-in-error and archive semantics with retained history.
- Appointment notes can become an unsafe substitute for structured recall or clinical alerts. Notes cannot discharge those obligations.
- A single appointment-type field may be overloaded to mean visit mode, reason, recall association and billing class. These are separate attributes.
- Broad “clinical side” role access is too coarse. Permission and contextual restriction are explicit.
- Free-text reason catalogues easily fragment reporting. Standard local concepts have stable identifiers; display labels can change without rewriting history.

## Information density

Australian products favour dense desktop workspaces because users need simultaneous context. The specification keeps density where it answers immediate questions—who is waiting, what is overdue, which result is selected—but requires clear hierarchy, responsive fallback, accessible names and progressive detail. “Modern” must not mean hiding every action behind separate pages. The older Genie manual is used only to identify long-standing workflow expectations, not as evidence of the current product.

## No proprietary copying

No screenshot, text, code, exact shortcut map or visual arrangement from these systems is part of this specification. Future design validation should use original prototypes tested with practising staff.
