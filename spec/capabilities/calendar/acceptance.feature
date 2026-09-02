Feature: General-practice calendar

  Scenario: Empty slot pre-fills a booking
    Given Dr Lee is available at Brisbane Clinic at 10:30 for 15 minutes
    When a receptionist activates that empty slot
    Then the appointment editor is pre-filled with Brisbane Clinic, Dr Lee, the selected date and 10:30
    And no appointment exists until the receptionist selects a patient or hold and saves successfully

  Scenario: Concurrent booking loses no existing appointment
    Given two users are viewing the same available slot
    When the first user books it
    And the second user attempts to save a conflicting booking without overbook authority
    Then the second booking is not created
    And the existing booking remains unchanged
    And the second user's editor content is preserved with the conflict reason

  Scenario: Dragging is a proposal and has a keyboard equivalent
    Given an appointment is scheduled at 10:00
    When a user drags it to an unavailable time
    Then the committed appointment remains at 10:00
    And the reason is shown
    And the same move proposal can be made without dragging

  Scenario: Partial load failure does not look like free capacity
    Given one practitioner's calendar data fails to load
    When the multi-practitioner day view renders
    Then that practitioner's column is marked unavailable or stale
    And its time is not displayed as empty bookable capacity
