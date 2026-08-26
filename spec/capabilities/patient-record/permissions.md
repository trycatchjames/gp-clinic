# Patient-record permissions

The workspace assembles a field/section projection from permissions. `clinical.summary.view` gives current summary; `clinical.entry.view` gives timeline detail; sensitive, billing, correspondence and audit require separate grants. Reception receives PatientAdministrativeSummary and safe operational alerts. A hidden tab must also be inaccessible through direct link/export. Break glass follows the cross-cutting contract and is never silent.
