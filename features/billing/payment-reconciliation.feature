# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/05-claiming-and-reconciliation.md
#   standards: [C3.1, C3.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: Payment reconciliation
  As a practice manager
  I want payments matched to claims with exceptions surfaced
  So that underpayments are never quietly absorbed

  Scenario: Automatic matching where references align
    When a remittance arrives with matching references
    Then the payments are matched to their claims automatically

  Scenario: Manual matching where they do not
    When a payment cannot be matched automatically
    Then it appears in a manual matching queue

  @compliance
  Scenario: An underpayment is an exception, not an adjustment
    Given a claim expected $87.10 and $45.05 was paid
    Then the difference is raised as an exception requiring a decision
    And it is not silently written off

  @compliance
  Scenario: Payments are never left unallocated without a reason
    When a payment remains unallocated at the end of the day
    Then a reason must be recorded
    And it appears on the outstanding reconciliation list

  Scenario: Reconciled claims close
    When a claim is fully paid and matched
    Then its status becomes "paid"
    And it leaves the outstanding list
