# ============================================================================
# metadata:
#   status: inactive
#   implemented: false
#   automation: none
#   spec: docs/10-practice-setup/03-practitioners-and-credentialing.md
#   standards: [GP3.1, C5.2, C3.4]
#   domain: practice-setup
#   last_reviewed: 2026-08-25
# ============================================================================
@inactive @not-implemented @practice-setup @safety-critical
Feature: Registrar supervision arrangements
  As a practice owner who trains registrars
  I want supervision arrangements recorded and enforced
  So that registrars are never working without the supervision their term requires

  Background:
    Given I am signed in as the owner of "Brunswick Family Practice"
    And "Dr Priya Shah" is a GP registrar in term "GPT1"

  Scenario: A registrar cannot be activated without a supervisor
    When I try to activate "Dr Priya Shah" with no supervision relationship recorded
    Then activation is blocked
    And I am told a supervisor and supervision level are required

  Scenario: Recording a supervision relationship
    When I record:
      | field             | value            |
      | supervisor        | Dr Anita Raman   |
      | supervision_level | direct           |
      | training_term     | GPT1             |
      | effective_from    | 2026-02-02       |
      | effective_to      | 2026-08-01       |
    Then the relationship is active
    And it appears as accreditation evidence for GP3.1

  @safety-critical
  Scenario: Sessions without supervisor cover are flagged before they happen
    Given "Dr Priya Shah" requires on-site supervision
    And no supervisor is rostered at "Brunswick" on Friday afternoon
    When her Friday afternoon session is scheduled
    Then the session is flagged "no supervisor rostered"
    And the practice manager is notified

  Scenario: An expired supervision relationship raises an alert
    Given the supervision relationship ended yesterday
    When the daily check runs
    Then an urgent task is created
    And "Dr Priya Shah" is flagged as requiring a current supervision arrangement
