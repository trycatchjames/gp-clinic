# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/03-mymedicare.md
#   standards: [GP2.1, GP2.4, C1.3]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @medicare @compliance
Feature: MyMedicare registration
  As a practice
  I want patients registered in MyMedicare where they choose to be
  So that they get continuity of care and access to the items that depend on it

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"
    And the practice is registered for MyMedicare

  Scenario: Eligible patients are surfaced
    Given "Margaret Doyle" has had 3 face-to-face visits here in the last 24 months
    And she is not registered in MyMedicare
    Then she appears on the MyMedicare candidate list
    And the reason shown is "3 face-to-face visits in the last 24 months"

  @compliance
  Scenario: Registration requires recorded consent
    When I record a MyMedicare registration for "Margaret Doyle"
    Then I must record that she consented
    And the consent records my name and the timestamp

  Scenario: A preferred GP is nominated at registration
    When "Margaret Doyle" is registered
    Then a preferred practitioner within the practice must be nominated

  @medicare
  Scenario: Registration changes what is offered at care planning
    Given "Margaret Doyle" is registered in MyMedicare
    When a GP Chronic Condition Management Plan is prepared
    Then the plan is linked to her MyMedicare registration
    And item "965" is offered as the primary path

  @medicare
  Scenario: An unregistered patient can still receive chronic condition management from their usual GP
    Given "Margaret Doyle" is not registered in MyMedicare
    And "Dr Tom Nguyen" is her usual GP
    When he prepares a chronic condition management plan
    Then item "965" is still available
    And the difference from the registered pathway is explained on screen

  Scenario: Withdrawal is immediate and needs no reason
    Given "Margaret Doyle" is registered
    When she withdraws
    Then her status becomes "withdrawn" with today's date
    And no reason is required
    And dependent prompts update immediately
