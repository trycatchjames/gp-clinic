# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/04-patient-record-lifecycle.md
#   standards: [GP2.4, C5.3, C6.3, QI2.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @compliance
Feature: Transfer of care
  As a practice
  I want records transferred safely when a patient moves
  So that their care continues and we meet our privacy obligations

  Scenario: A transfer request requires verified authority
    Given a request for records arrives from another practice
    When I process it
    Then I must record the patient's authority to release
    And no records leave until it is recorded

  Scenario: A health summary is generated for transfer
    When the transfer is approved
    Then a summary is generated containing current problems, current medicines, allergies, immunisations, recent results, care plans and relevant correspondence

  @compliance
  Scenario: The release is logged with a content manifest
    When records are released
    Then the log records what was released, to whom, when and under what authority

  Scenario: Transfer out does not delete the record
    When the patient is marked "transferred_out"
    Then the record is retained
    And it remains searchable and readable

  Scenario: An inbound summary must be reconciled, not just filed
    Given a health summary arrives for a new patient
    When it is filed
    Then a reconciliation task is created
    And the task is only complete when medicines, allergies and problems have been reviewed into the structured summary
