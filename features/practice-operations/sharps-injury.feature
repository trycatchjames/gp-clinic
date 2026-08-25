# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/04-infection-control-and-facilities.md
#   standards: [GP4.1, C3.5, QI3.1]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @safety-critical
Feature: Sharps injury and exposure
  As a staff member
  I want the post-exposure protocol to start immediately
  So that time-critical steps are not missed

  @safety-critical
  Scenario: Reporting starts the protocol
    When I report a sharps injury
    Then the practice's post-exposure protocol is displayed immediately
    And the time of the injury is recorded

  Scenario: Both an incident and a staff health record are created
    When a sharps injury is reported
    Then an incident record is created
    And a staff health record is created

  Scenario: Source patient information is handled with consent
    Given the source patient is known
    Then obtaining their consent for testing is a recorded step
    And no source patient information is accessed without it

  Scenario: Staff immunisation status is surfaced
    When a sharps injury is reported
    Then the affected staff member's hepatitis B immunisation status is displayed

  Scenario: Follow-up is tracked
    When the protocol requires follow-up testing
    Then follow-up tasks are created with due dates and tracked to completion
