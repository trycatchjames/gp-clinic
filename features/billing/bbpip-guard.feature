# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/01-billing-at-point-of-care.md
#   standards: [C1.5, C3.1, C3.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @compliance
Feature: Bulk Billing Practice Incentive Program guard
  As a participating practice
  I want to be stopped before I break the 100% rule
  So that we do not lose the 12.5% incentive over one invoice

  Background:
    Given the practice participates in the Bulk Billing Practice Incentive Program
    And participation requires bulk billing 100% of eligible services

  @compliance
  Scenario: Private billing an eligible service is warned
    When a private invoice is attempted for an eligible service
    Then a warning names the consequence for the practice's BBPIP eligibility
    And a reason is required to proceed

  @compliance
  Scenario: The exception is reported
    Given a private invoice was raised for an eligible service with a reason
    Then it appears on the practice manager's billing exception report

  Scenario: Ineligible services are not warned
    Given the service is not an eligible service for the incentive
    When it is billed privately
    Then no BBPIP warning is shown

  Scenario: The current percentage is visible at the point of billing
    Given the practice has bulk billed 99.4% of eligible services this quarter
    Then the billing screen shows the current percentage

  Scenario: A non-participating practice sees no guard
    Given the practice does not participate in BBPIP
    When a private invoice is raised for an eligible service
    Then no BBPIP warning is shown
