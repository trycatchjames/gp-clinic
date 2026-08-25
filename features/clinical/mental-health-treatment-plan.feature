# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/10-mental-health.md
#   standards: [C5.1, C1.3, C2.1, GP2.2, C6.3, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: GP Mental Health Treatment Plan
  As a GP
  I want the plan to capture what matters clinically
  So that risk is assessed, change is measurable and the patient has a crisis plan

  @compliance
  Scenario: A plan requires an outcome measure
    When I prepare a mental health treatment plan
    Then a validated outcome measure and its score must be recorded
    And K10, DASS-21, PHQ-9 and EPDS are offered

  @safety-critical @compliance
  Scenario: A plan requires a risk assessment
    When I prepare a mental health treatment plan
    Then a risk assessment must be recorded
    And it is stored as a distinct timestamped record, not as free text in the note

  @safety-critical
  Scenario: A crisis plan is recorded and given to the patient
    When the plan is completed
    Then a crisis plan with after-hours contacts and crisis lines is recorded
    And it is given to the patient
    And it is visible on the patient banner to clinical users

  Scenario: The review compares outcome measures
    When I review the plan
    Then the previous outcome measure score is shown alongside the new one
    And the change is displayed

  Scenario: Referral session allocation is tracked
    When I refer to a psychologist under the plan
    Then sessions used and sessions remaining against the patient's allocation are shown

  @compliance @safety-critical
  Scenario: A patient can restrict what is shared
    When the patient asks that mental health information be excluded from a shared health summary
    Then the restriction is recorded and honoured
    And it is surfaced whenever a summary is generated
