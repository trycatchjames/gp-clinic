# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/05-appointment-types-and-books.md
#   standards: [GP1.1, C2.3]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup
Feature: Practitioner session templates and availability
  As a practice manager
  I want each practitioner's recurring availability defined per location
  So that the book only offers slots that actually exist

  Background:
    Given I am signed in as the practice manager of "Brunswick Family Practice"

  Scenario: Creating a recurring session
    When I create a session for "Dr Tom Nguyen":
      | field        | value               |
      | location     | Brunswick           |
      | day_of_week  | Tuesday             |
      | start        | 08:30               |
      | end          | 12:30               |
      | slot_minutes | 15                  |
      | online       | true                |
    Then Tuesday mornings show availability in the book
    And online booking offers those slots

  Scenario: A 30-minute appointment consumes two 15-minute slots
    Given a session with a 15 minute slot size
    When a "Long consultation" of 30 minutes is booked at 09:00
    Then 09:00 and 09:15 are both unavailable
    And 09:30 remains available

  Scenario: A session cannot extend beyond opening hours without an override
    Given the location closes at 18:00
    When I create a session ending at 19:00
    Then I am warned it extends beyond opening hours
    And I must record a reason to proceed

  Scenario: Leave removes availability and surfaces affected appointments
    Given "Dr Tom Nguyen" has 18 appointments in the week of "2026-10-05"
    When I record leave for that week
    Then the 18 appointments are listed for rebooking
    And no availability is offered for him that week
    And none of the appointments is cancelled automatically

  Scenario: Slot size must divide the session evenly
    When I create a session from 09:00 to 12:00 with a 25 minute slot size
    Then I am told the slot size must divide evenly into the session length
