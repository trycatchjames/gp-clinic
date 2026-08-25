# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/03-correspondence-and-documents.md
#   standards: [C1.2, C6.3, GP2.3, C5.3]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @compliance
Feature: Outbound communications
  As a practice
  I want every outbound item logged with its delivery status
  So that "did you send it?" always has an answer

  Scenario: Every outbound item is logged
    When a referral letter, report, health summary or certificate is sent
    Then the recipient, channel, timestamp, delivery status and content are logged

  Scenario: A failed delivery is surfaced
    Given a secure message failed to deliver
    Then it appears as an exception requiring action
    And an alternative channel is offered

  @compliance
  Scenario: Patient communications check consent at send time
    Given the patient withdrew email consent this morning
    When an outbound email would be sent this afternoon
    Then it is not sent

  Scenario: Sent items are retrievable from the patient record
    When I open a patient record
    Then everything sent about that patient is listed with dates and recipients
