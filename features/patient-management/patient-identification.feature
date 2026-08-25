# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/01-patient-registration.md
#   standards: [C6.1, C6.2, QI3.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management @safety-critical @compliance
Feature: Patient identification
  As a practice
  I want three identifiers confirmed before we act on a record
  So that we never treat, prescribe for or bill the wrong person

  Scenario: Three identifiers are displayed in the record header
    When I open a patient record
    Then the header shows the patient's full name, date of birth and address
    And a Medicare number or practice patient identifier is available

  Scenario: Identity is confirmed before the first write of the day
    Given I have not yet written to "Margaret Doyle"'s record today
    When I make my first change
    Then I am asked to confirm I have verified three identifiers
    And the confirmation is recorded

  Scenario: Confirmation is not demanded on every interaction
    Given I confirmed identity for "Margaret Doyle" earlier today
    When I make a further change to her record
    Then I am not asked to confirm again

  @safety-critical
  Scenario: Two patients with the same name are visually distinguished
    Given two active patients are both named "John Smith"
    When either appears in a list
    Then the date of birth and address are shown alongside the name
    And a same-name warning is displayed

  Scenario: Wrong-patient entry is recoverable and recorded
    Given I entered a note on the wrong patient
    When I report it as a wrong-patient entry
    Then an incident record is created
    And the note is moved with both records retaining an audit trail of the correction
