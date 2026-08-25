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
@inactive @not-implemented @billing
Feature: End of day
  As a practice manager
  I want a daily close that catches everything
  So that money and safety exceptions do not roll over unnoticed

  Scenario: The daily close covers the whole picture
    When I run the daily close
    Then I see the cash count against recorded cash payments
    And EFTPOS settlement against recorded card payments
    And total billings by practitioner, payer and item
    And unbilled completed appointments
    And claims ready to submit
    And a banking summary

  @compliance
  Scenario: A cash variance requires an explanation
    Given the cash count differs from recorded cash payments by $20
    When I try to close
    Then an explanation and an authorising user are required

  Scenario: The close is recorded
    When the daily close completes
    Then a daily close record is stored with the totals and the closing user

  Scenario: Closing does not hide unresolved items
    Given there are 3 unbilled completed appointments
    When I close the day
    Then they carry forward to tomorrow's exception list
