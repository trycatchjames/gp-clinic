# ============================================================================
# metadata:
#   status: inactive
#   implemented: true
#   automation: none
#   spec: docs/10-practice-setup/06-fee-schedules-and-billing-setup.md
#   standards: [C1.5, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare
Feature: Bulk billing incentive setup
  As a practice manager
  I want to configure how incentives are suggested
  So that eligible services attract the incentive without anyone having to remember

  Scenario: Enabling automatic incentive suggestion
    When I enable incentive suggestion
    Then eligible services suggest the applicable incentive item at billing

  Scenario: The location tier drives which incentive applies
    Given "Brunswick" is metropolitan and "Nhill Branch" is rural
    Then the incentive suggested differs by location
    And the location tier is shown as the reason

  Scenario: MyMedicare registration affects eligibility from 1 November 2025
    Given the date is after 1 November 2025
    And the patient is registered in MyMedicare
    Then the patient is eligible for the bulk billing incentive

  Scenario: Disabling suggestion does not disable manual selection
    When I disable automatic suggestion
    Then incentive items can still be selected manually
