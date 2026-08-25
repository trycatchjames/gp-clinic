# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/01-appointment-booking.md
#   standards: [GP1.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @offline
Feature: Booking conflicts
  As a practice
  I want conflicting bookings prevented or surfaced
  So that two patients are never quietly given the same slot

  Scenario: Concurrent booking of the same slot is prevented
    Given two receptionists open the same empty slot at the same time
    When both confirm a booking
    Then exactly one booking succeeds
    And the other is told the slot was just taken and is offered the next available

  @offline
  Scenario: An offline booking that conflicts on sync becomes a conflict item
    Given I booked "Margaret Doyle" into 10:15 while offline
    And another user booked a different patient into 10:15 while I was offline
    When my outbox replays
    Then my booking is not silently dropped
    And a conflict item is created showing both appointments
    And reception resolves it explicitly

  Scenario: Booking outside session availability requires an override
    When I book into a time the practitioner is not rostered
    Then I am warned
    And I must record a reason
    And the override and reason are stored on the appointment

  Scenario: Overbooking records why
    When I overbook an urgent patient into a full session
    Then I must select an overbooking reason
    And the reason is available for reporting
