# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/05-results-and-recalls.md
#   standards: [GP2.2, C6.1, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Unmatched results
  As a practice
  I want results that cannot be matched worked every day
  So that a result nobody is looking at never ages quietly

  Scenario: An unmatchable result goes to the unmatched queue
    Given a result arrives that cannot be matched to a patient
    Then it appears in the unmatched queue
    And it is not filed anywhere else

  @safety-critical
  Scenario: The age of the oldest unmatched result is on the dashboard
    Given the oldest unmatched result is 3 days old
    Then the practice dashboard shows "Oldest unmatched result: 3 days"
    And the number links to the queue

  Scenario: Manual matching files the result correctly
    When I match an unmatched result to a patient and a request
    Then it is filed to the patient record
    And it appears in the ordering practitioner's inbox
    And the outstanding investigation closes

  @safety-critical
  Scenario: An unmatched result cannot be deleted
    When I try to remove an unmatched result
    Then deletion is not available
    And I can only match it or record why it is not ours

  Scenario: A result for a merged patient matches the surviving record
    Given the patient record was merged last week
    When a result arrives referencing the merged identifier
    Then it is matched to the surviving record automatically
