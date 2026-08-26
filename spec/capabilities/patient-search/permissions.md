# Patient-search permissions

`patient.search` is purpose/scope-limited and returns an administrative result shape. `patient.demographics.view` opens ordinary demographics. Clinical summary/entries, sensitive records, billing and merge history require separate permissions. Restricted candidates appear only as safe stubs where needed to prevent wrong-patient/duplicate risk. Search/open attempts are audited proportionately.
