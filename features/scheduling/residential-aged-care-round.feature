# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/30-scheduling/06-home-visits-aged-care-after-hours.md
#   standards: [GP1.2, GP2.1, C5.3, QI2.2]
#   domain: scheduling
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @scheduling @offline @medicare
Feature: Residential aged care rounds
  As a GP who visits an aged care facility
  I want the whole round available in one action
  So that I can see fourteen residents in a building with no signal

  Background:
    Given "Fairfield Aged Care" is a linked facility with 22 residents at this practice

  Scenario: Scheduling a round rather than individual appointments
    When I schedule a round at "Fairfield Aged Care" for Thursday
    Then I select which residents to see
    And a single round containing multiple encounters is created

  @offline
  Scenario: The whole round list is cached in one action
    When I prepare the round
    Then every selected resident's summary, medicines, allergies and care plan are cached
    And the facility's nurse-in-charge contact is cached

  @medicare
  Scenario: MyMedicare status is shown per resident
    When I open the round list
    Then each resident shows their MyMedicare registration status
    And unregistered residents are flagged for the practice to follow up

  @offline
  Scenario: Encounters are recorded per resident offline
    Given I am at the facility with no connectivity
    When I record an encounter for each resident
    Then each is stored locally and queued separately

  Scenario: Billing is per resident, not per round
    When the round syncs
    Then a separate invoice is raised for each resident encounter

  Scenario: Medication changes produce scripts and a chart update
    When I change a resident's medication during the round
    Then a prescription task is created for when I am back online
    And a facility medication chart update is generated
