# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/02-clinical-governance-and-incidents.md
#   standards: [QI3.1, C3.2, C3.5]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @safety-critical @offline
Feature: Incident reporting
  As anyone in the practice
  I want reporting to be fast and blame-free
  So that incidents actually get reported

  Scenario: Reporting is available from every screen
    When I am on any screen
    Then an incident reporting action is available

  Scenario: Reporting takes under two minutes
    When I report an incident
    Then I am asked only what happened, when, who was involved, whether a patient was affected and immediate actions

  Scenario: Anonymous reporting is possible
    When I report anonymously
    Then the incident is recorded without a named reporter
    And it is still triaged

  Scenario Outline: Incidents are categorised
    When I report an incident in category "<category>"
    Then it is triaged by that category

    Examples:
      | category            |
      | medication          |
      | diagnosis_and_results |
      | documentation       |
      | identification      |
      | infection_control   |
      | cold_chain          |
      | equipment           |
      | privacy             |
      | behaviour           |
      | emergency           |
      | near_miss           |

  Scenario: Investigation focuses on system factors
    When an incident is investigated
    Then contributing system factors are recorded
    And the investigation template does not ask who is at fault

  Scenario: Actions have owners and due dates
    When actions are created from an incident
    Then each has a named owner and a due date
    And they are tracked to completion

  Scenario: Recurring categories are trended
    Given four incidents in the same category occurred this quarter
    Then a trend is surfaced to the governance lead

  @offline
  Scenario: Incidents can be reported offline
    Given there is no connectivity
    When I report a near miss
    Then it is stored locally and queued
