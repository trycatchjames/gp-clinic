# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/03-prescribing.md
#   standards: [QI2.2, C5.1, C7.1, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Prescribing
  As a GP
  I want safety checks run before I sign
  So that I do not prescribe something that will harm this patient

  Background:
    Given I am signed in as "Dr Tom Nguyen"
    And I am in a consultation with "Margaret Doyle"

  Scenario: Safety checks run automatically before signing
    When I select a medicine
    Then an allergy cross-check runs
    And a drug interaction check runs against her current medicines
    And a duplicate therapy check runs
    And a contraindication check runs against her coded active problems

  @safety-critical
  Scenario: Renal dosing is prompted where a recent eGFR exists
    Given her most recent eGFR is 38
    When I prescribe a renally cleared medicine
    Then a renal dose adjustment prompt is shown with the eGFR and its date

  Scenario: PBS listing and restriction are shown
    When I select a PBS-listed medicine with a restriction
    Then the restriction text is shown
    And any applicable streamlined authority code is applied

  @compliance @medicare
  Scenario: A written or phone authority is recorded explicitly
    Given the medicine requires a written or phone PBS Authority
    Then the workflow makes that requirement explicit
    And the approval number must be recorded before the prescription is issued

  Scenario: A private (non-PBS) prescription is clearly marked
    When I prescribe outside the PBS
    Then the prescription is marked private
    And the patient is told it is not subsidised

  @compliance
  Scenario: No prescription without an encounter
    When a prescription is created
    Then it is linked to an encounter
    And it carries my prescriber number and the provider number for this location

  Scenario: Cancelled prescriptions are retained
    When I cancel a prescription
    Then it is retained with the cancellation reason
    And it remains visible in the prescribing history
