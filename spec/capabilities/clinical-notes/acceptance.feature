Feature: Clinical note drafts

  Scenario: Restore a draft after interruption
    Given a clinician has typed an uncompleted note for a patient
    And the client process closes unexpectedly after local recovery save
    When the same clinician reopens the encounter
    Then the system offers the draft with patient, encounter and recovery time
    And it does not represent the draft as committed or signed

  Scenario: Concurrent free-text edits are not silently merged
    Given two authorised contributors edit the same note version
    When the first version is durably saved
    And the second tries to save a stale version
    Then the second receives a concurrency conflict with both versions available
    And neither version is silently overwritten or automatically merged
