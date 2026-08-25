# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/20-patient-management/01-patient-registration.md
#   standards: [C1.4, C2.1, C6.1, C6.2, GP2.1]
#   domain: patient-management
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @patient-management
Feature: Registering a patient
  As a receptionist
  I want to register new patients without creating duplicates
  So that each person has one complete record

  Background:
    Given I am signed in as a receptionist at "Brunswick Family Practice"

  Scenario: Search is required before creating a patient
    When I choose to add a new patient
    Then I must first search by surname and date of birth
    And the create form is only reachable when the search returns no match

  Scenario: A potential duplicate is shown before the record is committed
    Given a patient "Margaret Doyle" born "1952-03-14" already exists
    When I register "Margaret Doyle" born "1952-03-14"
    Then I am shown the possible duplicate before saving
    And I can open the existing record instead of creating a new one

  @compliance
  Scenario: Aboriginal and Torres Strait Islander status is always asked
    When I register a new patient
    Then I must record one of:
      | value                                     |
      | Aboriginal                                |
      | Torres Strait Islander                    |
      | Both Aboriginal and Torres Strait Islander |
      | Neither                                   |
      | Not stated                                |
    And the field cannot be left blank

  Scenario: Interpreter requirement is captured and surfaced
    When I record that the patient requires a Vietnamese interpreter
    Then the requirement appears as a front-desk alert
    And it appears on every future appointment for that patient

  Scenario: Carer, guardian and emergency contact are distinct
    When I record the patient's relationships
    Then I can separately record an emergency contact, a carer, a guardian, a power of attorney and a nominated representative
    And each records the person's name, relationship and contact details

  Scenario: Medicare card number is checksum validated
    When I enter a Medicare card number that fails the checksum
    Then I am told the number appears invalid
    And I can still save if I confirm the number is as printed on the card

  Scenario: A usual GP is nominated
    When I register a patient and nominate "Dr Tom Nguyen" as their usual GP
    Then continuity reporting counts their visits against Dr Nguyen
    And booking offers Dr Nguyen first
