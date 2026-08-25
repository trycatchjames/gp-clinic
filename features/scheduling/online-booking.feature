# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/02-online-booking-and-waitlist.md
#   standards: [GP1.1, C1.1, C1.5, C2.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @safety-critical
Feature: Online booking
  As a patient
  I want to book online
  So that I do not have to phone during business hours

  Scenario: An existing patient verifies by code
    Given I am an existing patient with a registered mobile
    When I identify myself by name and date of birth
    Then a verification code is sent to my registered mobile
    And I must enter it before I can see availability

  Scenario: Reasons are chosen from a curated list
    When I start a booking
    Then I choose a reason from the practice's list
    And I may add free text in addition

  @safety-critical
  Scenario Outline: Red-flag reasons stop the online booking
    When I select the reason "<reason>"
    Then no appointment is offered
    And I am shown the practice's message and the instruction to <instruction>

    Examples:
      | reason                        | instruction              |
      | Chest pain                    | call 000                 |
      | Difficulty breathing          | call 000                 |
      | Face drooping or arm weakness | call 000                 |
      | Thoughts of harming myself    | call the practice now    |

  @compliance
  Scenario: The cost is shown before confirmation
    When I reach the confirmation step
    Then the expected out-of-pocket cost is shown
    And I cannot confirm without seeing it

  Scenario: Booking constraints are honoured
    Given the appointment type has 2 hours minimum notice and 90 days maximum advance
    Then no slot within 2 hours is offered
    And no slot beyond 90 days is offered

  Scenario: A patient cannot hoard slots
    Given I already hold 3 future online bookings
    When I try to book a fourth online
    Then I am asked to call the practice instead

  Scenario: Online bookings are flagged for the practice
    When a booking is made online
    Then it is marked as an online booking in the appointment book
