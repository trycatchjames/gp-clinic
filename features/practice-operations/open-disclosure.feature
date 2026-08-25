# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/02-clinical-governance-and-incidents.md
#   standards: [QI3.2, QI3.1, C1.2, C2.1]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @compliance @safety-critical
Feature: Open disclosure
  As a practice
  I want harm disclosed properly and recorded
  So that patients are told what happened and we can show it

  @compliance
  Scenario: Patient harm requires an open disclosure record before closure
    Given an incident involved harm to a patient
    When I try to close it
    Then closure is blocked until an open disclosure record exists

  Scenario: The disclosure record captures what was said
    When an open disclosure is recorded
    Then what the patient and family were told, by whom and when are recorded
    And any apology made is recorded
    And what the practice is doing about it is recorded

  Scenario: Follow-up disclosures can be added
    Given further information emerged after the initial disclosure
    When a further conversation happens
    Then it is added to the same disclosure record

  Scenario: The disclosure links to the clinical record
    When an open disclosure is recorded
    Then it links to the patient and the encounter
    And the incident record remains separate from the clinical record
