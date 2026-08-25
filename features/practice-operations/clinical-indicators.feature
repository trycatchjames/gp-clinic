# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/01-quality-improvement-and-accreditation.md
#   standards: [QI2.1, QI2.2, QI1.3]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations
Feature: Clinical indicators
  As a practice
  I want indicators calculated and trended
  So that we can see whether care is improving

  Scenario Outline: Indicators are calculated and trended
    Then the indicator "<indicator>" is calculated with a stated denominator

    Examples:
      | indicator                                    |
      | health summary completeness                  |
      | allergy recording                            |
      | smoking status recording                     |
      | medication review currency                   |
      | chronic condition management plan coverage   |
      | preventive activity completion               |
      | recall closure rate and time to closure      |
      | results actioned within target               |

  Scenario: Denominators are stated on the tile
    When I view an indicator
    Then the definition of the denominator is shown alongside the figure

  Scenario: Every indicator drills through to the patient list
    When I click an indicator
    Then the patients behind the figure are listed
    And the list is exportable

  Scenario: Snapshots are retained for trending
    When the nightly calculation runs
    Then a snapshot is retained
    And the trend over time can be displayed
