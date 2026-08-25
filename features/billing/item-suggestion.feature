# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/01-billing-at-point-of-care.md
#   standards: [C3.1, C1.5]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @compliance
Feature: MBS item suggestion
  As a GP
  I want the right items suggested from what actually happened
  So that I neither underbill nor bill something the record does not support

  Scenario Outline: Time-tiered attendance suggestions
    Given the recorded encounter duration is <minutes> minutes
    Then item "<item>" is suggested

    Examples:
      | minutes | item |
      | 6       | 3    |
      | 14      | 23   |
      | 27      | 36   |
      | 46      | 44   |

  Scenario Outline: Activity-driven suggestions
    Given the encounter included "<activity>"
    Then item "<item>" is suggested

    Examples:
      | activity                                    | item |
      | preparing a chronic condition management plan| 965  |
      | reviewing a chronic condition management plan| 967  |
      | an Aboriginal and Torres Strait Islander health assessment | 715 |

  @compliance
  Scenario: Every suggestion explains itself
    When items are suggested
    Then each shows why it was suggested

  @compliance @safety-critical
  Scenario: Nothing is billed automatically
    When items are suggested
    Then no invoice is created until the practitioner confirms

  @compliance
  Scenario: An item unsupported by the recorded time warns
    Given the recorded duration is 12 minutes
    When item "36" is selected
    Then a warning is shown that the recorded duration does not support the item
    And an override reason is required

  @compliance
  Scenario: Mental health items respect the training gate
    Given the practitioner does not hold Mental Health Skills Training
    Then items "2715" and "2717" are not among the suggestions
