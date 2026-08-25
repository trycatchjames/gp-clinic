# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/04-dva-workcover-third-party.md
#   standards: [C1.5, C3.1, C2.1]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: DVA billing
  As a practice
  I want veterans billed correctly
  So that they are never asked for a gap they should not pay

  Scenario: A Gold card resolves to DVA automatically
    Given the patient holds a DVA Gold card
    When the encounter is billed
    Then the suggested payer is "dva"

  @compliance @safety-critical
  Scenario: There is no patient co-payment on a DVA service
    When a DVA invoice is raised
    Then the patient balance is zero
    And no gap can be added

  Scenario: A White card requires an accepted condition
    Given the patient holds a DVA White card
    When the encounter is billed to DVA
    Then an accepted condition must be selected from the recorded list

  Scenario: A White card service unrelated to an accepted condition bills normally
    Given the service is unrelated to any accepted condition
    Then the payer resolves through normal Medicare rules

  Scenario: An Orange card covers pharmaceuticals only
    Given the patient holds a DVA Orange card
    When a consultation is billed
    Then DVA is not offered as the payer for the consultation

  Scenario: The DVA fee schedule applies
    When a DVA invoice is raised
    Then fees come from the DVA fee schedule
    And the schedule is not editable
