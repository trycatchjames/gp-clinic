# Calendar rules

1. Calendar working date and appointments display in selected location timezone; changing location recalculates the view and never mutates bookings.
2. Only active appointments consume ordinary capacity. Cancelled/DNA may be optionally shown as historical overlays and are never draggable as active bookings.
3. Practitioner sessions, leave, closures, blocks and resource constraints are visually distinct from empty bookable time.
4. Selecting an empty slot proposes a start/practitioner/location. The editor requires patient/hold, type and positive duration before save.
5. Creating/moving revalidates availability, overlaps and resources atomically. A stale visual slot may therefore fail safely with the latest reason.
6. Double-book is unavailable unless policy and `appointment.overbook` permit it; confirmation names conflicting bookings without disclosing clinical notes and requires reason.
7. Status transitions expose only currently valid actions. Time passing never automatically marks arrival/DNA/completion.
8. Current time appears only when the selected day is current in the selected location.
9. Waiting duration uses actual arrival/waiting time; scheduled lateness and waiting duration are separate.
10. Calendar patient snippets and notes respect administrative permissions and sensitive-record restrictions.

## Appointment card information

Mandatory: patient/hold display, start, duration (also spatial), status and practitioner in views where column identity is not sufficient. Secondary: type, visit mode, arrival/wait signal, resource/recall/add-on/reception-safe flags. Full contact, history and action details appear on selection, not all cards.

## Keyboard model

Tab/roving-grid navigation reaches filters, date controls, time slots/cards and context actions. Arrow keys move within the time/practitioner grid with an announced destination; Enter opens; a command opens “move appointment” without requiring drag. Product-wide shortcuts may be introduced only after user testing and published help.
