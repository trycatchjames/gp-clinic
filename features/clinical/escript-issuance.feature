# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/03-prescribing.md
#   standards: [QI2.2, C5.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @offline
Feature: Electronic prescription issuance
  As a GP
  I want to issue eScripts by token or through the Active Script List
  So that the patient can be dispensed at any participating pharmacy

  Scenario: Issuing a token by SMS
    Given the patient has consented to SMS
    When I issue the prescription as a token
    Then a token is sent to her mobile
    And the delivery is logged

  Scenario: Issuing a token by email
    Given the patient prefers email
    When I issue the prescription as a token
    Then a token is sent to her email address

  Scenario: Dispensing a repeat generates a new token
    Given a prescription with 5 repeats was issued as a token
    When a repeat is dispensed
    Then a new token is generated for the remaining repeats

  Scenario: Using the Active Script List
    Given the patient is registered for an Active Script List
    When I issue the prescription
    Then it is added to her Active Script List
    And no individual token is required at the pharmacy

  Scenario: Paper prescriptions remain available
    When the patient asks for a paper prescription
    Then a compliant paper prescription can be printed

  @offline
  Scenario: eScripts cannot be issued offline
    Given I have no connectivity
    When I try to issue an electronic prescription
    Then I am told electronic prescribing requires a connection
    And I can record the intent as a task
    And the task appears when connectivity returns
