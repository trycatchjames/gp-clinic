# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/15-emergencies.md
#   standards: [C3.3, GP5.2, GP5.3, QI3.1, QI3.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical @offline
Feature: In-practice emergency
  As a clinician
  I want the software out of the way and then complete afterwards
  So that we can act, and the record is right when it matters later

  @safety-critical
  Scenario: Emergency mode is one action from any screen
    When I trigger emergency mode
    Then an encounter is created immediately with a running clock
    And a minimal recording surface opens

  @safety-critical
  Scenario: Critical patient information is surfaced immediately
    When emergency mode opens for a known patient
    Then allergies, current medicines and active problems are shown
    And the practice address is shown in a form that can be read to 000

  Scenario: One-tap timestamps for common interventions
    When I record interventions
    Then CPR started, adrenaline given, oxygen on and defibrillator applied are each one tap
    And each records the exact time

  @safety-critical
  Scenario: An emergency encounter can be created for an unregistered person
    Given someone collapses in the waiting room and is not a patient here
    When I trigger emergency mode
    Then a record can be created without full registration
    And it can be reconciled to a patient record afterwards

  Scenario: The emergency creates an incident record
    When the emergency is completed
    Then an incident record is created automatically
    And a debrief can be recorded

  Scenario: Used stock generates a restock task
    Given adrenaline and oxygen were used
    When the emergency is completed
    Then a restock task is created and tracked to completion

  @offline @safety-critical
  Scenario: Emergency mode works fully offline
    Given the practice has no internet connection
    When I trigger emergency mode
    Then everything works against cached data
    And all entries queue for sync
