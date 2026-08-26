# Prescription lifecycle

`draft → issued → expired|cancelled|superseded`; `draft → discarded`.

- Drafts may be edited by their authorised owner/delegate and never appear as issued medication supply directions.
- Issue performs identity/context/allergy/completeness checks and fixes the rendered snapshot.
- Cancel requires prescriber authority and reason. It records internal cancellation only; Version 1 cannot assert external revocation.
- Supersede links old and replacement prescriptions. Expiry follows configured legal validity only after jurisdiction review; otherwise it is an explicit administrative status.
- Discarded drafts retain minimal audit metadata and recoverability policy but do not enter ordinary clinical timeline as issued.
