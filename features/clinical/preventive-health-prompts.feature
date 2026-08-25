# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/08-preventive-health.md
#   standards: [C4.1, QI1.3, QI2.1, GP2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Preventive health prompts
  As a clinician
  I want a short ranked list of what is due
  So that I act on prompts instead of learning to ignore them

  Scenario: Prompts are computed from age, sex, conditions and risk factors
    Given a 52 year old patient with no cardiovascular risk assessment in 5 years
    When I open their encounter
    Then a cardiovascular risk assessment prompt is shown

  Scenario: The prompt list is short and ranked
    Given 9 preventive activities are technically due
    When I open the encounter
    Then at most 3 prompts are shown by default
    And the rest are one click away

  Scenario: Each prompt carries its source
    When I hover a prompt
    Then the guideline source is shown

  Scenario: Prompts appear on the arrival screen so reception can offer them
    Given the patient is due for a flu vaccine
    When reception arrives them
    Then the due activity is offered

  Scenario: Completing an activity clears the prompt and sets the next due date
    When the activity is recorded as done
    Then the prompt clears
    And the next due date is calculated from the guideline interval
