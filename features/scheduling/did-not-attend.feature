# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/04-arrival-and-waiting-room.md
#   standards: [GP2.2, GP1.1, QI3.1]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @safety-critical
Feature: Did not attend
  As a practice
  I want DNAs recorded and clinically significant ones escalated
  So that a missed follow-up on an abnormal result never disappears

  Scenario: Marking a DNA after the grace period
    Given the practice grace period is 15 minutes
    And the patient has not arrived 16 minutes after their appointment time
    When I mark the appointment as did not attend
    Then the DNA is recorded on the patient's record
    And their DNA count increases

  @safety-critical
  Scenario: A DNA on a recall appointment escalates the recall
    Given the appointment was booked to follow up an abnormal result
    When the patient does not attend
    Then the associated recall is escalated, not closed
    And the responsible practitioner is notified

  Scenario: A DNA on a routine appointment does not escalate
    Given the appointment was a routine review with no open recall
    When the patient does not attend
    Then the DNA is recorded
    And no escalation occurs

  Scenario: A courtesy message may be sent
    Given the practice sends DNA messages
    And the patient has consented to SMS
    When a DNA is recorded
    Then a message is sent that does not disclose the reason for the appointment

  Scenario: DNA rates are reported
    When the practice runs the access report
    Then DNA rate is shown by practitioner, by appointment type and by month
