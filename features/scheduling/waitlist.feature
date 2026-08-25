# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/02-online-booking-and-waitlist.md
#   standards: [GP1.1, C2.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling
Feature: Waitlist
  As a practice
  I want cancelled slots offered to waiting patients
  So that access improves and capacity is not wasted

  Scenario: Joining the waitlist
    Given no suitable slot is available
    When I add "Margaret Doyle" to the waitlist with urgency "high" and preferred practitioner "Dr Tom Nguyen"
    Then she is on the waitlist with her availability preferences recorded

  Scenario: A cancellation triggers matching
    Given a 10:15 appointment with "Dr Tom Nguyen" is cancelled
    When the waitlist is matched
    Then candidates are ranked by urgency, then preference fit, then time waiting

  Scenario: An offer is held for a limited time
    When the slot is offered to the top match by SMS
    Then the slot is held for 30 minutes
    And if unclaimed it is released and offered to the next match

  Scenario: Claiming an offer books the appointment
    When the patient replies to accept within the hold period
    Then the appointment is booked
    And the waitlist entry is closed

  Scenario: A waitlist entry linked to a clinical need is not silently dropped
    Given a waitlist entry exists because a recall appointment was cancelled
    When the entry expires without a booking
    Then the underlying recall remains open and is escalated
