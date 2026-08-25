# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/05-cancellations-and-reminders.md
#   standards: [GP1.1, GP2.2]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @safety-critical
Feature: Cancellations and reschedules
  As a practice
  I want cancellations handled without losing clinical obligations
  So that freed capacity is reused and follow-ups are never dropped

  Scenario: Cancelling records who, when and why
    When an appointment is cancelled
    Then the record shows whether the patient, the practice or the system cancelled it
    And the timestamp and reason are recorded

  Scenario: Late cancellations are tracked separately
    Given the practice notice period is 4 hours
    When a patient cancels 2 hours before the appointment
    Then it is recorded as a late cancellation
    And it is reported separately from courteous cancellations

  Scenario: A cancelled slot is offered to the waitlist immediately
    When an appointment is cancelled
    Then the waitlist is matched for that slot

  @safety-critical
  Scenario: Cancelling never closes an underlying recall
    Given the appointment was linked to an open recall
    When it is cancelled
    Then the recall remains open
    And the recall is escalated

  Scenario: Rescheduling preserves identity and links
    Given the appointment is linked to a recall and a care plan review
    When it is rescheduled to a later date
    Then it keeps the same appointment identity
    And the recall and care plan links are preserved
    And the original time is recorded

  Scenario: Practice-initiated cancellation resolves every patient individually
    Given "Dr Tom Nguyen" is unexpectedly away and has 26 appointments
    When I run the practice cancellation workflow
    Then all 26 patients are listed
    And each must be resolved by rescheduling or cancelling with a message
    And the list cannot be dismissed while any patient is unresolved
