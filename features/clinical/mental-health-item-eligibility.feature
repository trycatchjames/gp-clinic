# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/10-mental-health.md
#   standards: [GP3.1, C3.1, C5.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @medicare @compliance
Feature: Mental health item eligibility
  As a practice
  I want the higher mental health items restricted to GPs who hold the training
  So that we never make a billing compliance error that is easy to avoid

  Scenario: A GP without Mental Health Skills Training
    Given "Dr Tom Nguyen" does not hold GPMHSC-accredited Mental Health Skills Training
    When a mental health treatment plan he prepared is billed
    Then items "2700" and "2701" are offered
    And items "2715" and "2717" are not offered at all

  Scenario: A GP with Mental Health Skills Training
    Given "Dr Anita Raman" holds GPMHSC-accredited Mental Health Skills Training
    When a mental health treatment plan she prepared is billed
    Then items "2715" and "2717" are offered

  Scenario: Recording the training makes the higher items available
    Given "Dr Tom Nguyen" completes Mental Health Skills Training
    When the qualification is recorded with its evidence
    Then items "2715" and "2717" become available for his encounters

  @compliance
  Scenario: The gate is enforced server-side
    When a request is made to bill item "2715" for a practitioner without the training
    Then the API rejects it
    And the rejection reason names the missing qualification
