# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/07-chronic-condition-management.md
#   standards: [GP2.1, C4.1, QI1.3, QI2.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical
Feature: Diabetes cycle of care
  As a practice nurse
  I want the diabetes cycle tracked with due dates
  So that nothing in the annual cycle is missed

  Background:
    Given "Margaret Doyle" has coded type 2 diabetes mellitus

  Scenario: The cycle components are tracked with due dates
    When I open her diabetes cycle of care
    Then I see HbA1c, blood pressure, lipids, eye examination, foot examination, kidney function, weight and self-care education
    And each shows when it was last done and when it is next due

  Scenario: Completing a component updates the cycle
    When an HbA1c result is filed
    Then the HbA1c component is marked complete with the result date
    And the next due date is calculated

  Scenario: Overdue components surface at the point of care
    Given her foot examination is 4 months overdue
    When she is arrived for any appointment
    Then the overdue foot examination is shown as a due activity

  Scenario: Cycle completion is reportable
    When the practice runs the chronic disease report
    Then the proportion of diabetic patients with a complete cycle is shown
    And the patients with incomplete cycles can be listed
