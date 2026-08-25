# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/04-infection-control-and-facilities.md
#   standards: [GP4.1, QI3.1, C3.5]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @safety-critical @offline
Feature: Sterilisation traceability
  As a practice
  I want an instrument traceable to the patient it was used on
  So that a failed cycle can be investigated completely

  Scenario: A load record captures the cycle
    When a sterilisation load is recorded
    Then the autoclave, load number, date, contents and cycle parameters are recorded

  Scenario: Cycle validation is attached
    When the cycle completes
    Then the printout or data log is attached
    And the chemical indicator result is recorded
    And periodic biological indicator results are recorded

  Scenario: Packs carry the load identifier
    When packs are labelled
    Then each carries the load identifier

  @safety-critical
  Scenario: Using a pack records it against the patient
    When a pack is used in a procedure
    Then the load identifier is recorded against the patient's procedure

  @safety-critical
  Scenario: A failed cycle identifies affected patients
    Given a cycle is recorded as failed
    Then the load is quarantined
    And any packs already used from it are identified
    And the affected patients are listed

  @offline
  Scenario: Load records can be created offline
    Given the treatment room has no connectivity
    When I record a load
    Then it is stored locally and queued
