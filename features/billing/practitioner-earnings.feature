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
Feature: Practitioner earnings
  As a practice manager
  I want earnings calculated on receipts with the arithmetic shown
  So that the monthly pay conversation is short

  Scenario Outline: Remuneration models
    Given "Dr Tom Nguyen" is on the "<model>" model
    Then his earnings are calculated as "<basis>"

    Examples:
      | model                  | basis                                    |
      | percentage_of_billings | a percentage of receipts                 |
      | salary                 | a fixed amount, with billings reported   |
      | sessional              | a rate per session worked                |
      | hybrid                 | a base plus a percentage above a threshold |

  @compliance @safety-critical
  Scenario: Earnings accrue on payments received, not invoices raised
    Given an invoice was raised on 1 September and paid on 22 September
    Then the earnings accrue in the period containing 22 September

  @medicare
  Scenario: The BBPIP incentive is split 50/50
    Given the practice participates in BBPIP
    When the incentive is allocated
    Then the practitioner's half appears as its own line on their statement

  Scenario: The statement shows the arithmetic
    When a statement is produced
    Then every invoice, payment and deduction is listed
    And the calculation is shown rather than only the total

  @compliance
  Scenario: A practitioner sees only their own earnings
    Given I am signed in as "Dr Tom Nguyen"
    When I open earnings
    Then I see my own statements only

  Scenario: Arrangements are versioned by effective date
    Given the percentage changed on 1 July
    Then statements before that date use the old percentage
    And statements after it use the new one
