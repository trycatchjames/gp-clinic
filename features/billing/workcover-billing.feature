# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/50-billing/04-dva-workcover-third-party.md
#   standards: [C1.5, C3.1, C6.3]
#   domain: billing
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @billing @compliance
Feature: WorkCover and CTP billing
  As a practice
  I want work-related and accident-related services billed to the claim
  So that they never leak into Medicare and the insurer pays

  Scenario: Opening a claim context
    When I open a workers compensation claim for a patient
    Then the scheme, insurer, claim number, employer, date of injury and injury description are recorded
    And the claim acceptance status is recorded

  @compliance
  Scenario: Work-related services bill to the claim, not to Medicare
    Given the patient has an open accepted WorkCover claim
    When a consultation for the work injury is billed
    Then the payer is "workcover"
    And Medicare is not offered for that service

  @compliance
  Scenario: The claim number is mandatory
    When a WorkCover invoice is raised without a claim number
    Then it is blocked

  Scenario: Non-work-related services for the same patient bill normally
    Given the patient attends for an unrelated problem
    Then the payer resolves through normal Medicare rules

  @safety-critical
  Scenario: A rejected claim produces a re-billing worklist
    Given a claim previously accepted is rejected
    And 9 services were billed to it
    Then a re-billing worklist of those 9 services is produced
    And each must be re-billed to Medicare or to the patient

  Scenario: CTP claims work the same way
    Given the patient has an open CTP claim
    Then the same claim context, mandatory claim number and separation rules apply
