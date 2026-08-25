# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/06-practitioner-earnings.md
#   standards: [C3.1, C3.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: Earnings adjustments
  As a practice manager
  I want adjustments shown as explicit lines
  So that nothing is silently netted off a practitioner's pay

  @compliance
  Scenario: A rejected claim already paid out appears as an adjustment
    Given a claim was paid out to the practitioner and later rejected
    Then the next statement shows an explicit adjustment line
    And the reason and the original invoice are referenced

  Scenario Outline: Adjustments are itemised, never netted
    Given a <event> occurs
    Then the statement shows it as its own line

    Examples:
      | event                 |
      | refund to a patient   |
      | invoice write-off     |
      | billing correction    |

  @compliance
  Scenario: Statements are immutable
    Given a statement was issued
    When a correction is needed
    Then a new statement referencing the original is issued
    And the original is retained

  Scenario: Deductions are listed with their basis
    When deductions are applied
    Then the service fee, indemnity and any equipment charges are each listed with their basis
