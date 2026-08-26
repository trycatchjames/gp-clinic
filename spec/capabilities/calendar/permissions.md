# Calendar permissions

- `appointment.view` sees calendar cards with permission-filtered identity/notes.
- `appointment.create/edit/reschedule/cancel/arrive/dna/flow.manage` independently enable actions.
- `appointment.overbook` adds the reasoned override; it does not allow booking during hard closure unless a separate approved policy says so.
- `availability.view/manage` controls session/block display versus mutation.
- `clinical.summary.view` is required to open clinical record; the calendar never leaks it to reception.
- A practitioner may be granted flow actions for their own book without general scheduling administration.
- Practice managers may see operational metrics without clinical appointment reasons. System administrators receive no calendar patient content by default.
