# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/05-results-and-recalls.md
#   standards: [GP2.2, C3.3, QI3.1, C5.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Critical results
  As a practice
  I want critical results to reach a human immediately
  So that a life-threatening result is never sitting in a queue

  @safety-critical
  Scenario: A laboratory-flagged critical result bypasses the normal queue
    Given a result arrives flagged critical by the laboratory
    Then an immediate on-screen alert is raised to the ordering practitioner
    And the result is placed at the top of the inbox

  @safety-critical
  Scenario: An unacknowledged critical result escalates
    Given a critical result has been unacknowledged for the configured window
    Then it escalates to the duty GP
    And if still unacknowledged it escalates to the practice principal

  @safety-critical
  Scenario: A practitioner can mark a result critical themselves
    When I judge a result to be critical
    Then it follows the critical pathway regardless of the laboratory flag

  Scenario: Critical results arriving outside opening hours
    Given a critical result arrives at 21:00
    Then the practice's after-hours process is followed
    And the covering arrangement is surfaced to whoever is on

  @compliance
  Scenario: Acknowledgement and action are both recorded
    When a critical result is acknowledged
    Then the acknowledger and the time are recorded
    And the action taken and the time it was taken are recorded separately
