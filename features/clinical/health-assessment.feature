# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/11-health-assessments.md
#   standards: [C4.1, GP2.1, QI1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare
Feature: Health assessments
  As a practice
  I want assessments structured and correctly billed
  So that nothing required is missed and the right item tier is claimed

  Scenario: Eligible patients are surfaced
    Given a patient turns 75 next month and has never had a health assessment
    Then they appear on the health assessment eligibility register

  Scenario: The nurse gathers, the GP assesses
    When a health assessment is started
    Then the nurse can complete the information gathering sections
    And the GP completes the assessment, plan and discussion sections

  Scenario Outline: The item tier follows the recorded duration
    Given the recorded assessment duration is <minutes> minutes
    Then item "<item>" is suggested

    Examples:
      | minutes | item |
      | 22      | 701  |
      | 38      | 703  |
      | 52      | 705  |
      | 70      | 707  |

  @compliance @medicare
  Scenario: Claiming a higher tier than the recorded time warns
    Given the recorded duration is 25 minutes
    When item "705" is selected
    Then a warning is shown that the recorded time does not support the item
    And an override reason is required

  @compliance
  Scenario: A written outcome must be given to the patient
    When the assessment is completed
    Then a written summary with identified issues, recommendations and agreed actions is produced
    And the fact it was given to the patient is recorded

  @medicare
  Scenario: Frequency limits are enforced
    Given a health assessment of this type was claimed 7 months ago
    And the frequency limit is annual
    When I try to claim again
    Then the next eligible date is shown
    And claiming requires an override with a reason

  Scenario: Findings flow into action
    Given the assessment identifies unmanaged chronic conditions
    Then preparing a chronic condition management plan is offered
    And due immunisations and screening are offered
