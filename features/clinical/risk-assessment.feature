# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/10-mental-health.md
#   standards: [QI3.1, GP2.2, C5.1, C7.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Risk assessment
  As a GP
  I want risk recorded as a findable, timestamped record
  So that anyone covering can see the current assessment instantly

  Scenario: A risk assessment is a distinct record
    When I complete a risk assessment
    Then it is stored as its own record with a timestamp and author
    And it is not buried in the consultation note text

  Scenario: The assessment covers risk to self, to others and from others
    When I complete a risk assessment
    Then risk of suicide and self-harm, risk to others and risk from others are each recorded

  @safety-critical
  Scenario: Elevated risk creates a tracked follow-up
    Given the assessment records elevated risk
    Then a follow-up obligation is created with a responsible practitioner
    And it follows an escalation ladder

  @safety-critical
  Scenario: A DNA on an elevated-risk follow-up is a safety event
    Given a patient assessed at elevated risk does not attend their follow-up
    Then the follow-up is escalated immediately
    And the responsible practitioner is notified

  @safety-critical
  Scenario: An elevated-risk follow-up cannot be closed administratively
    Given I am a receptionist
    When I try to close an elevated-risk follow-up
    Then closure is not available to me

  Scenario: The currency of the assessment is visible
    Given the last risk assessment was 8 months ago
    When any clinician opens the record
    Then the assessment date is shown so its currency is obvious

  @offline
  Scenario: Elevated-risk follow-up creation is online-only
    Given I have no connectivity
    When I record an elevated risk assessment
    Then I am told the follow-up cannot be queued
    And I am directed to arrange it now
