# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/13-clinical-handover-and-continuity.md
#   standards: [C5.3, GP2.1, GP2.2, GP2.3, GP2.4]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Clinical handover
  As a practice
  I want handover to carry the essentials every time
  So that whoever picks up this patient's care can do so safely

  Scenario: A handover summary always includes the essentials
    When a handover summary is generated
    Then it includes current medicines, allergies and active problems
    And these cannot be omitted

  Scenario: Handover to the hospital
    Given a patient is being sent to the emergency department
    When I generate a handover summary
    Then it is printable and shareable immediately

  @safety-critical
  Scenario: Reception shift handover is not a sticky note
    When a message is passed between reception shifts
    Then it enters a message queue requiring acknowledgement
    And unacknowledged messages are visible to the practice manager

  Scenario: Continuity is measurable
    When the practice runs the continuity report
    Then the proportion of each patient's visits with their usual GP is shown
    And low continuity is surfaced without being labelled as failure
