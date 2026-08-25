# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/06-fee-schedules-and-billing-setup.md
#   standards: [C1.5, C3.1]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @medicare @compliance
Feature: Practice billing policy
  As a practice owner
  I want to set how we bill
  So that the point-of-care billing screen suggests the right payer every time

  Background:
    Given I am signed in as the owner of "Brunswick Family Practice"

  Scenario Outline: Choosing a billing policy
    When I set the billing policy to "<policy>"
    Then the default suggested payer for an eligible service is "<payer>"

    Examples:
      | policy         | payer                 |
      | bulk_bill_all  | medicare_bulk_bill    |
      | private        | private               |
      | mixed          | resolved_by_cohort    |

  Scenario: BBPIP participation forces bulk_bill_all
    Given the practice participates in the Bulk Billing Practice Incentive Program
    When I open the billing policy setting
    Then the policy is "bulk_bill_all"
    And I cannot change it without first withdrawing from BBPIP

  Scenario: Mixed billing cohort rules
    Given the billing policy is "mixed"
    When I enable bulk billing for:
      | cohort                                  |
      | Commonwealth concession card holders    |
      | Children under 16                       |
      | DVA card holders                        |
      | Aboriginal and Torres Strait Islander patients |
    Then a patient matching any cohort resolves to "medicare_bulk_bill"
    And other patients resolve to "private"

  Scenario: A per-patient billing override beats the cohort rules
    Given patient "Margaret Doyle" has a billing override of "always bulk bill"
    And the billing policy is "private"
    When she is billed
    Then the suggested payer is "medicare_bulk_bill"
    And the reason shown is "Patient billing override"
