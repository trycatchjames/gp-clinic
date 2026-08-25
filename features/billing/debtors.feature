# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/03-private-billing-and-payments.md
#   standards: [C3.1, C2.1, C1.5]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing
Feature: Debtors
  As a practice manager
  I want accounts chased consistently and humanely
  So that we get paid without care being affected

  Scenario: Invoices age into buckets
    When I open the debtors report
    Then invoices are grouped as current, 30, 60 and 90 plus days

  Scenario: A reminder sequence runs and is logged
    When the debtor reminder sequence runs
    Then each step records the content, channel and timestamp

  @compliance @safety-critical
  Scenario: Account status never affects clinical care
    Given a patient has an outstanding balance
    When their GP opens the consultation
    Then the outstanding balance is not shown to the clinician
    And reception can see it at arrival

  Scenario: Write-offs require a reason and an authoriser
    When an invoice is written off
    Then a reason and an authorising user are recorded

  Scenario: Statements are generated per patient
    When I generate statements
    Then each patient with a balance receives one statement covering all their outstanding invoices
