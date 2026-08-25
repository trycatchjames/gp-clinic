# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/04-infection-control-and-facilities.md
#   standards: [GP5.2, GP5.3, C3.3, GP5.1]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @compliance
Feature: Equipment register
  As a practice manager
  I want equipment services and calibrations tracked
  So that nothing safety-critical is quietly overdue

  Scenario: The register records what accreditation asks for
    When I add equipment
    Then item, location, serial number, purchase date, service schedule, last service and next service due are recorded

  Scenario Outline: Calibration is tracked where applicable
    Given the equipment is a "<item>"
    Then a calibration schedule is tracked

    Examples:
      | item              |
      | sphygmomanometer  |
      | spirometer        |
      | ECG machine       |
      | scales            |

  @safety-critical
  Scenario: Overdue safety-critical equipment escalates
    Given the defibrillator service is overdue
    Then it is escalated beyond a routine task
    And it appears on the practice dashboard

  Scenario: Doctor's bags are per practitioner
    Then each practitioner's doctor's bag has its own contents and expiry record
    And expiries generate tasks for that practitioner

  Scenario: Completing a service clears the alert and schedules the next
    When a service is recorded
    Then the alert clears
    And the next due date is calculated from the schedule
