# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/12-certificates-and-reports.md
#   standards: [C6.3, C1.5, C3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Third-party reports and record releases
  As a practice
  I want consent verified and scope respected
  So that we never release more than the patient authorised

  @compliance
  Scenario: No release without recorded consent
    Given an insurer requests a report
    When I begin preparing it
    Then the patient's authority must be recorded first
    And no information leaves without it

  @compliance
  Scenario: The scope of the consent is recorded and enforced
    Given the patient consented to release information about a knee injury only
    When the report is prepared
    Then the scope is displayed
    And releasing the whole record is not offered

  @compliance
  Scenario: The release is logged with a content manifest
    When a report is released
    Then what was released, to whom, when and under what authority are logged

  Scenario: The requester is invoiced and tracked
    When a third-party report is completed
    Then an invoice is raised to the requester from the non-Medicare fee schedule
    And it is tracked as a receivable until paid

  @offline
  Scenario: Third-party releases are online-only
    Given I have no connectivity
    When I try to release records to a third party
    Then I am told this requires a connection
