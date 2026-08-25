# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/03-triage-at-booking.md
#   standards: [C3.3, GP1.1, QI3.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @safety-critical
Feature: Escalating a deteriorating patient in the waiting room
  As a receptionist
  I want one action to raise the alarm
  So that a patient who becomes unwell while waiting is seen immediately

  Scenario: Escalation is always available from the arrivals screen
    When I open the arrivals screen
    Then a "patient deteriorating" action is available at all times

  @safety-critical
  Scenario: Escalation records the time and reaches the duty clinician
    When I escalate a waiting patient
    Then the time of escalation is recorded
    And the duty nurse and duty GP are alerted immediately
    And the interval between escalation and being seen is recorded

  Scenario: The escalation creates an incident record
    When the escalation is resolved
    Then an incident record exists for quality improvement review
    And it links to the patient and the encounter

  @offline
  Scenario: Escalation offline instructs verbal escalation
    Given the practice is offline
    When I escalate
    Then I am told to raise it verbally now
    And the record queues for sync
