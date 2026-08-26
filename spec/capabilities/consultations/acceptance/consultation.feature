Feature: Consultation lifecycle and integrity

  Scenario: Preview does not start a consultation
    Given a patient is waiting
    When an authorised clinician previews the patient's record
    Then no encounter start time is recorded
    And the appointment does not enter in_consultation

  Scenario: Complete a consultation atomically
    Given a consultation note is durably saved
    And all issued actions have committed successfully
    When the responsible clinician completes the consultation
    Then the encounter is completed with the clinician and completion time
    And the note becomes read-only
    And the appointment advances to its billing handoff state

  Scenario: Failed prescription blocks ambiguous completion
    Given a prescription issue failed during a consultation
    And the prescription remains a draft
    When the clinician attempts to complete the consultation
    Then completion explains the unresolved prescription
    And the encounter remains in progress
    And the appointment does not advance to billing

  Scenario: Amendment preserves original
    Given a clinical note has been completed
    When an authorised clinician adds a correction with a reason
    Then a dated authored amendment is linked to the original
    And the original text remains available to authorised viewers
    And the correction does not impersonate the original author
