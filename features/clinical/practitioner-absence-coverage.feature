# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/13-clinical-handover-and-continuity.md
#   standards: [C5.3, GP2.2, C3.2]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Coverage during a practitioner's absence
  As a practice manager
  I want coverage assigned before leave starts
  So that results and recalls always have a named owner

  @safety-critical
  Scenario: Absence cannot be recorded without coverage
    When I record leave for "Dr Tom Nguyen"
    Then I must assign a named practitioner to cover his results inbox
    And a named practitioner to cover his recalls and tasks

  Scenario: Coverage is time-bounded and reverts automatically
    Given coverage was assigned for 2026-09-14 to 2026-09-28
    When 2026-09-29 arrives
    Then coverage reverts to Dr Nguyen automatically

  Scenario: Covered items are clearly marked
    Given I am covering for Dr Nguyen
    When a result for him arrives in my inbox
    Then it is marked as covering for Dr Nguyen

  Scenario: Appointments during leave are handled explicitly
    When leave is recorded
    Then affected appointments are listed
    And each must be rescheduled, reassigned or cancelled
