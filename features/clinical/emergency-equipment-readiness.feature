# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/15-emergencies.md
#   standards: [C3.3, GP5.2, GP5.3, C8.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Emergency equipment readiness
  As a practice manager
  I want expiries and checks tracked
  So that the equipment works the day we need it

  Scenario Outline: Readiness items are tracked with expiry
    Given the practice tracks "<item>"
    When the expiry or service date approaches
    Then a task is created
    And overdue items appear on the practice dashboard

    Examples:
      | item                          |
      | defibrillator pads            |
      | defibrillator battery         |
      | emergency drugs               |
      | oxygen cylinder level         |
      | doctor's bag contents         |
      | staff CPR training            |
      | anaphylaxis training          |

  Scenario: Doctor's bags are tracked per practitioner
    Then each practitioner's doctor's bag has its own contents and expiry record

  Scenario: Overdue safety-critical equipment escalates
    Given the defibrillator check is 14 days overdue
    Then it is escalated beyond a routine task

  Scenario: Drill records are retained as evidence
    When an emergency response drill is recorded
    Then it is available as accreditation evidence for C3.3
