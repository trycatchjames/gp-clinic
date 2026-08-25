# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/60-practice-operations/02-clinical-governance-and-incidents.md
#   standards: [C6.3, C6.4, QI3.1, QI3.2]
#   domain: practice-operations
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-operations @compliance @safety-critical
Feature: Privacy incidents
  As a practice
  I want privacy incidents assessed against the notifiable breach criteria
  So that we make the right decision about notification

  Scenario Outline: Privacy incident types
    When I report a privacy incident of type "<type>"
    Then the structured privacy assessment is opened

    Examples:
      | type                        |
      | unauthorised access         |
      | misdirected communication   |
      | lost or stolen device       |
      | inappropriate disclosure    |

  @compliance
  Scenario: The assessment captures what is needed to decide
    When the privacy assessment is completed
    Then what data was involved, how many people, containment actions and the risk of serious harm are recorded

  @compliance
  Scenario: The system prompts but does not decide
    When the risk of serious harm assessment is completed
    Then the notification decision is recorded by a named person
    And the system does not make the determination itself

  Scenario: Affected individuals are tracked
    Given 12 patients were affected
    Then each is recorded
    And any notification to them is logged

  Scenario: Unauthorised access is investigated from the audit log
    Given an unauthorised access incident is reported
    Then the relevant audit log entries are attached to the incident
