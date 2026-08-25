# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/04-arrival-and-waiting-room.md
#   standards: [GP1.1, C6.1, GP2.2, C2.3]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @offline
Feature: Arrival and the waiting room
  As a receptionist
  I want everything I need on the arrival screen
  So that identity, entitlements, alerts and opportunities are handled in one pass

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"

  Scenario: The arrival screen shows everything reception needs at once
    When I arrive "Margaret Doyle"
    Then I see her identity confirmation prompt
    And her Medicare entitlement status
    And any outstanding account balance
    And her front-desk alerts
    And the activities due for her today

  Scenario: Contact details are re-confirmed periodically
    Given her mobile number was last confirmed 8 months ago
    When I arrive her
    Then I am prompted to confirm her mobile number

  Scenario: Due activities can be added to today's visit
    Given "Margaret Doyle" has a care plan review due and a flu vaccine due
    When I arrive her
    Then I can offer both
    And accepting adds them to the visit for the clinician to see

  Scenario: The waiting list highlights long waits
    Given a patient has been waiting 25 minutes
    And the practice threshold is 20 minutes
    Then their entry is highlighted

  Scenario: Running-late estimates are calculated from actual start times
    Given "Dr Tom Nguyen" has started his last four consultations an average of 18 minutes late
    Then his column shows "running about 18 minutes late"

  Scenario: Routing to the nurse before the GP
    Given the appointment requires pre-consultation observations
    When I arrive the patient
    Then their status becomes "with_nurse"
    And they appear on the nurse's list

  @offline
  Scenario: Arrivals work offline
    Given the practice has no internet connection
    When I arrive a patient
    Then the status change is recorded locally and queued
    And the waiting list updates immediately
