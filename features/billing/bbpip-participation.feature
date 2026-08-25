# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/02-medicare-bulk-billing.md
#   standards: [C3.1, C3.2]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @compliance
Feature: BBPIP participation
  As a practice owner
  I want participation tracked with its preconditions and consequences
  So that we know where we stand at all times

  Background:
    Given the Bulk Billing Practice Incentive Program commenced on 1 November 2025

  @compliance
  Scenario: MyMedicare registration is a precondition
    Given the practice is not registered for MyMedicare
    When participation is attempted
    Then it is blocked with the reason stated

  Scenario: Participation records effective dates
    When participation is enabled
    Then the effective from date is recorded
    And opting out later records the effective to date

  Scenario: Practices may opt in and out
    Given the practice participates
    When the practice opts out
    Then participation ends from the recorded date
    And the billing policy constraint is lifted

  Scenario: The bulk billing percentage is calculated on eligible services only
    Given the practice provided 400 services this quarter, of which 350 were eligible services
    And all 350 eligible services were bulk billed
    Then the reported percentage is 100%

  @medicare
  Scenario: The incentive estimate is split 50/50
    Given the practice earned $80,000 in MBS benefits from eligible services
    When the incentive estimate is calculated
    Then the estimated incentive is $10,000
    And $5,000 is attributed to the practice and $5,000 to the practitioners

  Scenario: A drop below the threshold is surfaced immediately
    Given the practice has bulk billed 99.7% of eligible services this quarter
    Then the dashboard shows the percentage prominently
    And the exception list is one click away
