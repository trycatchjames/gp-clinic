# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/01-billing-at-point-of-care.md
#   standards: [C1.5, C3.1, C1.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @offline
Feature: Billing at the point of care
  As a GP finishing a consultation
  I want billing to take seconds and be right
  So that I move on to the next patient without a compliance risk

  Scenario: Completing an encounter produces a billing queue item
    When I complete the encounter
    Then it appears on reception's billing queue with the items I selected

  @compliance
  Scenario: An invoice must reference the encounter, practitioner, location and payer
    When an invoice is raised
    Then all four are present
    And the provider number used is the one for that practitioner at that location

  Scenario: The patient gap is the most prominent figure
    Given the practice bills privately
    When the billing screen opens
    Then the schedule fee, the Medicare benefit and the gap are shown
    And the gap is the largest figure on the screen

  @compliance @medicare
  Scenario: Invalid item combinations are caught before the invoice is issued
    When I select two items that cannot be co-claimed
    Then I am warned before the invoice is raised
    And the reason is stated

  @compliance
  Scenario: Issued invoices are immutable
    Given an invoice was issued
    When a correction is needed
    Then a credit note plus a new invoice is the only path
    And the original invoice is unchanged

  Scenario: An unbilled completed appointment is reported
    Given an appointment was completed 6 hours ago with no billing action
    Then it appears on the practice manager's exception report

  @offline
  Scenario: Billing works offline
    Given I have no connectivity
    When I raise a bulk-billed invoice
    Then it is created against the cached fee schedule
    And it is clearly marked as raised but not yet claimed
