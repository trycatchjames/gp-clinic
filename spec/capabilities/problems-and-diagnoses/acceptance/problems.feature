Feature: Problems and encounter diagnoses

  Scenario: Diagnosis is not silently promoted
    Given a clinician records a provisional diagnosis in a consultation
    When the consultation is completed without selecting add to problem list
    Then the diagnosis remains in the encounter
    And no active longitudinal problem is created

  Scenario: Reactivate a resolved problem
    Given a problem is recorded resolved
    When an authorised clinician reactivates it with clinical date/reason
    Then it returns to active
    And the earlier active and resolved periods remain in history
