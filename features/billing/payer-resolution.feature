# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/01-billing-at-point-of-care.md
#   standards: [C1.5, C3.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @medicare
Feature: Payer resolution
  As a biller
  I want the payer suggested with a stated reason
  So that I can disagree deliberately rather than guess

  Scenario Outline: The payer is resolved from entitlements and policy
    Given the patient <situation>
    Then the suggested payer is "<payer>"
    And the reason is shown

    Examples:
      | situation                                     | payer               |
      | holds a DVA Gold card                         | dva                 |
      | has an open accepted WorkCover claim for this injury | workcover     |
      | has no Medicare entitlement                   | private             |
      | matches a bulk-bill cohort rule               | medicare_bulk_bill  |

  Scenario: The suggestion can be overridden with a reason
    When I override the suggested payer
    Then a reason is required
    And the override is recorded on the invoice

  Scenario: A DVA White card holder billing an unrelated condition
    Given the patient holds a DVA White card
    And the service is unrelated to an accepted condition
    Then the suggested payer is not DVA
    And normal Medicare resolution applies

  @compliance
  Scenario: A patient with no Medicare gets a written estimate first
    Given the patient has no Medicare entitlement
    Then a written estimate must be produced before the service
