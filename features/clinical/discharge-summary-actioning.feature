# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/13-clinical-handover-and-continuity.md
#   standards: [C5.3, GP2.2, QI2.2, GP2.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Actioning a discharge summary
  As a GP
  I want a discharge summary to demand action
  So that a patient discharged on new medicines is not left to chance

  @safety-critical
  Scenario: A discharge summary creates a task, not just a document
    When a discharge summary arrives and is matched to a patient
    Then a task is created for the patient's usual GP
    And the document is not marked actioned by being read

  @safety-critical
  Scenario: Actioning requires explicit reconciliation
    When I action a discharge summary
    Then I must reconcile medication changes into the current medicines list
    And add any new diagnoses to the problem list
    And record follow-up actions with due dates

  Scenario: A post-discharge review is offered
    When I action a discharge summary
    Then booking a post-discharge review is offered
    And the default interval is within 7 days

  Scenario: Unactioned discharge summaries age and escalate
    Given a discharge summary has been unactioned for 3 working days
    Then it is escalated to the practice manager
