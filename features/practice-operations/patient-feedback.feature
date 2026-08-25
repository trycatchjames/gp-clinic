# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/01-quality-improvement-and-accreditation.md
#   standards: [QI1.2, C1.2, QI3.2, C2.1]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations
Feature: Patient feedback and complaints
  As a practice manager
  I want feedback collected, analysed and acted on
  So that patients see something change

  Scenario: Feedback is collected from several channels
    When feedback arrives by survey, comment or complaint
    Then each is recorded with its channel and date

  Scenario: A complaint has timeframes and an outcome
    When a complaint is registered
    Then acknowledgement and response timeframes are tracked
    And the outcome is recorded before closure

  Scenario: Feedback analysis produces actions
    When feedback is analysed
    Then themes are identified
    And actions with owners and due dates are created

  Scenario: The practice's response is recorded
    When a feedback cycle completes
    Then what changed as a result is recorded
    And it is attached as evidence for QI1.2

  @compliance
  Scenario: A complaint involving patient harm triggers open disclosure
    Given the complaint involves harm to a patient
    Then the open disclosure workflow is offered
    And the complaint cannot be closed without it
