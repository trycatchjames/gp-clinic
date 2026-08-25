# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/09-immunisation.md
#   standards: [QI3.1, C3.3, C7.1, QI2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Adverse event following immunisation
  As a practice
  I want adverse events recorded and surfaced at the next dose
  So that the same reaction does not happen twice

  Scenario: Recording an adverse event
    When I record an adverse event following immunisation
    Then what happened, when, severity and outcome are recorded
    And the vaccine and batch are linked

  @safety-critical
  Scenario: The event is added to the patient's adverse reactions
    When an adverse event is recorded
    Then it appears in the allergies and adverse reactions section of the health summary

  @safety-critical
  Scenario: The event is surfaced before the next dose
    Given an adverse event was recorded for this vaccine
    When a further dose is prepared
    Then the previous adverse event is shown before administration can proceed

  Scenario: Reporting to the state adverse events system
    When an adverse event is recorded
    Then reporting to the state or territory adverse events system is prompted
    And whether it was reported is recorded

  Scenario: An anaphylactic event triggers the emergency workflow
    Given the adverse event is anaphylaxis
    Then the in-practice emergency workflow is offered
    And an incident record is created
