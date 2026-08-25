# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/04-patient-record-lifecycle.md
#   standards: [C6.2, C6.3, GP2.2, C2.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @safety-critical
Feature: Recording a patient as deceased
  As a practice
  I want everything to stop cleanly when a patient dies
  So that no recall, reminder or appointment reaches a grieving family

  Scenario: Recording death captures the date and source
    When I record "Margaret Doyle" as deceased on "2026-08-20" with source "family notification"
    Then her status becomes "deceased"
    And the date and source are recorded

  @safety-critical
  Scenario: All open recalls, reminders and appointments are cancelled
    Given "Margaret Doyle" has 3 open recalls, 5 pending reminders and 2 future appointments
    When she is recorded as deceased
    Then all 3 recalls are closed as "patient deceased"
    And all 5 reminders are cancelled
    And both appointments are cancelled
    And this happens in a single transaction

  @safety-critical
  Scenario: No communication is sent after death is recorded
    Given "Margaret Doyle" is recorded as deceased
    When the nightly reminder run executes
    Then no message is generated for her

  Scenario: The record becomes read-only for clinical entry
    When "Margaret Doyle" is recorded as deceased
    Then no new clinical note can be created
    And administrative corrections and filing of correspondence remain possible

  Scenario: Related family members are not notified automatically
    Given "Margaret Doyle" has family members recorded as relationships
    When she is recorded as deceased
    Then no automatic communication is sent to them
