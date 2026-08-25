# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/02-health-summary-and-problem-list.md
#   standards: [QI2.1, QI2.2, C7.1, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Allergies and adverse reactions
  As a practice
  I want allergies recorded completely and surfaced everywhere they matter
  So that we never prescribe something that harms the patient

  Scenario: Recording an allergy captures substance, reaction, severity and date
    When I record an allergy
    Then substance, reaction, severity and date are all required

  Scenario: "Nil known" is a valid recorded state
    When I record that the patient has no known allergies
    Then the status is "nil known" with my name and today's date
    And the record no longer shows "Allergies not recorded"

  @safety-critical
  Scenario: Allergies appear at the top of the consultation header
    When I open any encounter
    Then allergies and adverse reactions appear before any other clinical content

  @safety-critical
  Scenario: A hard allergy match cannot be overridden silently
    Given the patient has a recorded anaphylaxis to penicillin
    When I prescribe amoxicillin
    Then the prescription cannot be signed without a typed reason
    And the reason is recorded in the clinical record

  Scenario: An adverse event following immunisation becomes an allergy record
    Given an adverse event following immunisation was recorded
    Then it appears in the allergies and adverse reactions section
    And it is shown before the next dose of that vaccine
