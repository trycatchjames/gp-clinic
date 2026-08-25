# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/09-immunisation.md
#   standards: [GP6.1, QI3.1, C3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @compliance @offline
Feature: Cold chain monitoring
  As a practice nurse
  I want temperatures recorded twice daily
  So that vaccine potency is maintained and demonstrable

  Scenario: Twice daily readings are required on open days
    Given today is a day the practice is open
    When only one temperature reading has been recorded by close
    Then the missed reading is flagged

  Scenario: A reading captures minimum, maximum and current
    When I record a reading
    Then minimum, maximum and current temperatures are all required
    And my name and the time are recorded

  Scenario: Data logger downloads are scheduled
    Given the practice downloads its data logger monthly
    When the interval elapses
    Then a task is created for the download and review

  Scenario: Readings outside range raise an immediate alert
    When I record a maximum of 9.4 degrees
    Then an immediate alert is raised
    And the cold chain breach workflow is offered

  @offline
  Scenario: Readings can be recorded offline
    Given there is no connectivity
    When I record a reading
    Then it is stored locally and queued
