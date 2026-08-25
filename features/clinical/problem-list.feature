# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/02-health-summary-and-problem-list.md
#   standards: [QI2.1, C7.1, C5.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: The problem list
  As a GP
  I want coded problems that free text sits alongside
  So that the record is both precise and reportable

  Scenario: A problem is added from the consultation assessment
    When I record an assessment of "Type 2 diabetes mellitus"
    Then I can add it to the problem list without leaving the note

  Scenario: Problems are coded from a curated general practice subset
    When I search for a problem code
    Then I am searching a curated general practice subset, not the full terminology release
    And I can record free text alongside the code

  Scenario Outline: Problem status transitions
    Given a problem with status "active"
    When I set the status to "<status>"
    Then "<requirement>" is required

    Examples:
      | status   | requirement       |
      | resolved | a resolution date |
      | inactive | a reason          |

  Scenario: Chronic conditions drive care planning eligibility
    Given the patient has a coded problem flagged as chronic
    Then they appear on the chronic condition management eligibility list

  Scenario: Coded problems drive prescribing safety checks
    Given the patient has coded chronic kidney disease
    When an NSAID is prescribed
    Then a contraindication warning is shown
