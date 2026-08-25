# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/09-immunisation.md
#   standards: [C4.1, C3.3, GP5.3, QI3.1, C7.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical @offline
Feature: Administering an immunisation
  As a practice nurse
  I want every dose recorded completely
  So that a batch recall can identify affected patients in minutes

  Background:
    Given I am signed in as "Sarah Kelly", practice nurse

  Scenario: Due vaccines are determined from the correct schedule
    Given the patient is recorded as Aboriginal
    When I check what is due
    Then the Aboriginal and Torres Strait Islander schedule is used
    And the schedule used is displayed

  @safety-critical
  Scenario: Contraindications and precautions are screened before administration
    When I prepare to administer
    Then I am prompted to check acute illness, allergy to a previous dose or component, immunosuppression and pregnancy

  @compliance
  Scenario: Batch number and site are mandatory
    When I record an administration without a batch number
    Then recording is blocked
    And the same applies to the injection site

  Scenario: The full administration record is captured
    When I record an administration
    Then the vaccine, batch number, expiry, dose number, route, site, date, time and administering practitioner are all stored

  @safety-critical
  Scenario: The observation period is recorded
    When the administration is recorded
    Then a 15 minute observation period is started
    And its completion must be recorded, or an exception reason given

  @compliance
  Scenario: Consent is recorded for every administration
    When I record an administration for a child
    Then the consenting parent or guardian is recorded

  Scenario: The next dose is scheduled as a reminder
    When a dose in a multi-dose schedule is recorded
    Then a reminder is created for the next dose

  @offline
  Scenario: Administration can be recorded offline
    Given the treatment room has no connectivity
    When I record an administration with batch and site
    Then it is stored locally and queued
    And reporting to the immunisation register queues too
