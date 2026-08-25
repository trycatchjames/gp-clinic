# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/04-patient-record-lifecycle.md
#   standards: [C6.1, C6.2, C6.3]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @safety-critical
Feature: Merging duplicate patient records
  As a practice
  I want duplicates found and merged carefully
  So that a patient's history is in one place and nothing is lost

  Scenario: Duplicates are detected and queued
    Given two records exist for "Margaret Doyle" born "1952-03-14"
    When the duplicate detection runs
    Then both appear in the potential duplicates queue

  @safety-critical
  Scenario: Merging requires a clinical role
    Given I am signed in as a receptionist
    When I open a potential duplicate pair
    Then I can flag it for review
    And I cannot perform the merge

  Scenario: The merge is field by field
    Given I am signed in as a GP
    When I open the merge screen
    Then both records are shown side by side
    And I choose the surviving value for each field where they differ

  Scenario: Everything moves to the surviving record
    When the merge completes
    Then clinical records, appointments, invoices, results, recalls and documents all attach to the surviving record
    And the merged record becomes a tombstone that redirects

  Scenario: A result arriving under the old identifier still lands correctly
    Given a merge completed yesterday
    When a pathology result arrives referencing the merged record
    Then it is filed to the surviving record

  Scenario: A merge can be reversed within 30 days
    Given a merge completed 10 days ago
    When I reverse it
    Then both records are restored with their original data
    And the reversal is audit-logged

  Scenario: A merge cannot be reversed after 30 days
    Given a merge completed 31 days ago
    Then reversal is no longer offered
    And the merge remains permanently audit-logged
