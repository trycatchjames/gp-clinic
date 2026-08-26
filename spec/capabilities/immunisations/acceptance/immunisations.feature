Feature: Immunisation recording

  Scenario: Record a vaccine administered at the practice
    Given an authorised immuniser has verified the patient
    When they record vaccine, brand, batch, dose number, administration time, site, route and administering practitioner
    Then an administered_here immunisation is stored with that provenance
    And it appears in the patient's immunisation history

  Scenario: Historical dose does not impersonate the practice
    When a clinician records a vaccine from a patient-provided written history
    Then its source is documented_history with source detail
    And the current clinician/practice is not represented as the administrator

  Scenario: Version 1 does not claim AIR reporting
    Given an immunisation is recorded locally
    Then its AIR integration area states not connected in Version 1
    And it does not show submitted or accepted by AIR
