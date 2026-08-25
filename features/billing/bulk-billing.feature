# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/02-medicare-bulk-billing.md
#   standards: [C1.5, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare @offline
Feature: Bulk billing
  As a practice
  I want bulk billing to be correct and complete
  So that claims are accepted and patients pay nothing

  @compliance
  Scenario: Bulk billing requires a valid entitlement
    Given the patient's Medicare card is expired
    When bulk billing is attempted
    Then it is blocked

  @compliance
  Scenario: Assignment of benefit is captured
    When a bulk-billed invoice is raised
    Then the patient's assignment of benefit is captured
    And it is retained with the invoice permanently

  Scenario: The patient pays nothing
    When a bulk-billed invoice is issued
    Then the patient balance is zero
    And no payment is requested

  @medicare
  Scenario: Incentive items are suggested where the patient qualifies
    Given the patient is a concession card holder
    And the location tier makes the incentive applicable
    Then an incentive item is suggested with the reason shown

  @medicare
  Scenario: Incentive items are never added automatically
    When an incentive item is suggested
    Then it is not applied until confirmed

  @offline
  Scenario: Bulk billing offline
    Given I have no connectivity
    When I raise a bulk-billed invoice and capture the assignment of benefit
    Then both are stored locally
    And claiming queues until connectivity returns
