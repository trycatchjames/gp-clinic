# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/03-private-billing-and-payments.md
#   standards: [C1.5, C1.1, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @offline
Feature: Private billing
  As a practice
  I want private invoices raised with the gap made obvious
  So that patients are never surprised at the desk

  Scenario: The gap is calculated and displayed
    Given the practice fee for item "23" is $95.00 and the Medicare benefit is $45.05
    When the invoice is raised
    Then the gap of $49.95 is displayed prominently

  Scenario: Invoice numbers are unique and sequential per practice
    When three invoices are raised
    Then each has a unique sequential number scoped to the practice

  @compliance
  Scenario: An issued invoice cannot be edited
    Given an invoice was issued
    When I try to change a line
    Then editing is not available
    And a credit note is offered instead

  @compliance
  Scenario: A credit note references the original invoice
    When I raise a credit note
    Then it references the original invoice
    And a corrected invoice can then be raised

  @offline
  Scenario: Private invoices can be raised offline
    Given I have no connectivity
    When I raise a private invoice
    Then it is created from the cached fee schedule
