# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/07-chronic-condition-management.md
#   standards: [GP2.1, GP2.3, C5.1, C1.3, C4.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare @compliance
Feature: GP Chronic Condition Management Plan
  As a GP
  I want to prepare a chronic condition management plan under the framework in force
  So that the patient gets coordinated care and the practice bills the correct item

  Background:
    Given the current chronic condition management framework applies from 1 July 2025
    And "Margaret Doyle" has coded chronic conditions

  Scenario: Eligible patients are surfaced
    Given "Margaret Doyle" has no current plan
    Then she appears on the chronic condition management eligibility list
    And the reason shown names her chronic conditions

  Scenario: Preparing a plan uses MBS item 965
    When I prepare a GP Chronic Condition Management Plan
    Then item "965" is suggested at billing
    And items "721" and "723" are not offered

  @medicare
  Scenario: MyMedicare status is shown at the point of planning
    When I open the care planning screen
    Then the patient's MyMedicare registration status is displayed
    And the effect on the pathway is explained

  @compliance
  Scenario: The plan records the patient's own goals
    When I prepare the plan
    Then the patient's goals are recorded in their own words
    And clinical targets are recorded separately

  @compliance
  Scenario: The patient must receive a copy
    When the plan is completed
    Then giving the patient a copy is a required step
    And the fact it was given is recorded

  Scenario: Allied health referrals are generated from the plan
    When I add allied health providers to the care team
    Then referrals are generated carrying the plan reference
    And they count against the patient's annual allocation

  Scenario: A patient may hold only one active plan
    Given "Margaret Doyle" has an active plan
    When I try to prepare another
    Then I am told she already has an active plan
    And I am offered a review instead
