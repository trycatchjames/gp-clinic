# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/03-private-billing-and-payments.md
#   standards: [C1.5, C1.1, C1.3]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: Informed financial consent
  As a practice
  I want patients told what things cost before they happen
  So that we meet our obligation and nobody gets an unwelcome surprise

  @compliance
  Scenario: The expected cost is shown at booking
    When reception books a privately billed appointment type
    Then the expected out-of-pocket cost is displayed

  @compliance
  Scenario: The expected cost is shown in online booking
    When a patient books online
    Then the expected out-of-pocket cost is shown before confirmation

  @compliance
  Scenario Outline: A written estimate is required where there is no rebate
    Given the service is <service>
    Then a written estimate must be produced and acknowledged before the service

    Examples:
      | service                          |
      | for a patient with no Medicare entitlement |
      | a commercial drivers' medical    |
      | a non-rebatable cosmetic procedure |

  Scenario: The fee policy is published
    Then the practice information sheet states the billing policy and typical out-of-pocket costs

  Scenario: A cost change after booking is communicated
    Given the appointment type changed during the consultation to a longer item
    Then the revised cost is shown at billing
    And the change is explained to the patient
