# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/09-immunisation.md
#   standards: [GP6.1, QI3.1, QI3.2, C3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Cold chain breach
  As a practice
  I want a breach handled completely
  So that no patient receives a compromised vaccine and anyone who did is recalled

  Scenario: Recording the excursion
    When I record a cold chain breach
    Then the duration, minimum and maximum temperatures and the affected refrigerator are recorded

  @safety-critical
  Scenario: Affected stock is quarantined immediately
    When a breach is recorded
    Then all vaccine stock in the affected refrigerator is quarantined in the system
    And quarantined stock cannot be selected for administration

  Scenario: The state immunisation programme is contacted and the advice recorded
    When the breach is being managed
    Then contacting the state or territory immunisation programme is a required step
    And their advice and the resulting disposition are recorded

  @safety-critical
  Scenario: Patients who received doses from affected stock are identified
    Given doses were administered from a batch in the affected refrigerator during the excursion
    When the breach is investigated
    Then those patients are identified by batch number
    And a recall is created for revaccination

  Scenario: The breach creates an incident record
    When the breach is recorded
    Then an incident record is created for quality improvement review
