# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/02-entitlements-and-verification.md
#   standards: [C1.5, C3.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @medicare
Feature: Entitlement expiry monitoring
  As a practice manager
  I want to know which cards are about to expire
  So that we fix them before they cause rejected claims

  Scenario: Cards expiring soon are badged on the appointment book
    Given a patient's Medicare card expires in 10 days
    When their appointment appears in the book
    Then a small expiry badge is shown on the appointment

  Scenario: A bulk expiry report is available
    When I run the entitlement expiry report for the next 30 days
    Then I see every patient whose Medicare, DVA or concession card expires in that window
    And I can export the list

  Scenario: Concession card expiry changes the billing suggestion
    Given the practice billing policy is "mixed" with bulk billing for concession card holders
    And the patient's concession card expired last week
    When the patient is billed
    Then the suggested payer is "private"
    And the reason shown is "Concession card expired 2026-08-18"
