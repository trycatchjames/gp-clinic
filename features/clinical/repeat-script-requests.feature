# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/03-prescribing.md
#   standards: [QI2.2, GP2.1, GP2.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Repeat prescription requests
  As a GP
  I want repeat requests reviewed rather than rubber-stamped
  So that long-term medicines are actually being monitored

  Scenario: A request goes to a queue, not straight to a prescription
    When a patient requests a repeat without an appointment
    Then a script request is created for review
    And no prescription is generated automatically

  Scenario: The review shows what the GP needs to decide
    When I open a script request
    Then I see the last review date for that medicine
    And recent relevant results
    And when the patient last attended

  @safety-critical
  Scenario: A patient who has not attended in over 12 months is flagged
    Given the patient last attended 14 months ago
    When I open the request
    Then it is flagged as requiring a consultation rather than a repeat

  Scenario: An overdue medicine review surfaces at the request
    Given the medicine requires annual review and was last reviewed 15 months ago
    When I open the request
    Then the overdue review is shown

  Scenario: Declining a request records a reason and informs the patient
    When I decline a repeat request
    Then I record a reason
    And a message is generated asking the patient to make an appointment
