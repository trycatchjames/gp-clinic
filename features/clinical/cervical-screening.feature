# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/08-preventive-health.md
#   standards: [C4.1, GP2.2, C2.1, QI1.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Cervical screening
  As a practice
  I want the screening register worked and self-collection offered
  So that under-screened patients participate

  Scenario: Eligible patients appear on the register
    When the cervical screening register is generated
    Then eligible patients due or overdue for screening are listed
    And their last screening date is shown

  Scenario: Self-collection is offered as an option
    When cervical screening is discussed with a patient
    Then self-collection is presented as an available option
    And the choice made is recorded

  Scenario: A screening result closes the activity and sets the next due date
    When a cervical screening result is filed
    Then the activity is marked complete
    And the next due date is set from the programme interval

  @safety-critical
  Scenario: An abnormal result creates a recall, not a reminder
    Given the result requires follow-up
    When it is actioned
    Then a recall is created with a responsible practitioner
    And it follows the recall escalation ladder

  Scenario: Patients who have had a hysterectomy are excluded
    Given the patient has a recorded total hysterectomy
    Then they do not appear on the register
