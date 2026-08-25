# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/01-quality-improvement-and-accreditation.md
#   standards: [QI1.1, QI1.3, C3.6]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations
Feature: Quality improvement activities
  As a practice
  I want QI activities that show improvement rather than assert it
  So that the cycle is real

  Scenario: An activity records the measure and the baseline
    When I start a QI activity
    Then the issue, the measure and the baseline are required

  Scenario: The baseline links to the data that produced it
    When a baseline is recorded from a practice report
    Then the activity links to that report so the figure can be reproduced

  Scenario: The cycle records the change and the result
    When the activity completes
    Then the change made, the result and the next cycle are recorded

  Scenario: Activities are evidence for QI1.1
    When the accreditation evidence pack is generated
    Then completed QI activities are attached to QI1.1

  Scenario: An activity without a measure cannot be completed
    Given the activity has an intention but no measure
    When I try to complete it
    Then completion is blocked
