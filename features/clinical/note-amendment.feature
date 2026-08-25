# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/01-consultation-workflow.md
#   standards: [C7.1, C6.2, C6.3]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance
Feature: Amending a signed note
  As a practice
  I want corrections recorded as amendments
  So that the record is correctable without the original ever being destroyed

  Scenario: An amendment records author, time and reason
    Given a note was signed yesterday
    When I amend it
    Then I must record a reason
    And the amendment stores my name and the timestamp

  Scenario: The original text remains readable
    When an amendment is added
    Then the original note text is still displayed
    And the amendment is displayed alongside it, clearly marked

  Scenario: Amendments cannot be deleted
    Given an amendment exists
    Then no application function deletes it
    And a further correction is a new amendment

  Scenario: Another practitioner can amend with attribution
    Given "Dr Anita Raman" amends a note authored by "Dr Tom Nguyen"
    Then the amendment is attributed to Dr Raman
    And the original authorship is unchanged

  @compliance
  Scenario: A patient-requested correction is handled as an amendment
    Given a patient asks for their record to be corrected
    When the correction is made
    Then it is recorded as an amendment noting the patient's request
    And the original entry is retained
