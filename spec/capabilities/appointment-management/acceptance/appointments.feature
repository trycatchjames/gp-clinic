Feature: Appointment lifecycle

  Scenario: Reschedule preserves history
    Given Jane Citizen is scheduled with Dr Smith at 10:00
    And Dr Smith is available at 10:30
    When an authorised receptionist moves the appointment to 10:30
    Then the current start is 10:30
    And the prior start, actor, time and reason are retained in appointment history

  Scenario: Arrival records actual flow and identity verification
    Given Jane Citizen has a scheduled appointment
    When reception verifies her using the approved three-identifier process and marks her arrived
    Then the appointment records the actual arrival time and verification event
    And she appears in the waiting room
    And no consultation is created yet

  Scenario: DNA does not close a recall
    Given an appointment is linked to an open clinical recall
    When the patient is marked did not attend
    Then the appointment state is did_not_attend
    And the recall remains open
    And the recall returns to or remains in a contact/escalation state

  Scenario: Reception cannot start a clinical encounter
    Given a receptionist can manage appointment flow but lacks encounter.start
    When the receptionist views an arrived appointment
    Then Start consultation is unavailable
    And direct invocation is denied without creating an encounter

  Scenario: Recurring booking previews conflicts and preserves occurrences
    Given a receptionist proposes six weekly appointments
    And the fourth occurrence conflicts with practitioner leave
    When the recurrence is previewed
    Then all six proposed dates and the fourth conflict are shown
    And no occurrences are silently created before confirmation
    When the receptionist excludes the conflicting occurrence and confirms the other five
    Then five appointments are created
    And each successfully created occurrence has its own appointment identifier and history
