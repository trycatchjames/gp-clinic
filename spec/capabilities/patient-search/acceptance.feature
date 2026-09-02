Feature: Safe patient search

  Scenario: Medicare card finds family members but does not verify identity
    Given two active patients share a Medicare card number
    When a receptionist searches using that Medicare card number
    Then both permitted candidate records are shown separately
    And neither candidate is marked identity verified
    And the receptionist must deliberately select one candidate

  Scenario: Similar names remain distinct
    Given two patients have the same family name and date of birth
    When a receptionist searches by that family name and date of birth
    Then both candidates show distinguishing approved identifiers
    And the system does not automatically open either record

  Scenario: Search failure cannot be interpreted as no patient
    Given the patient search service is unavailable
    When a receptionist searches before registration
    Then the screen states that search failed
    And it does not state that no matching patient exists
    And ordinary new-patient registration is not silently enabled

  Scenario: Restricted patient prevents duplicate without exposing clinical content
    Given a patient record is marked sensitive
    And the receptionist lacks sensitive-record access
    When the receptionist searches matching approved identifiers
    Then a restricted identity stub is shown according to practice policy
    And no clinical information is disclosed
    And the receptionist is offered an authorised access or escalation path
