# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/02-entitlements-and-verification.md
#   standards: [C1.5, C3.1, C6.4]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @medicare @compliance
Feature: Entitlement verification
  As a receptionist
  I want the patient's Medicare, DVA and concession status visible at arrival
  So that we bill correctly and nobody gets an unexpected account

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"

  Scenario Outline: Entitlement status drives the arrival prompt
    Given the patient's Medicare entitlement status is "<status>"
    When I arrive the patient
    Then I am prompted to "<prompt>"

    Examples:
      | status     | prompt                          |
      | verified   | proceed                         |
      | unverified | sight the card                  |
      | expired    | obtain current card details     |

  Scenario: Sighting a card records who and when
    When I mark the Medicare card as sighted
    Then the verification records my name, the timestamp and method "card_sighted"
    And the status becomes "verified"

  Scenario: Verification goes stale after the configured window
    Given the practice staleness window is 90 days
    And the card was last verified 91 days ago
    Then the status shows as "unverified"

  @compliance
  Scenario: Bulk billing requires a valid entitlement
    Given the patient's Medicare card is expired
    When bulk billing is attempted
    Then it is blocked
    And I am told a current Medicare entitlement is required

  @compliance
  Scenario: A patient with no Medicare entitlement gets a written estimate
    Given the patient has no Medicare entitlement
    When an appointment is booked
    Then a written estimate of the full fee must be produced and acknowledged before the service

  @compliance
  Scenario: Entitlement numbers are masked in lists and revealing them is logged
    When I view a patient list
    Then Medicare numbers are masked
    And revealing a full number writes an audit entry
