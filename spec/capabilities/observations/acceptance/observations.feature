Feature: Clinical observations

  Scenario: Preserve original unit and derived provenance
    Given height and weight are recorded with original values and units
    When the system calculates BMI using an approved formula version
    Then BMI links to the source observations and formula version
    And the original entered values and units remain unchanged

  Scenario: Correcting an observation preserves history
    Given an observation was recorded against the wrong unit
    When an authorised clinician marks it entered in error and records the corrected observation
    Then the corrected value appears in current trend
    And the original, actor, reason and correction link remain available to authorised viewers
