Feature: Patient record safety context

  Scenario: Allergy data failure is not displayed as none known
    Given a clinician opens a patient's record
    And the allergy domain cannot be loaded
    Then the allergy region states that allergy information is unavailable
    And it does not state no known allergies
    And prescribing is blocked until the required context is available

  Scenario: Reception receives an administrative projection
    Given a receptionist has demographic and appointment permissions but no clinical permissions
    When the receptionist opens a patient from an appointment
    Then identity, safe contact and reception-safe alerts are shown
    And clinical notes, results, problems, medicines and allergies are not returned

  Scenario: Patient switching cannot rebind a draft
    Given a clinician has an unsaved note draft for Patient A
    When the clinician attempts to open Patient B
    Then the system requires a safe save, discard or recover-later decision
    And the draft remains bound to Patient A
    And no text from the draft appears in Patient B's record
