Feature: Safe practice configuration

  Scenario: Availability change previews affected bookings
    Given a practitioner has future appointments in an active session
    When a manager drafts leave overlapping that session
    Then the impact preview lists the affected appointments
    And activating leave does not silently cancel or move them
    And an exception worklist remains until they are resolved

  Scenario: Hard safety invariants cannot be disabled
    Given a manager can edit practice settings
    When they attempt to configure completed clinical notes as freely editable
    Then activation is rejected
    And the current configuration remains active

  Scenario: Failed fee activation preserves current fees
    Given a new dated fee schedule draft has validation errors
    When a manager attempts to activate it
    Then activation fails with the errors
    And the existing effective fee schedule remains unchanged
