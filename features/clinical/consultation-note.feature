# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/01-consultation-workflow.md
#   standards: [C7.1, C5.1, C6.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: The consultation note
  As a practice
  I want notes that meet the record content requirements
  So that care can be handed over safely and the record stands up to scrutiny

  Scenario: A signed note contains the required content
    When a note is signed
    Then it contains the date, time and practitioner identity
    And the reason for the encounter
    And relevant history and examination findings
    And an assessment
    And a management plan including medicines prescribed and investigations ordered
    And any advice given
    And any referral made

  Scenario: A note cannot be signed without a reason for encounter
    Given the reason for encounter is empty
    When I try to sign the note
    Then signing is blocked
    And I am told what is missing

  Scenario: A note can be signed without an assessment if the absence is explained
    Given no assessment has been entered
    When I sign the note
    Then I must record why there is no assessment
    And the reason is stored in the note

  Scenario: Structured observations are recorded alongside free text
    When I record blood pressure "148/92", weight "71.2 kg" and heart rate "78"
    Then each is stored as a structured observation with units and a timestamp
    And each appears in the patient's trend view

  Scenario: A signed note becomes immutable
    Given I signed the note 10 minutes ago
    When I try to edit the text
    Then direct editing is not possible
    And I am offered the amendment workflow instead

  @offline
  Scenario: Notes can be drafted and signed offline
    Given I have no connectivity
    When I write and sign a note
    Then it is stored locally with a client-generated identifier
    And it syncs unchanged when connectivity returns
