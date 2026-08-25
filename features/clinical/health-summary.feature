# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/02-health-summary-and-problem-list.md
#   standards: [QI2.1, C7.1, C5.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Health summary
  As a practice
  I want complete health summaries
  So that any clinician can pick up a patient's care safely

  Scenario: A complete summary contains all required sections
    When I view a patient's health summary
    Then it shows allergies and adverse reactions
    And current medicines
    And active problems
    And past history
    And immunisations
    And family history
    And social history
    And risk factors

  @safety-critical
  Scenario: Allergy status must be positively recorded
    Given the patient's allergy status has never been recorded
    When any clinician opens the record
    Then "Allergies not recorded" is displayed prominently
    And "Nil known" is available as a recordable value

  Scenario: Completeness is measured and the gaps are listed
    When the practice runs the health summary report
    Then the completeness percentage is shown for active patients
    And the definition of "active" is stated on the tile
    And the specific patients missing each section can be listed

  Scenario: The summary is printable for handover
    When a patient is admitted to hospital
    Then a handover summary can be produced containing current medicines, allergies and active problems

  @offline
  Scenario: The summary is readable offline for cached patients
    Given the patient is on today's list and the device is offline
    When I open their health summary
    Then it renders from the cache with an "as at" timestamp
