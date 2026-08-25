# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/06-home-visits-aged-care-after-hours.md
#   standards: [GP1.3, GP2.1, C5.3, C1.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @compliance
Feature: After-hours arrangements
  As a practice
  I want our after-hours arrangements recorded and the information returned to us
  So that patients get care and their usual GP knows what happened

  Scenario: The arrangement drives what patients are told
    Given the after-hours arrangement is "deputising_service" with "Melbourne Medical Deputising Service" on "13 SICK"
    Then the practice information sheet states the service and the number
    And the same wording is available for the answering message

  @safety-critical
  Scenario: A deputising service report is tracked to acknowledgement
    Given a deputising service report arrives for "Margaret Doyle"
    When it is filed
    Then it is routed to her usual GP
    And it is tracked until acknowledged, not merely until read

  Scenario: An unacknowledged after-hours report escalates
    Given an after-hours report has been unacknowledged for 2 working days
    Then it is escalated to the practice manager

  Scenario: After-hours encounters by our own practitioners bill correctly
    Given the practice provides its own after-hours cover
    When an after-hours encounter is billed
    Then after-hours MBS items are suggested
    And the reason for the suggestion is the encounter time
