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
Feature: Unbilled completed appointments
  As a practice owner
  I want to see consultations that were never billed
  So that we recover revenue we have already earned

  Scenario: Completed appointments with no billing action are listed
    Given 4 appointments were completed today with no invoice and no "no charge" decision
    Then they appear on the unbilled appointments report

  Scenario: The dollar value is estimated
    When I open the report
    Then an estimated value is shown based on the appointment type's default item

  Scenario: A "no charge" decision removes it from the list
    When a completed appointment is marked "no charge" with a reason
    Then it leaves the unbilled list
    And the reason is recorded

  @compliance
  Scenario: The list cannot be dismissed without action
    When I try to dismiss the unbilled list
    Then each item must be billed or marked no charge first

  Scenario: The report is available by practitioner and by date range
    When I filter the report
    Then I can group by practitioner and select any date range
