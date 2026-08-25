# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/01-consultation-workflow.md
#   standards: [C5.1, C7.1, C1.3, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Safety-netting
  As a GP
  I want to be prompted to record what the patient should watch for
  So that the advice I gave verbally is in the record

  Scenario: A prompt appears when safety-netting is empty and the problem is new
    Given the encounter includes a new problem
    And the safety-netting field is empty
    When I move to sign the note
    Then I am prompted to record safety-netting advice

  Scenario: The prompt does not block signing
    Given I have been prompted for safety-netting
    When I choose to sign anyway
    Then the note is signed
    And the fact that the prompt was declined is recorded

  Scenario: No prompt for a routine review with a stable diagnosis
    Given the encounter is a routine review of a stable chronic condition
    And no new problem was recorded
    When I sign the note
    Then no safety-netting prompt appears

  Scenario: Safety-netting is a distinct field, not buried in the plan
    When I view a signed note
    Then safety-netting appears as its own labelled section

  Scenario: Safety-netting can be given to the patient
    When I record safety-netting advice
    Then I can print or send it to the patient as written advice
    And the fact it was given is recorded
