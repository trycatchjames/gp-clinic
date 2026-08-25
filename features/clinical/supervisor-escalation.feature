# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/40-clinical/14-registrar-supervision.md
#   standards: [GP3.1, C5.2, C3.4, QI3.1]
#   domain: clinical
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @clinical @safety-critical
Feature: Escalating to a supervisor
  As a GP registrar
  I want to reach my supervisor from inside the consultation
  So that I get help while the patient is still in the room

  Scenario Outline: Escalation options from within a consultation
    When I choose "<option>"
    Then "<effect>"

    Examples:
      | option                    | effect                                                      |
      | Ask now                   | an urgent request appears on the supervisor's screen with the note attached |
      | Flag for review           | the encounter goes to the supervisor's review list          |
      | Request joint consultation| the supervisor is asked to join the consultation            |

  @safety-critical
  Scenario: Urgent escalations must be acknowledged
    Given I raised an urgent escalation
    When it is not acknowledged within the configured window
    Then it escalates further

  @compliance
  Scenario: Every escalation is recorded
    When an escalation is resolved
    Then what was asked, who responded, what was advised and when are all recorded

  @offline @safety-critical
  Scenario: Escalation is not available offline
    Given I have no connectivity
    When I try to escalate
    Then I am told escalation cannot be queued
    And I am directed to speak to my supervisor now
