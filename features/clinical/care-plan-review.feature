# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/07-chronic-condition-management.md
#   standards: [GP2.1, GP2.2, C5.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare
Feature: Reviewing a chronic condition management plan
  As a GP
  I want everything that happened since the last plan on one screen
  So that the review is substantive rather than a re-print

  Scenario: Reviewing uses MBS item 967
    When I review a GP Chronic Condition Management Plan
    Then item "967" is suggested at billing
    And item "732" is not offered

  Scenario: The review screen shows progress since the last plan
    When I open the review
    Then I see the previous plan's goals and progress against each
    And results since the last plan
    And medication changes since the last plan
    And allied health services used and any reports received

  @medicare @compliance
  Scenario: Claiming a review before the minimum interval requires an override
    Given the minimum interval since the last claim has not elapsed
    When I try to bill the review
    Then I am shown the earliest permissible date
    And billing requires an override with a recorded reason

  Scenario: Reviews due are surfaced opportunistically
    Given a patient's care plan review is due
    When they are arrived for any appointment
    Then the due review is shown to reception so it can be offered

  Scenario: The revised plan is given to the patient
    When the review completes
    Then the revised plan can be given to the patient
    And the fact it was given is recorded
