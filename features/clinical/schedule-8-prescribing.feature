# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/03-prescribing.md
#   standards: [QI2.2, QI3.1, C5.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical @compliance
Feature: Schedule 8 prescribing and real-time prescription monitoring
  As a GP
  I want the three separate obligations kept separate
  So that I do not mistake a PBS authority for a state permit or an RTPM check

  Background:
    Given I am prescribing a Schedule 8 medicine

  Scenario: The three obligations are shown as separate line items
    When I open the prescribing screen
    Then I see a distinct status for the real-time prescription monitoring check
    And a distinct status for the state or territory Schedule 8 permit or authority
    And a distinct status for the PBS Authority
    And the screen states that completing one does not satisfy the others

  @safety-critical
  Scenario Outline: RTPM checking is required where the jurisdiction mandates it
    Given the practice location is in "<state>"
    When I try to issue the Schedule 8 prescription without recording an RTPM check
    Then issuing is "<outcome>"

    Examples:
      | state | outcome |
      | VIC   | blocked |
      | QLD   | blocked |
      | NSW   | warned  |
      | SA    | warned  |
      | WA    | warned  |

  Scenario: The correct RTPM system is named for the jurisdiction
    Given the practice location is in "QLD"
    Then the check is labelled "QScript"

  @safety-critical
  Scenario: Initiating an S8 by telehealth is restricted
    Given the encounter type is "telehealth_video"
    And this would be a new Schedule 8 prescription for this patient
    Then I am warned that most jurisdictions restrict initiating Schedule 8 without a face-to-face assessment
    And I must record a reason to proceed

  Scenario: Continuing an existing S8 by telehealth is permitted
    Given the patient is established on this Schedule 8 medicine
    And the encounter type is "telehealth_video"
    Then continuation is permitted without the initiation warning

  Scenario: The permit and its expiry are recorded
    When I record a state Schedule 8 permit
    Then the permit number, jurisdiction, drug, patient and expiry are stored
    And an alert is raised before it expires
