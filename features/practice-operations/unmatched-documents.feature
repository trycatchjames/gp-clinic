# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/03-correspondence-and-documents.md
#   standards: [GP2.2, C6.1, C6.2, QI3.1]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @safety-critical
Feature: Unmatched documents
  As a practice manager
  I want the unmatched queue worked daily
  So that a result nobody is looking at never ages

  Scenario: There is no third state
    When a document arrives
    Then it is either matched to a patient or in the unmatched queue

  @safety-critical
  Scenario: The age of the oldest unmatched document is on the dashboard
    Given the oldest unmatched document is 2 days old
    Then the dashboard shows it
    And the figure links to the queue

  Scenario: Matching files it and routes it
    When I match an unmatched document
    Then it is filed to the patient record
    And it is routed to the correct practitioner

  @safety-critical
  Scenario: Unmatched documents cannot be deleted
    When I try to remove an unmatched document
    Then deletion is not available
    And I may only match it or record that it is not ours

  Scenario: Recording a document as not ours
    When I record that a document does not belong to this practice
    Then a reason is required
    And the document is retained with that annotation
