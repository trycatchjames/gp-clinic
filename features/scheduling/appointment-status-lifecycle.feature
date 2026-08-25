# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/04-arrival-and-waiting-room.md
#   standards: [GP1.1, C3.1, C7.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @offline
Feature: Appointment status lifecycle
  As a practice
  I want valid, timestamped status transitions
  So that waiting times, consultation lengths and billing evidence are trustworthy

  Scenario Outline: Valid transitions
    Given an appointment with status "<from>"
    When the status changes to "<to>"
    Then the transition is accepted
    And the timestamp and the acting user are recorded

    Examples:
      | from            | to               |
      | booked          | confirmed        |
      | confirmed       | arrived          |
      | arrived         | with_nurse       |
      | arrived         | waiting          |
      | with_nurse      | waiting          |
      | waiting         | in_consultation  |
      | in_consultation | completed        |

  Scenario Outline: Invalid transitions are rejected
    Given an appointment with status "<from>"
    When the status changes to "<to>"
    Then the transition is rejected

    Examples:
      | from     | to               |
      | booked   | completed        |
      | booked   | in_consultation  |
      | completed| arrived          |

  Scenario: Consultation duration is recorded automatically
    Given a consultation started at 10:02 and completed at 10:29
    Then the recorded duration is 27 minutes
    And the suggested MBS attendance item is "36"

  Scenario: Timestamps are immutable
    Given a status timestamp was recorded incorrectly
    When it is corrected
    Then a new entry is created with a reason
    And the original entry remains

  @offline
  Scenario: Offline status changes replay in timestamp order
    Given three status changes were made offline out of order
    When the outbox replays
    Then the status history reconstructs in timestamp order
