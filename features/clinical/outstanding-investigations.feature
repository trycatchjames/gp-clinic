# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/04-investigations.md
#   standards: [GP2.2, QI3.1, C5.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Outstanding investigations
  As a GP
  I want to see tests that never came back
  So that I catch the patient who never went and the result that was misfiled

  Scenario: Overdue tests appear on the outstanding list
    Given I ordered a full blood count 21 days ago with an expected return of 7 days
    And no matching result has arrived
    Then it appears on my outstanding investigations list

  @safety-critical
  Scenario: Urgent tests escalate sooner
    Given I ordered an urgent test 36 hours ago
    And the urgent escalation window is 24 hours
    Then it is escalated to me and to the practice manager

  @safety-critical
  Scenario: A phone-result request has a named responsible practitioner
    When I mark a request as "phone result"
    Then a named responsible practitioner is required
    And "the practice" is not an acceptable value

  Scenario: A request can be closed without a result if it is not proceeding
    Given the patient has decided not to have the test
    When I close the outstanding investigation
    Then a reason is required
    And the closure is recorded with my name and the date

  Scenario: A matched result closes the outstanding investigation
    When a result matching the request arrives
    Then the outstanding investigation closes automatically
    And the result appears in my results inbox
